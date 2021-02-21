import React, { useState, Component } from 'react';
import TinderCard from 'react-tinder-card';

// replace with initial song recommendations from backend
const initialSongs = [
    {
      title: 'Song 1',
      artist: 'Richard Hendricks',
      url: './img/richard.jpg'
    },
    {
      title: 'Song 2',
      artist: 'Dinesh Hendricks',
      url: './img/dinesh.jpg'
    },
    {
      title: 'Song 3',
      artist: 'Monica Hendricks',
      url: './img/monica.jpg'
    },
    {
      title: 'Song 4',
      artist: 'Erlich Hendricks',
      url: './img/erlich.jpg'
    },
    {
      title: 'Song 5',
      artist: 'Jared Hendricks',
      url: './img/jared.jpg'
    }
  ]

class SongCard extends Component{
    constructor() {
        super();

        this.state = {
            yesCount: 0, 
            seenSongs: [],
            chosenSongs: []
        }
    }

    // swipe direction handler (yes or no)
    handleSwipe(direction, curSong){
        console.log('Current: ' + curSong)
  
        if (direction === 'left') {
            this.handleLeftSwipe(curSong);
        }

        else if (direction === 'right') {
            this.handleRightSwipe(curSong);
        }

        console.log(this.state);
        if (this.state.yesCount === 5) {
            this.generateSongs(20, curSong)
        }
    }
  
    outOfFrame(name){
      console.log(name + ' left the screen!')
    }

    handleLeftSwipe(curSong) {
        this.setState((prevState) => {
            return {
                yesCount: prevState.yesCount,
                seenSongs: prevState.seenSongs.concat(curSong),
                chosenSongs: prevState.chosenSongs
            }
        })
    }

    handleRightSwipe(curSong) {
        this.setState((prevState) => {
          // Important: read `state` instead of `this.state` when updating.
          return { 
            yesCount: prevState.yesCount + 1, 
            seenSongs: prevState.seenSongs.concat(curSong),
            chosenSongs: prevState.chosenSongs.concat(curSong)
          }
        }
    )};

    generateSongs(curSong, numSongs){
        // generate/render songs based off of liked songs
        // don't add song if it is in "seen" songs
        // add to end of songs list 
        const newSongSuggestions = [];
        
        this.setState((prevState) => {
            return {
                yesCount: 0,
                seenSongs: prevState.seenSongs.concat(curSong),
                chosenSongs: prevState.chosenSongs.concat(curSong),
            }
        })
    }

    render() {
        return (
            <div className='cardContainer'>
                {initialSongs.map((song) =>
                    <TinderCard className='swipe' 
                        key={song.title} 
                        preventSwipe={['up', 'down']}
                        onSwipe={(dir) => this.handleSwipe(dir, song.title)}>
                            <div style={{ backgroundImage: 'url(' + song.url + ')' }} className='card'>
                            <h2>{song.title}</h2>
                            <h4>{song.artist}</h4>
                            </div>
                    </TinderCard>
                )}
            </div> 
        )
    }
}

export default SongCard;
