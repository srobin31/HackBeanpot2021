import {React, useState, useEffect, useReducer} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button,ToggleButtonGroup ,ToggleButton } from 'react-bootstrap';
import './landing.css'

const PreferenceBox = ({title, buttonInfo,maxSelections}) => {
    const [selected, setSelected] = useState([]);
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    return (
        <div className="preferenceBox">
            <div className="preferenceType"> 
                <h1>{title}</h1>
            </div>
            <div className="preferenceChoices">
                {buttonInfo.map(({id,i}) => 
                <div 
                    key={id} 
                    onClick={() => { 
                        setSelected(makeSelected(selected, id, maxSelections)); 
                        forceUpdate();
                        console.log(selected);
                    }}
                    className={isSelected(selected,id) ? 'selected':'unSelected'} 
                >
                    <button >{id}</button> 
                </div>

                )}

            
            </div>
            <div className="selectedTypes" >
                <p>Selected </p>
                <div className="chosenList">
                    {selected.map((x) => 
                        <div 
                        className="chosenButton"
                        onClick={() => forceUpdate()}
                        >
                            {x}
                        </div>
                    )}
                
                </div>
        </div>
            
        </div>
    );
}

function makeSelected(selectedArray, id, maxSelections) {

    if(selectedArray.length == maxSelections){
        selectedArray = selectedArray.slice(1, maxSelections);
    }
    if (selectedArray.indexOf(id) < 0) {
        selectedArray.push(id);
        
    }
    else {
        selectedArray.splice(selectedArray.indexOf(id), 1);
    }
    
    return selectedArray;
  }

function isSelected(selectedArray, id) {
    return (selectedArray.indexOf(id) >= 0);
}

PreferenceBox.defaultProps = { 
    // we should get these from the backend lol
    title: "Genre",
    buttonInfo: [{id: "Pop"},{id: "Rock"},{id: "Hiphop"},{id: "Country"},{id: "K-Pop"},{id: "J-Pop"}],
    maxSelections: 5
}

export default PreferenceBox;
