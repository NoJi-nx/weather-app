import React from 'react';
import CurrentWeather from './CurrentWeather';
import WeatherForecast from './WeatherForecast';
import WeatherMap from './WeatherMap';

const WeatherApp = () => {

  const date = '2023/05/30'; // YYYY/MM/DD format

  
  return (
    <div>
      <CurrentWeather />
      <WeatherForecast />
      <WeatherMap date={date} />
    </div>
  );
};
export default WeatherApp;