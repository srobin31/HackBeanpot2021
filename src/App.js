import {
  React,
  useState,
  useEffect,
  useReducer,
} from 'react'

import { Carousel } from 'react-bootstrap'
import Session from 'react-session-api'
import uuid from 'react-uuid'

import './App.css'
import PreferenceBox from './landingPage/PreferenceBox'
import MainPage from './mainpage/MainPage'


const MAX_SELECTIONS = 5;

function App() {
  const [spotifyConnect, setSpotifyConnect] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [genres, setGenres] = useState([]);
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const prefBoxes = [];
  const buttonInfos = getPanels();
  buttonInfos.forEach((panel) => {
    prefBoxes.push(<PreferenceBox buttonInfo={panel}/>)
  });

  const [selected, setSelected] = useState([]);

  useEffect(() => {
    var url = window.location.href
    var args = url.split('?')[1]
    fetch(`/get_genres?${args}`).then(res => res.json()).then(data => {
      Session.set('session_id', data.session_id)
      setGenres(data.genres)
      setSpotifyConnect(data.spotify)
    })
  }, []);

  function getPanels() {
    var panels = [];
    var i, j, temp, chunk = 15;
    for (i=0,j=genres.length; i<j; i+=chunk) {
      var panel = [];
      temp = genres.slice(i,i+chunk);
      temp.forEach((genre) => {
        panel.push({id: genre});
      });
      panels.push(panel);
    }
    return panels;
  };

  function handleSelectionChange(id) {
    forceUpdate();
    setSelected(makeSelected(selected, id));
  }

  function makeSelected(selectedArray, id) {
    if (selectedArray.indexOf(id) < 0) {
        selectedArray.push(id);
        if (selectedArray.length > MAX_SELECTIONS){
            selectedArray = selectedArray.slice(1, MAX_SELECTIONS + 1);
        }
    }
    else {
        selectedArray.splice(selectedArray.indexOf(id), 1);
    }
    return selectedArray;
  }

  function getCarousel() {
    return (
      <div className="carousel">
        <Carousel
          interval={null}
          indicators={false}
         >
          {buttonInfos.map((buttonInfo) => {
            return <Carousel.Item>
                    <PreferenceBox
                      buttonInfo={buttonInfo}
                      currSelected={selected.slice()}
                      maxSelections={MAX_SELECTIONS}
                      onSelectionChange={handleSelectionChange}
                    />
                    </Carousel.Item>
          })}
        </Carousel>
      </div>
    );
  };

  function getSelected() {
    return (
      <div className="selectedTypes">
        <h4>Selected</h4>
        <div className="chosenList">
          {selected.map((genre) =>
          <div className="chosenButton">
            {genre}
          </div>
        )}
        </div>
      </div>
    )
  }

  function renderApp() {
    if (spotifyConnect === true) {
      if (showSuggestions) {
        return <MainPage selection={selected} />
      } else {
        return <div> <h4>Please select up to 5 genres</h4>{getCarousel()} {getSelected()} </div>
      }
    } else {
      return <a href={spotifyConnect}>Login to Spotify</a>
    }
  }

  return (
    <div className='app'>
      {renderApp()}
      {spotifyConnect === true ?
        <div className='row'>
          <div className={showSuggestions ? 'remove': 'submit' }>
            <button onClick={() => setShowSuggestions(true)} > Generate! </button>
          </div>
        </div>
        :
        <div></div>
      }

    </div>
  )
};

export default App;