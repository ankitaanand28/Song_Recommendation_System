const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

// Sample data
const songData = [
    { track_uri: "0dRhSF9LV0HR8Jwd3MMMKJ", artist_uri: "26dSoYclwsYLMAKD3tpOr4", album_uri: "0z7pVBGOD7HCIB7S8eLkLI" },
    { track_uri: "7cC1wC4UcN66T9ve8KXqwi", artist_uri: "5YGY8feqx7naU7z4HrwZM6", album_uri: "6cfcdjtSR9ARnpnpwtEGaS" },
    // Add more data as needed
];

app.get('/', (req, res) => {
    // Assuming you pass the track URI as a query parameter
    const trackUriToDisplay = req.query.trackUri || "0dRhSF9LV0HR8Jwd3MMMKJ";

    // Render the HTML file with the track URI
    res.sendFile(__dirname + '/index.html', { songData, trackUriToDisplay });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
