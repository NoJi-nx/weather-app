import React from 'react';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';

const WeatherApp = () => {
  return (
    <div>
      <CurrentWeather />
      <WeatherForecast />
  </div>
  );
};

export default WeatherApp;