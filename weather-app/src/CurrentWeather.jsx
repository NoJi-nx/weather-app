import React, { useState, useEffect } from 'react';


const CurrentWeather = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [unit, setUnit] = useState('metric'); // standard är Celcius 

  useEffect(() => {
    //Hämta aktuell väderdata för användarens aktuella position
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


export default CurrentWeather;