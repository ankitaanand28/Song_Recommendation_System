# Building a Song Recommendation System with Spotify Million Playlist Dataset
#### By - Ankita Anand (210150006, DS&AI)


#### [Project Proposal](https://drive.google.com/file/d/1xDezRtAnv23_cfjABftuOWQZi_RVlW2P/view?usp=sharing) file:  "Project_Proposal (in IEEE format).pdf".
#### [Project midterm presentation](https://drive.google.com/file/d/1bVJNgKCRU4rcpWQ6vYt4219Z9QTLDyWA/view?usp=sharing) : "MidTerm_Presentation.pdf".
#### [Project Final Report](https://drive.google.com/file/d/1Oh6tc4confHsmuZnQTbV9o5QKhdn2iGW/view?usp=sharing) file : "Project_Final_Report.pdf".
#### [Project Final demo video](https://clipchamp.com/watch/xyujfb1dDwj) file with voiceover : "DA331(Project demo video).mp4"


<br> 

##### My Contributions -
<li> Prepared Proposal and converted it into IEEE format.</li>
<li> Prepared processed dataset using the Spotify million playlist dataset. </li>
<li> Prepared slides on dataset preparation and processing , and on querying methodologies and frontend in mid term presentation.</li>
<li> Prepared frontend to deploy model built using Streamlit, and created webpages that connected MongoDB database for applying filters.</li>
<li> Prepared Demo-Video to showcase the frontend prepared by me.</li>
<li> Prepared final report in IEEE format on the project completed.</li>

## Demo Video (without voiceover)


https://github.com/chiranjibsuriitg/DA331fall23_210150006/assets/95133586/fde0908c-661c-40a0-acee-46b1df9c68aa


## DATA
For this project, I'm using the Million Playlist Dataset, which, as its name implies, consists of one million playlists. contains a number of songs, and some metadata is included as well, such as the name of the playlist, duration, number of songs, number of artists, etc.

It is created by sampling playlists from the billions of playlists that Spotify users have created over the years. Playlists that meet the following criteria were selected at random:
<ul>
<li>Created by a user that resides in the United States and is at least 13 years old</li>
<li>Was a public playlist at the time the MPD was generated</li>
</li>Contains at least 5 tracks</li>
<li>Contains no more than 250 tracks</li>
<li>Contains at least 3 unique artists and 2 unique albums </li>
<li>Does not have an offensive title </li>
 </ul>
 
## Feature Extraction using Spotify API

 
 The first step will be to obtain keys to use. We'll need a Spotify for developers account for this. In spotify.yaml keep the public and private keys that will be required to use the API.

 Spotify credentials should be stored the in the a Spotify.yaml file with the first line as the credential id and the second line as the secret key:
   
``` python
Client_id : ************************
client_secret : ************************
```
To access this credentials, please use the following code:


``` python
stream= open("Spotify/Spotify.yaml")
spotify_details = yaml.safe_load(stream)
auth_manager = SpotifyClientCredentials(client_id=spotify_details['Client_id'],
                                        client_secret=spotify_details['client_secret'])
sp = spotipy.client.Spotify(auth_manager=auth_manager)
```

#### Audio Features and description
<ol>
 <li><b> Acousticness </b>  A confidence measure from 0.0 to 1.0 of whether the track is acoustic. 1.0 represents high confidence the track is acoustic. </li>
  <li>  <b> Danceability </b>describes how suitable a track is for dancing . A value of 0.0 is least danceable and 1.0 is most danceable. </li>
   <li> <b>Energy  </b>is a measure from 0.0 to 1.0 and represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.</li>
    <li> <b> Instrumentalness </b> Predicts whether a track contains no vocals. "Ooh" and "aah" sounds are treated as instrumental in this context. Rap or spoken word tracks are clearly "vocal". The closer the instrumentalness value is to 1.0, the greater likelihood the track contains no vocal content. Values above 0.5 are intended to represent instrumental tracks, but confidence is higher as the value approaches 1.0. </li>
    <li> <b> Key </b> The key the track is in. Integers map to pitches using standard Pitch Class notation.  If no key was detected, the value is -1. </li>
    <li> <b>Liveness </b> Detects the presence of an audience in the recording. Higher liveness values represent an increased probability that the track was performed live. A value above 0.8 provides strong likelihood that the track is live. </li>
    <li> <b> Loudness </b>  The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Values typically range between -60 and 0 db. </li>
    <li> <b>Mode </b> indicates the modality (major or minor) of a track, the type of scale from which its melodic content is derived. Major is represented by 1 and minor is 0. </li>
    <li> <b>Speechiness </b> detects the presence of spoken words in a track. The more exclusively speech-like the recording (e.g. talk show, audio book, poetry), the closer to 1.0 the attribute value. Values above 0.66 describe tracks that are probably made entirely of spoken words. Values between 0.33 and 0.66 describe tracks that may contain both music and speech, either in sections or layered, including such cases as rap music. Values below 0.33 most likely represent music and other non-speech-like tracks. </li>
    <li><b> Tempo </b> The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration. </li>
    <li><b>Time Signature </b> An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4". </li>
    <li><b>Valence </b> A measure from 0.0 to 1.0 describing the musical positiveness conveyed by a track. Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry). </li>
</ol>

## Code

### Reading1M_dataset_extracting_URL.ipynb and extracting_track_audio_album_features_csv
This notebook reads the main.json files containing the playlists in order to train the model and generate recommendations.
The loop_slices() function will go through as many slices as desired to extract the unique track URIs from the playlists for the content-based recommendation system.
Using the Spotify API for Feature Extraction (Audio Features, Track Release Date, Track Popularity, Artist Popularity, Artist Genres) and Saving Results to a CSV Files and Errors to a Log File.
``` python
f = open('data/audio_features.csv','a')
e=0
for i in tqdm(range(0,len(t_uri),100)):
    try:
     track_feature = sp.audio_features(t_uri[i:i+100])
     track_df = pd.DataFrame(track_feature)
     csv_data = track_df.to_csv(header=False,index=False)
     f.write(csv_data)
    except Exception as error:
        e+=1
        r = open("audio_features_log.txt", "a")
        r.write(datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S")+": "+str(error)+'\n')
        r.close()
        time.sleep(3)
        continue
r = open("audio_features_log.txt", "a")
r.write(datetime.datetime.now().strftime("%d.%b %Y %H:%M:%S")+" _________________________ "+"Total Number Of Errors : "+str(e)+" _________________________ "+'\n')
r.close()
f.close()
```

## Clone Spotify Website look

<img width="958" alt="image" src="https://github.com/chiranjibsuriitg/DA331fall23_210150006/assets/95133586/892f1860-16c0-4ad6-bb43-9f2564206714">



<br>



