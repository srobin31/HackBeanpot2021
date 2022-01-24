import React, { Component } from 'react';
import TinderCard from 'react-tinder-card';
import ReactAudioPlayer from 'react-audio-player';
class SongCard extends Component{
    constructor(props) {
        super(props);
        this.state = {
            yesCount: 0, 
            seenSongs: [],
            chosenSongs: [],
            playing: true,
            currentSong: this.props.songs[this.props.songs.length - 1],
            currentIndex: this.props.songs.length - 1,
        };
    }

    // swipe direction handler (yes or no)
    handleSwipe(direction, curSong) {
        console.log('Current: ' + curSong)
  
        if (direction === 'left') {
            this.handleLeftSwipe(curSong);
        }

        else if (direction === 'right') {
            this.handleRightSwipe(curSong);
        }
        
        this.setState({
            currentSong: this.props.songs[this.state.currentIndex - 1],
            currentIndex: this.state.currentIndex - 1
        });
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
        fetch('/save_song?id=' + curSong.id).then(res => res.json()).then(data => {return null});
        this.setState((prevState) => {
          return { 
            yesCount: prevState.yesCount + 1, 
            seenSongs: prevState.seenSongs.concat(curSong),
            chosenSongs: prevState.chosenSongs.concat(curSong)
          }
        }
    )};
    
    getAudioPlayer() {
        this.setState();
        if (this.state.currentSong) {
            return <ReactAudioPlayer
            src={this.state.currentSong.preview}
            autoPlay
            controls/>
        } else {
            return <div />
        }
    }

    render() {
        return (
            <div className='cardContainer'>
                {this.getAudioPlayer()}
                {this.props.songs.map((song) =>
                    <TinderCard className='swipe' 
                        key={song.name} 
                        preventSwipe={['up', 'down']}
                        onSwipe={(dir) => this.handleSwipe(dir, song)}
                    >
                    <div style={{ backgroundImage: 'url(' + song.photo + ')' }} className='card'>
                        <h2>{song.name}</h2>
                        <h4>{song.artists}</h4>
                    </div>
                    </TinderCard>
                )}
                
            </div>
        )
    }
}

export default SongCard;
