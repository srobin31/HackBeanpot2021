import {
    React,
    useState,
    useEffect,
    useReducer,
  } from 'react';
  import './App.css'
  
  import PreferenceBox from './landingPage/PreferenceBox'
  import MainPage from './mainpage/MainPage'
  
  import { Carousel } from 'react-bootstrap';
  
  const MAX_SELECTIONS = 5;
  
  function Landing() {
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
      fetch('/get_genres').then(res => res.json()).then(data => {
        setGenres(data.genres);
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
          <Carousel interval={null} >
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
          <p>Selected</p>
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
   
    return (
      <div className='app'> 
        {showSuggestions ? < MainPage s /> : <div> {getCarousel()} {getSelected()} </div>} 
        <div className='row'>
          <div className='submit'>
            <button onClick={() => setShowSuggestions(true)} > Generate! </button>
          </div>
        </div>       
      </div>
    )
  };
  
  export default Landing;