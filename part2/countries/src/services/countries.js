import axios from 'axios'

const getAll = () => {
    const request = axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    return request.then(response => response.data)
}

const getWeather = (lat, lon) => {
    const apiKey = import.meta.env.VITE_OPENWEATHER_KEY
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`) 
    return request.then(response => response.data)
}

export default { getAll, getWeather }

