import React, { useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

const CurrentWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [searchLocation, setSearchLocation] = useState('');
  const [savedLocations, setSavedLocations] = useState([]);
  const [searchError, setSearchError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

 
  const saveButtonClass = savedLocations.includes(`${currentWeather?.name}, ${currentWeather?.sys.country}`)
    ? 'bg-red-500 text-white px-2 py-2'
    : 'bg-blue-500 text-white px-2 py-2 rounded';

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
    Clear: <WiDaySunny />,
    Clouds: <WiCloudy />,
    Rain: <WiRain />,
    Snow: <WiSnow />,
    Thunderstorm: <WiThunderstorm />,
  };

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

  const handleSearchLocationChange = (event) => {
    setSearchLocation(event.target.value);
  };

  const handleSearchLocationSubmit = async (event) => {
    event.preventDefault();
    const trimmedSearchLocation = searchLocation.trim();

    if (trimmedSearchLocation === '') {
      setSearchError('Please enter a location');
      return;
    }

    const apiKey = 'ec8a9e0735a382ff5d6dafc6a4333c84';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${trimmedSearchLocation}&units=${unit}&appid=${apiKey}`;

    setIsLoading(true);

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
        <h2>
          {name}, {sys.country}
        </h2>
        <div className="weather-description">
          {weather[0].description}
          {weatherIcons[weather[0].main]}
        </div>
        <div className="temperature">
          {main.temp} {unit === 'metric' ? '°C' : '°F'}
        </div>
        <div className=" weather-info">
          <div>Wind: {wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</div>
          <div>Humidity: {main.humidity}%</div>
          <div>Sunrise: {new Date(sys.sunrise * 1000).toLocaleTimeString()}</div>
          <div>Sunset: {new Date(sys.sunset * 1000).toLocaleTimeString()}</div>
        </div>
        <label className="inline-flex items-center mt-5" >
  <input
    type="checkbox"
    role="switch"
    className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
    checked={unit === 'imperial'}
    onChange={toggleUnit}
  />

<label
  class="inline-block pl-[0.15rem] hover:cursor-pointer"
  for="flexSwitchCheckDefault"></label>

  <span className="ml-2 text-sm text-gray-700"> {unit === 'metric' ? 'Fahrenheit' : 'Celsius'}</span>
</label>
      </div>
    );
  };

  const handleSaveLocation = () => {
    if (currentWeather) {
      const locationName = `${currentWeather.name}, ${currentWeather.sys.country}`;

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
    <div className='title'>
    <h1 className='mb-4 text-center text-gray-900 md:text-5xl lg:text-1xl'>Weather App</h1>
    <div className='card'>
    <div className="flex flex-col p-10 mx-auto bg-white rounded-xl lg:max-w-3xl md:max-w-xl sm:max-w-md">
        {searchError && <p className="text-red-500">{searchError}</p>}
        {saveError && <p className="text-red-500">{saveError}</p>}

        <form onSubmit={handleSearchLocationSubmit} className="mb-4">
          <div className="flex items-center">
            <input
              id="search-location"
              type="text"
              value={searchLocation}
              onChange={handleSearchLocationChange}
              className="mr-2 form-control"
              placeholder="Search location"
            />
            <button type="submit" className="px-2 py-2 m-5 text-white bg-blue-500 rounded">
              Search
            </button>
            
            <button type="button" onClick={handleSaveLocation} className= {saveButtonClass} >
          {savedLocations.includes(`${currentWeather?.name}, ${currentWeather?.sys.country}`)
            ? 'Location Saved'
            : 'Save'}
        </button>
        
        
          </div>
        </form>

        {isLoading ? renderLoadingIndicator() : renderCurrentWeather()}

        <div className="mt-4">
          <h2 className="mb-3">Saved Locations</h2>
          <ul className="list-group">
            {savedLocations.map((location) => (
              <li
                key={location}
                onClick={() => handleSavedLocationClick(location)}
                className="cursor-pointer list-group-item list-group-item-action"
              >
                {location}
              </li>
            ))}
          </ul>
        </div>
    </div>
    </div>
    </div>
  );
};

export default CurrentWeather;