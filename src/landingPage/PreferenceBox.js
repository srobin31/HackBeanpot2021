import {React, useState, useEffect, useReducer} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './landing.css'

const PreferenceBox = ({title, buttonInfo, currSelected, maxSelections, onSelectionChange}) => {
    const [selected, setSelected] = useState([]);
    
    function handleChange(id) {
        onSelectionChange(id);
    }

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
                            handleChange(id);
                        }}
                        className={isSelected(id) ? 'selected':'unselected'} 
                    >
                    <button >{id}</button> 
                </div>
                )}            
            </div>            
        </div>
    );

    function makeSelected(selectedArray, id, maxSelections) {
        if (selectedArray.indexOf(id) < 0) {
            selectedArray.push(id);
            if(selectedArray.length > maxSelections){
                selectedArray = selectedArray.slice(1, maxSelections + 1);
            }
        }
        else {
            selectedArray.splice(selectedArray.indexOf(id), 1);
        }
        return selectedArray;
    };

    function isSelected(id) {
        return (currSelected.indexOf(id) >= 0);
    }
}

PreferenceBox.defaultProps = { 
    title: "Genre",
    buttonInfo: [{id: "Pop"},{id: "Rock"},{id: "Hiphop"},{id: "Country"},{id: "K-Pop"},{id: "J-Pop"}]
};

export default PreferenceBox;