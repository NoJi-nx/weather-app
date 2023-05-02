import React, { useState, useEffect } from 'react';

const CurrentWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unit, setUnit] = useState('metric'); // default to Celsius
  const [searchLocation, setSearchLocation] = useState('');

  useEffect(() => {
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const apiKey = 'ec8a9e0735a382ff5d6dafc6a4333c84';
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      setCurrentWeather(data);
    });
  }, [unit]);

  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const handleSearchLocationChange = (event) => {
    setSearchLocation(event.target.value);
  };

  const handleSearchLocationSubmit = async (event) => {
    event.preventDefault();

    const apiKey = 'ec8a9e0735a382ff5d6dafc6a4333c84';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&units=${unit}&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    setCurrentWeather(data);
  };

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
      </form>
      {renderCurrentWeather()}
    </div>
  );
};


export default CurrentWeather;