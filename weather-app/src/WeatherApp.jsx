import React from 'react';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import WeatherMap from './WeatherMap';
import './index.css';

const WeatherApp = () => {

  const currentDate = new Date().toISOString().slice(0, 10); // visar nuvarande data

  
  return (
    <div>
      <CurrentWeather />
      <WeatherForecast />
      <WeatherMap date={currentDate} />
    </div>
  );
};
export default WeatherApp;