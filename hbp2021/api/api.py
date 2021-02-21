from flask import Flask

import time
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

app = Flask(__name__)

cid = '01a07d7ec2034df391340d35399df853'
secret = '921b6b24443446429bd20e4235cd80f0'

client_credentials_manager = SpotifyClientCredentials(client_id=cid, client_secret=secret)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

@app.route('/time')
def get_current_time():
    return {'time': time.time()}

@app.route('/top_song')
def get_top_song():
    track_result = sp.search(q='year:2018', type='track', limit=1,offset=0)['tracks']['items'][0]
    track_name = track_result['name']
    artist_name = track_result['artists'][0]['name']
    return {'top_song': track_name + ' by ' + artist_name}

@app.route('/get_genres')
def get_genres():
    genres = sp.recommendation_genre_seeds()['genres']
    return {'genres': genres}