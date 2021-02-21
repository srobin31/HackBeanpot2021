import spotipy
from spotipy.oauth2 import SpotifyOAuth

from constants import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI

scopeless_client = spotipy.Spotify(
    auth_manager=SpotifyOAuth(
        client_id=CLIENT_ID, 
        client_secret=CLIENT_SECRET, 
        redirect_uri=REDIRECT_URI
    )
)

modify_lib_client = spotipy.Spotify(
    auth_manager=SpotifyOAuth(
        client_id=CLIENT_ID, 
        client_secret=CLIENT_SECRET, 
        redirect_uri=REDIRECT_URI,
        scope='user-library-modify'
    )
)

def get_recommendable_genres():
    genres = scopeless_client.recommendation_genre_seeds()['genres']
    return {'genres': genres}

def get_track_recommendations(seed_genres):
    recommendations = scopeless_client.recommendations(seed_genres=seed_genres, limit=50)['tracks']
    recs = []
    for rec in recommendations:
        if rec['preview_url']:
            track = {
                'id': rec['id'],
                'name': rec['name'],
                'artists': [artist['name'] for artist in rec['artists']],
                'preview': rec['preview_url'],
                'photo': get_album_cover(rec['id'])
            }
            recs.append(track)
    return recs

def get_album_cover(id):
    album = scopeless_client.track(id)['album']
    return album['images'][0]['url']

def save_to_library(track_id):
    client.current_user_saved_tracks_add(track_id)
    return True