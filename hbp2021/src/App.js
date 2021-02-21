import {React, useState, useEffect, useReducer} from 'react';
import './App.css'
import Switch from 'react-ios-switch'
​
import Advanced from './examples/Advanced'
import MainPage from './mainpage/MainPage'
​
function App () {
  const [showAdvanced, setShowAdvanced] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [topSong, setTopSong] = useState('')
  const [genres, setGenres] = useState([])
​
  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    })
  }, []);
​
  useEffect(() => {
    fetch('/top_song').then(res => res.json()).then(data => {
      setTopSong(data.top_song);
    })
  }, []);
​
  useEffect(() => {
    fetch('/get_genres').then(res => res.json()).then(data => {
      setGenres(data.genres);
    })
  }, []);
​
  return (
    <div className='app'>
      <MainPage />
      {showAdvanced ? <Advanced /> : <MainPage />}
      <div className='row'>
        <p style={{ color: '#fff' }}>Show advanced example</p> <Switch checked={showAdvanced} onChange={setShowAdvanced} />
      </div>
    </div>
  )
}
​
export default App;