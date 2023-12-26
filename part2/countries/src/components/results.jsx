import Weather from "./weather";
import { useEffect } from "react";
import countrySrv from '../services/countries'

function Results({ filter, countries, handleShown, handleWeather, temp, wind, icon}) {
    
    function generateListItems(languages) {
        let listItems = [];
        for (let key in languages) {
            if (languages.hasOwnProperty(key)) {
                listItems = listItems.concat(languages[key])
            }
        }
        return listItems;
    }

    const countriesFilter = countries.filter(c => { return c.name.common.toLowerCase().includes(filter)})
    if (countriesFilter.length !== 1){
        if(countriesFilter.length > 10){
            return <p>Too many matches, be more specific</p>
        } else {
            return (
                <ul>
                    {countriesFilter.map( country => <li key={country.name.common}>{country.name.common} <button onClick={() => handleShown(country.name.common)}>Show</button></li>)}
                </ul>
            )
        } 
        } else {
            const lat = countriesFilter[0].capitalInfo.latlng[0]
            const lng = countriesFilter[0].capitalInfo.latlng[1]
            useEffect (() => {
                countrySrv
                    .getWeather(lat, lng)
                    .then(response => handleWeather(response))
            } ,[])
            return (
                <>
                    <h2>{countriesFilter[0].name.common}</h2>
                    <ul>
                        <li><strong>capital:</strong> {countriesFilter[0].capital}</li>
                        <li><strong>area:</strong> {countriesFilter[0].area} Km2</li>
                    </ul>
                    <h3>Languages:</h3>
                    <ul>
                        {generateListItems(countriesFilter[0].languages).map(lang => <li key={lang}>{lang}</li>)}
                    </ul>
                    <div>
                        <img src={countriesFilter[0].flags.svg} alt="flag" className='country-flag'/>
                    </div>
                    <Weather temp={temp} wind={wind} icon={icon}  capital={countriesFilter[0].capital} />
                  
                </>
            ) 
        }
}

export default Results