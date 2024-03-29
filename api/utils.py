from spotipy import Spotify
from spotipy.util import prompt_for_user_token
from spotipy.oauth2 import SpotifyOAuth

from constants import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, GENRES

SCOPE = 'user-library-modify'
CACHE = '/tmp/'

def spotify_connect(session_id, code=''):
    '''
    Connect to the Spotify API using the token associated with the given session
    ID, generating one if it does not already exist.
    '''
    token = None
    cache_path = CACHE + session_id

    sp_oauth = SpotifyOAuth(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, scope=SCOPE, cache_path=cache_path)
    token_info = sp_oauth.get_cached_token()
    if token_info:
        token = token_info['access_token']
    elif code:
        token_info = sp_oauth.get_access_token(code)
        token = token_info['access_token']

    if token:
        return Spotify(token, requests_timeout=30, retries=1)
    else:
        return sp_oauth.get_authorize_url()

def get_recommendable_genres(session_id, code):
    spotify = spotify_connect(session_id, code)
    if isinstance(spotify, str):
        return {'session_id': session_id, 'genres': list(GENRES.values()), 'spotify': spotify}
    else:
        return {'session_id': session_id, 'genres': list(GENRES.values()), 'spotify': True}

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
