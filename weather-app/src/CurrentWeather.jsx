import React, { useState, useEffect } from 'react';

const CurrentWeather = () => {
  // skapa tre variabler
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unit, setUnit] = useState('metric'); // standard Celsius
  const [searchLocation, setSearchLocation] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);

  // Använd useEffect hook för hämtat the nuvarande väder baserad på användarens plats
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const apiKey = 'ec8a9e0735a382ff5d6dafc6a4333c84';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      setCurrentWeather(data);
    });
  }, [unit]); // Re-fetch the weather whenever the unit changes

  // Definera funktion att välja enheter mellan Celsius och Fahrenheit
  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  // Definera funktion att hantera ändringar till sökningen
  const handleSearchLocationChange = (event) => {
    setSearchLocation(event.target.value);
  };

  // funktion för hantera form när man ska söka
  const handleSearchLocationSubmit = async (event) => {
    event.preventDefault();

    const apiKey = 'ec8a9e0735a382ff5d6dafc6a4333c84';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&units=${unit}&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    setCurrentWeather(data);

  };

  //  funktion för rendera nuvarande väder data
  const renderCurrentWeather = () => {
    if (!currentWeather) {
      return <div>Loading...</div>;
    }

    const { name, weather, main, wind, sys } = currentWeather;

    return (
      <div className="current-weather">
        <h2>{name}, {sys.country}</h2>
        <div className="weather-description">{weather[0].description}</div>
        <div className="temperature">{main.temp} {unit === 'metric' ? '°C' : '°F'}</div>
        <div className="weather-info">
          <div>Wind: {wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</div>
          <div>Humidity: {main.humidity}%</div>
          <div>Sunrise: {new Date(sys.sunrise * 1000).toLocaleTimeString()}</div>
          <div>Sunset: {new Date(sys.sunset * 1000).toLocaleTimeString()}</div>
        </div>
        <button onClick={toggleUnit}>
          {unit === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
        </button>
      </div>
    );
  };

  

  const handleSaveLocation = () => {
    if (currentWeather) {
      const locationName = `${currentWeather.name}, ${currentWeather.sys.country}`;
      setSavedLocations((prevLocations) => [...prevLocations, locationName]);
    }
  };

  
    const handleSavedLocationClick = async (location) => {
      const apiKey = 'ec8a9e0735a382ff5d6dafc6a4333c84';
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      setCurrentWeather(data);
    };

  // rendera komponent
  return (
    <div>
      <h1>Current Weather</h1>
      <form onSubmit={handleSearchLocationSubmit}>
        <label htmlFor="search-location">Search for location:</label>
        <input
          id="search-location"
          type="text"
          value={searchLocation}
          onChange={handleSearchLocationChange}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleSaveLocation}>Save</button>
      </form>
      {renderCurrentWeather()}
      <div>
  <h2>Saved Locations</h2>
  <ul>
    {savedLocations.map((location) => (
       <li key={location} onClick={() => handleSavedLocationClick(location)}>
       {location}
     </li>
   ))}
  </ul>
</div>

    </div>

    
  );
};



export default CurrentWeather;