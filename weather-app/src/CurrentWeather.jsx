import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';


const CurrentWeather = () => {
  // skapa variabler
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unit, setUnit] = useState('metric'); // standard: Celsius
  const [searchLocation, setSearchLocation] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const temperatureClass = unit === 'metric' ? 'temperature-celsius' : 'temperature-fahrenheit';
  const saveButtonClass = savedLocations.includes(`${currentWeather?.name}, ${currentWeather?.sys.country}`)
    ? 'btn btn-danger'
    : 'btn btn-primary';


  // Använd useEffect hook för hämta the nuvarande väder baserad på användarens plats
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

  const weatherIcons = {
    Clear: <WiDaySunny />,
    Clouds: <WiCloudy />,
    Rain: <WiRain />,
    Snow: <WiSnow />,
    Thunderstorm: <WiThunderstorm />,
    // lägg till mer ikoner
  };
  // Definera funktion att välja enheter mellan Celsius och Fahrenheit
  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const renderLoadingIndicator = () => {
    return (
      <div className="loading-indicator">
        <ClipLoader size={35} color="#000" loading={isLoading} />
      </div>
    );
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
        <div className="weather-description">{weather[0].description}
        {weatherIcons[weather[0].main]} {/* Render the weather icon */}
        
        </div>
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
    <div className="container">
      <div className="card">
      <h1 className="text-center">Weather App</h1>
      {searchError && <p className="error-message">{searchError}</p>}
      {saveError && <p className="error-message">{saveError}</p>}
      <form onSubmit={handleSearchLocationSubmit} className="mb-4">
        <div className="form-group">
          <input
            id="search-location"
            type="text"
            value={searchLocation}
            onChange={handleSearchLocationChange}
            className="form-control form-control-lg"
            placeholder="Search location"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-lg btn-block">Search</button>
        <button type="button" onClick={handleSaveLocation} className={saveButtonClass}>
          {savedLocations.includes(`${currentWeather?.name}, ${currentWeather?.sys.country}`)
            ? 'Location Saved'
            : 'Save'}
        </button>
      </form>
      {isLoading ? renderLoadingIndicator() : renderCurrentWeather()}
      <div className="mt-4">
        <h2 className="mb-3">Saved Locations</h2>
        <ul className="list-group">
          {savedLocations.map((location) => (
            <li
              key={location}
              onClick={() => handleSavedLocationClick(location)}
              className="list-group-item list-group-item-action"
            >
              {location}
            </li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
};


export default CurrentWeather;