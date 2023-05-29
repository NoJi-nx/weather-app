import React from 'react';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import WeatherMap from './WeatherMap';

const WeatherApp = () => {

  const latitude = 123.45; // Replace with the actual latitude value
  const longitude = 67.89; // Replace with the actual longitude value
  return (
    <div>
      <CurrentWeather />
      <WeatherForecast />
      <WeatherMap latitude={latitude} longitude={longitude} />
    </div>
  );
};
export default WeatherApp;