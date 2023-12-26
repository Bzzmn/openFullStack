import { useState, useEffect } from 'react'
import countrySrv from './services/countries'
import '../src/app.css'
import Results from './components/results'

function App() {
  const [ inputField, setInputField ] = useState('')
  const [ countries, setCountries ] = useState([])
  const [ globalData, setGlobalData ] = useState([])
  const [ temp, setTemp ] = useState('')
  const [ icon, setIcon ] = useState('')
  const [ wind, setWind ] = useState('')

  useEffect(() => {
    countrySrv
      .getAll()
      .then( response => setGlobalData(response))
  }, [])

  const handleShown = (countryName) => {
    setInputField(countryName.toLowerCase())
  }
  const handleInputChange = (event) => {
    setInputField(event.target.value.toLowerCase())
    if(event.target.value !== ''){
      setCountries(globalData)
    } else {
      setCountries([])
    }
  }
  const handleWeather = (response) => {
    setTemp((response.main.temp - 273.15).toFixed(1))
    setIcon(response.weather[0].icon)
    setWind(response.wind.speed)
  }
  return (
    <>
      <div>
        <form action="">
          find countries: <input type="text" onChange={handleInputChange} />
        </form>
      </div>
      <div>
        <Results 
          filter={inputField}
          countries={countries} 
          handleShown={handleShown} 
          handleWeather={handleWeather}
          temp={temp}
          wind={wind}
          icon={icon}
        />
      </div>
    </> 
  )
}

export default App
