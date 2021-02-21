import React, { useState, useEffect } from 'react';
import SongCard from './SongCard';

function MainPage (selection_obj) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const selection = selection_obj['selection'];
    var query_string = [];
    selection.forEach((genre) => {
      query_string.push('genre=' + encodeURIComponent(genre));
    });
    fetch('/get_recommendations?'.concat(query_string.join('&'))).then(res => res.json()).then(data => {
      setRecommendations(data['recommendations']);
    });
  }, []);

  function getSongCard() {
    if (recommendations.length) {
      return <SongCard songs={recommendations.slice()}/>;
    } else {
      return <div />;
    }
  };

  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <h1>Spotifinder</h1>
      {getSongCard()}
    </div>
  );
};


export default MainPage;
