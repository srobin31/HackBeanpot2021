import base64
import requests

from spotipy import Spotify
from spotipy.util import prompt_for_user_token

from constants import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, GENRES

scope = 'user-library-modify'

def spotify_connect(session_id):
    '''
    Connect to the Spotify API using the token associated with the given session
    ID, generating one if it does not already exist.
    '''
    token = None
    cache = f'/tmp/{session_id}'
    try:
        token = prompt_for_user_token(
            username=session_id,
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            redirect_uri=REDIRECT_URI,
            scope=scope,
            cache_path=cache
        )
    except:
        url = 'https://accounts.spotify.com/api/token'
        msg = f'{CLIENT_ID}:{CLIENT_SECRET}'.encode('ascii')
        base64_msg = base64.b64encode(msg).decode('ascii')
        headers = {'Authorization': f'Basic {base64_msg}'}
        data = {'grant_type': 'client_credentials'}
        r = requests.post(url, headers=headers, data=data)
        token = r.json()['access_token']
        with open(cache, "w") as f:
            f.write(r.text)

    if token:
        return Spotify(auth=token)
    else:
        print('Could not retrieve Spotify access token.')
        return None

def get_recommendable_genres():
    return {'genres': list(GENRES.values())}

def get_track_recommendations(session_id, seed_genres):
    spotify = spotify_connect(session_id)
    recommendations = spotify.recommendations(seed_genres=seed_genres, limit=50)['tracks']
    recs = []
    for rec in recommendations:
        if rec['preview_url']:
            track = {
                'id': rec['id'],
                'name': rec['name'],
                'artists': [artist['name'] for artist in rec['artists']],
                'preview': rec['preview_url'],
                'photo': get_album_cover(spotify, rec['id'])
            }
            recs.append(track)
    return recs

def get_album_cover(spotify, track_id):
    album = spotify.track(track_id)['album']
    return album['images'][0]['url']

def save_to_library(session_id, track_id):
    spotify = spotify_connect(session_id)
    spotify.current_user_saved_tracks_add([track_id])
    return True
