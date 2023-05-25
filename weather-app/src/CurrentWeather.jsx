import React, { useState, useEffect } from 'react';

const CurrentWeather = () => {
  // skapa variabler
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unit, setUnit] = useState('metric'); // standard Celsius
  const [searchLocation, setSearchLocation] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
  }, [unit]); //fetcha när vädret ändras

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
  
    const trimmedSearchLocation = searchLocation.trim();
  
    
  // trimma sök input fältet för inte tillåta whitespace
    if (trimmedSearchLocation === '') {

       // hantera tom sök fält
      setSearchError('Please enter a location');
      return;
    }
  
    const apiKey = 'ec8a9e0735a382ff5d6dafc6a4333c84';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${trimmedSearchLocation}&units=${unit}&appid=${apiKey}`;
  
    setIsLoading(true);

     //hantera errors under api calls
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
 
      const data = await response.json();
      setCurrentWeather(data);
      setSearchError('');
    } catch (error) {
      setSearchError('Error fetching weather data');
      console.error(error);
    }

    finally {
      setIsLoading(false);
    }
  };

  //  funktion för rendera nuvarande väder data
  const renderCurrentWeather = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    if (!currentWeather) {
      return null;
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

  
//spara platser i en lista
  const handleSaveLocation = () => {
    if (currentWeather) {
      const locationName = `${currentWeather.name}, ${currentWeather.sys.country}`;
      // se om platsen är sparad
      if (!savedLocations.includes(locationName)) {
        setSavedLocations((prevLocations) => [...prevLocations, locationName]);
        setSaveError('');
      } else {
        setSaveError('Location already saved');
      }
    }
  };
  
  
  const handleSavedLocationClick = async (location) => {
    const apiKey = 'ec8a9e0735a382ff5d6dafc6a4333c84';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`;
  
    //hantera errors under api calls
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }
  
      const data = await response.json();
      setCurrentWeather(data);
    } catch (error) {
      console.error(error);
    }
  };

  // rendera komponent
  return (
    <div>
      <h1>Current Weather</h1>
      {searchError && <p className="error-message">{searchError}</p>}
      {saveError && <p className="error-message">{saveError}</p>}
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