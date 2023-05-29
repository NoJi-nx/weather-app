import React from 'react';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import WeatherMap from './WeatherMap';

const WeatherApp = () => {

  const currentDate = new Date().toISOString().slice(0, 10); // YYYY/MM/DD format

  
  return (
    <div>
      <CurrentWeather />
      <WeatherForecast />
      <WeatherMap date={currentDate} />
    </div>
  );
};
export default WeatherApp;