// server.js

const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();

const port = process.env.PORT || 3000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'bda_project';
const collectionName = 'dataset';

app.get('/', async (req, res) => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Query MongoDB for tracks with Acousticness > 0.989
    const query = { acousticness: { $gt: 0.989 } };
    const projection = { _id: 0, track_uri: 1 };
    const sort = { acousticness: -1 };
    const limit = 20;
    const result = await collection.find(query).project(projection).sort(sort).limit(limit).toArray();

    // Generate HTML with Spotify embed links
    const spotifyEmbeds = result.map(({ track_uri }) => generateSpotifyEmbedLink(track_uri));
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Acoustic Songs</title>
      </head>
      <body>
        <h1>Top 20 Acoustic Songs</h1>
        ${spotifyEmbeds.join('\n')}
      </body>
      </html>
    `;

    res.send(html);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  } finally {
    // Close the MongoDB connection
    client.close();
  }
});

function generateSpotifyEmbedLink(songUri) {
  return `https://open.spotify.com/embed/track/${songUri}`;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

