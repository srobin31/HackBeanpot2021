import os
from flask import Flask, request, send_from_directory
from flask_cors import CORS, cross_origin

from constants import GENRES
from utils import *

app = Flask(__name__, static_folder='../build', static_url_path='')
cors = CORS(app)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/get_genres')
@cross_origin()
def get_genres():
    return {'genres': list(GENRES.values())}

@app.route('/get_recommendations')
@cross_origin()
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
@cross_origin()
def save_song():
    id = request.args.getlist('id')
    try:
        save_to_library(id)
        return {'success': True}
    except:
        return {'success': False}

if __name__== '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
