import os
import uuid
from flask import Flask, request, send_from_directory
from flask_cors import CORS, cross_origin

from utils import *

app = Flask(__name__, static_folder='../build', static_url_path='')
cors = CORS(app)

@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/get_genres')
@cross_origin()
def get_genres():
    session_id = str(uuid.uuid4())
    code = request.args.get('code')
    return get_recommendable_genres(session_id, code)

@app.route('/get_recommendations')
@cross_origin()
def get_recommendations():
    session_id = request.args.get('session_id')
    genres = request.args.getlist('genre')
    genre_keys = list(GENRES.keys())
    genre_values = list(GENRES.values())
    seeds = []
    for genre in genres:
        pos = genre_values.index(genre)
        seeds.append(genre_keys[pos])
    recs = get_track_recommendations(session_id, seeds)
    return {'recommendations': recs}

@app.route('/save_song')
@cross_origin()
def save_song():
    session_id = request.args.get('session_id')
    track_id = request.args.get('track_id')
    try:
        save_to_library(session_id, track_id)
        return {'success': True}
    except:
        return {'success': False}

if __name__== '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)

