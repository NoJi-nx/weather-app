import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faStar, faCheck, faLocationDot, faWind, faTint, faSun, faMoon  } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const CurrentWeather = () => {
  // skapa variabler
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [searchLocation, setSearchLocation] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

 
  const saveButtonClass = savedLocations.includes(`${currentWeather?.name}, ${currentWeather?.sys.country}`)
    ? 'border-2 rounded-lg text-white px-2 py-2'
    : 'border-2 rounded-lg text-white px-2 py-2 rounded';

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
  }, [unit]);

  const weatherIcons = {
    Clear: <WiDaySunny className='weather-icon'/>,
    Clouds: <WiCloudy className='weather-icon'/>,
    Rain: <WiRain className='weather-icon'/>,
    Snow: <WiSnow className='weather-icon'/>,
    Thunderstorm: <WiThunderstorm className='weather-icon'/>,
  };
  // lägg till mer ikoner

  // Definera funktion att välja enheter mellan Celsius och Fahrenheit
  const toggleUnit = () => {
    setUnit(unit === 'metric' ? 'imperial' : 'metric');
  };

  const renderLoadingIndicator = () => {
    return (
      <div className="flex items-center justify-center h-full">
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
    } finally {
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
      <div className="current-weather ">
         
        <h2 className='location'>
          {name}, {sys.country}
        </h2>
        <div className="weather-description">

        {weatherIcons[weather[0].main]} {weather[0].description}

        </div>
       
        <div className="temperature">
          {main.temp} {unit === 'metric' ? '°F' : '°C'}
        </div>
       
          
          
          
        
        
        <div className=" weather-info">
          
          <div>
          <FontAwesomeIcon icon={faWind} className="info-icon" /> Wind: {wind.speed} {unit === 'metric' ? 'm/s' : 'mph'} 
          <div>
          <FontAwesomeIcon icon={faTint} className="info-icon" /> Humidity: {main.humidity}%</div> 
          <div>
          <FontAwesomeIcon icon={faSun} className="info-icon" />   Sunrise: {new Date(sys.sunrise * 1000).toLocaleTimeString()} 
            </div>
            <div>

            <FontAwesomeIcon icon={faMoon} className="info-icon" />  Sunset: {new Date(sys.sunset * 1000).toLocaleTimeString()} </div>
          </div>
          
        </div>
        
   
      
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

  return (
    <div className='main'>
    <div className="current-card flex flex-col   bg-white rounded-xl ">
      <div className ="gradient">
        {searchError && <p className="text-red-500">{searchError}</p>}
        {saveError && <p className="text-red-500">{saveError}</p>}

        <form onSubmit={handleSearchLocationSubmit} className="mb-4">
          <div className="search-content flex items-center">
            <input
              id="search-location" 
              type="text"
              value={searchLocation}
              onChange={handleSearchLocationChange}
              className="search-bar mr-2 form-control"
              placeholder='....'
              
              
            />
            
            
            
            <button type="submit" className="border-2 rounded-lg px-2 py-2 m-5 text-white">
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            </button>
            
            <button type="button" onClick={handleSaveLocation} className= {saveButtonClass} >
            {savedLocations.includes(`${currentWeather?.name}, ${currentWeather?.sys.country}`) ? (
    <>
      <FontAwesomeIcon icon={faCheck} className="mr-1" />
      Location Saved
    </>
  ) 
  
  : (
    <>
      <FontAwesomeIcon icon={faStar} className="mr-1" />
      
    </>
  )}

  
        </button>

        <label className="inline-flex items-center mt-5" >
  <input
    type="checkbox"
    role="switch"
    className="toggle-button mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
    checked={unit === 'imperial'}
    onChange={toggleUnit}
    
  />

<label
  class="inline-block pl-[0.15rem] hover:cursor-pointer"
  for="flexSwitchCheckDefault">

  </label>

  <span className="ml-2 text-sm text-gray-700"> {unit === 'metric' ? 'F°' : 'C°'}</span>
</label>
        
          </div>
        </form>

        {isLoading ? renderLoadingIndicator() : renderCurrentWeather()}

        
        </div>

        
        
    </div>
    
    <div className="save-list ">
          
          <h2 className="save-title mb-3">Saved Locations</h2>
          <ul className="list-group">
            {savedLocations.map((location) => (
              <li
                key={location}
                onClick={() => handleSavedLocationClick(location)}
                className="cursor-pointer list-group-item list-group-item-action"
              >
                 <FontAwesomeIcon icon={faLocationDot} className="mr-2" /> 
                {location}
              </li>
            ))}
          </ul>
        
        </div>
    </div>
    
  );
};

export default CurrentWeather;