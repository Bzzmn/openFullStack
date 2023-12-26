function Weather( { temp, wind, icon, capital } ){
    return (
        <div>
            <h3>Wheather in {capital}</h3>
            <p>temperature: {`${temp} Celcius`}</p>
            <i><img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="wheather icon" className="wheather-icon"/></i>
            <p>wind: {wind} m/s</p>
        </div>
    )
}

export default Weather
