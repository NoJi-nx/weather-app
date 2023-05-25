import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';


const WeatherForecast = () => {
   // skapa tre variabler: forecastData, isLoading, isError
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

   // hämtar väderprognos data genom använda geolocation API and OpenWeatherMap API
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=ec8a9e0735a382ff5d6dafc6a4333c84&units=metric&cnt=64`
          );

           // sätter up prognosen och updaterar laddningen
          setForecastData(response.data);
          setIsLoading(false);
        } catch (error) {
          // hantera errors genom updatera laddning och errors
          setIsLoading(false);
          setIsError(true);
          console.error(error);
        }
      },
      (error) => {
         // hantera errors genom updatera laddning och errorn
        setIsLoading(false);
        setIsError(true);
        console.error(error);
      }
    );
  }, []);


   // formaterar porognos data så de inkluderar endast data mellan 9am och 6pm 
  const formatForecastData = () => {
    const formattedData = [];

    for (let i = 0; i < forecastData.list.length; i++) {
      const forecast = forecastData.list[i];
      const forecastDate = new Date(forecast.dt_txt);

      // endast inkluderar data mellan 9am och 6pm
      if (forecastDate.getHours() >= 9 && forecastDate.getHours() < 18) {
        formattedData.push({
          date: forecast.dt_txt,
          temperature: forecast.main.temp,
          weather: forecast.weather[0].description,
          wind: forecast.wind.speed,
          humidity: forecast.main.humidity,
        });
      }
    }

    return formattedData;
  };

   // renderar formatterad prognos data som lista och en graf 
  const renderForecastList = () => {
    if (!forecastData) {
      return null;
    }

    const formattedData = formatForecastData();

    return (
      <div>
        <h2>Weather Forecast List</h2>
        {formattedData.map((data, index) => (
          <div key={index} className="forecast-item">
            <div>{new Date(data.date).toLocaleDateString()}</div>
            <div>{new Date(data.date).toLocaleTimeString()}</div>
            <div>{data.temperature}°C</div>
            <div>{data.weather}</div>
            <div>{data.wind} m/s</div>
            <div>{data.humidity}%</div>
          </div>
        ))}
      </div>
    );
  };

  const renderWeatherForecastChart = () => {
    if (!forecastData) {
      return null;
    }

    const formattedData = formatForecastData();

    return (
      <div>
        <h2>Weather Forecast Chart</h2>
        <div className="chart-container">
          <LineChart width={600} height={300} data={formattedData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
            <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
            <Line type="monotone" dataKey="wind" stroke="#ffc658" />
          </LineChart>
        </div>
      </div>
    );
  };

  

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching weather forecast.</div>;
  }

   // renderar the väder prognos UI med formatterade data
  return (
    <div>
      {renderForecastList()}
      {renderWeatherForecastChart()}
    </div>
  );
};

export default WeatherForecast;