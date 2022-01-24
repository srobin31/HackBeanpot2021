from flask import Flask, request

from constants import GENRES
from utils import *

app = Flask(__name__)

@app.route('/get_genres')
def get_genres():
    return {'genres': list(GENRES.values())}

@app.route('/get_recommendations')
def get_recommendations():
    genres = request.args.getlist('genre')
    genre_keys = list(GENRES.keys())
    genre_values = list(GENRES.values())
    seeds = []
    for genre in genres:
        pos = genre_values.index(genre)
        seeds.append(genre_keys[pos])
    recs = get_track_recommendations(seeds)
    return {'recommendations': recs}

@app.route('/save_song')
def save_song():
    id = request.args.getlist('id')
    try:
        save_to_library(id)
        return {'success': True}
    except:
        return {'success': False}

if __name__== '__main__':
    app.run()
