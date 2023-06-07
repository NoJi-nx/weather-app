import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { ClipLoader } from 'react-spinners';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';


const WeatherForecast = () => {
   // skapa variabler
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [showTemperature, setShowTemperature] = useState(true);
const [showHumidity, setShowHumidity] = useState(true);
const [showWind, setShowWind] = useState(true);
const [showRainfall, setShowRainfall] = useState(true);

   // hämtar väderprognos data 
  useEffect(() => {
     const fetchForecastData = async () => {
      try {
        const position = await getCurrentPosition();
        const forecastData = await getForecastData(position.coords.latitude, position.coords.longitude);
        setForecastData(forecastData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
        console.error(error);
      }
    };
    
    fetchForecastData();
  }, []);

  //använda geolocation API och OpenWeatherMap API för kunna hämta väderprognos data i nuvarande position
  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };



  const getForecastData = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=ec8a9e0735a382ff5d6dafc6a4333c84&units=metric&cnt=64`
      );
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch forecast data');
    }
  };

   // formaterar porognos data så de inkluderar endast data mellan 9am och 6pm 
   const formatForecastData = () => {
    const formattedData = [];
    
  
    let totalRainfall = 0;
    let rainfallCount = 0;
  
    for (let i = 0; i < forecastData.list.length; i++) {
      const forecast = forecastData.list[i];
      const forecastDate = new Date(forecast.dt_txt);
      const rainfall = forecast.rain && forecast.rain['3h'];
  
      // inkluera data mellan 9am och 6pm
      if (forecastDate.getHours() >= 9 && forecastDate.getHours() < 18) {
        formattedData.push({
          date: forecast.dt_txt,
          temperature: forecast.main.temp,
          humidity: forecast.main.humidity,
          wind: forecast.wind.speed,
          rainfall: rainfall || 0, // genomsnitt nederbörd
        });
  
        if (rainfall) {
          totalRainfall += rainfall;
          rainfallCount++;
        }
      }
    }
  
    const averageRainfall = rainfallCount > 0 ? totalRainfall / rainfallCount : 0;
    console.log('Average Rainfall:', averageRainfall);
  
    return formattedData;
  };
  

   // renderar formatterad prognos data som lista 
  const renderForecastList = () => {
    if (!forecastData) {
      return null;
    }

    const formattedData = formatForecastData();

    return (
      <div className='flex flex-wrap items-center justify-center forecast-container '>
       
        {formattedData.map((data, index) => (
          <div key={index} className="mx-16 my-2 forecast-item">
            
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


  // renderar formatterad prognos data som en graf 
  const renderWeatherForecastChart = () => {
    if (!forecastData) {
      return null;
    }


    const formattedData = formatForecastData();
    const chartLines = [];
    

    if (showTemperature) {
      chartLines.push(
        <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Temperature" key="temperature" />
      );
    }
  
    if (showHumidity) {
      chartLines.push(
        <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity" key="humidity" />
      );
    }
  
    if (showWind) {
      chartLines.push(
        <Line type="monotone" dataKey="wind" stroke="#ffc658" name="Wind" key="wind" />
      );
    }
  
    if (showRainfall) {
      chartLines.push(
        <Line type="monotone" dataKey="rainfall" stroke="#ff0000" name="Rainfall" key="rainfall" />
      );
    }
  
    return (
      <div>
        <div className="chart-container">
          <LineChart width={600} height={300} data={formattedData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {chartLines}
          </LineChart>
        </div>
      </div>
    );
  };

  

  if (isLoading) {
    return (
      <div className="loading-indicator">
        <ClipLoader size={35} color="#000" loading={isLoading} />
      </div>
    );
  }

  if (isError) {
    return <div>Error fetching weather forecast.</div>;
  }

   // renderar the väder prognos UI med formatterade data
   return (
    <div className="container flex flex-col items-center justify-center mx-auto my-12 bg-white rounded-xl lg:max-w-5xl ">
      <h2 className="mb-4 text-3xl font-semibold text-center">Weather Forecast</h2>
      <div className="flex mb-4 toggle-buttons">
        <button className="px-4 py-2 mr-2 border-2 rounded-full btn btn-primary focus:outline-none focus:ring-2 focus:ring-blue-500" 
        onClick={() => setShowChart(false)}>Show List</button>
        <button className="px-4 py-2 border-2 rounded-full btn btn-primary focus:outline-none focus:ring-2 focus:ring-blue-500" 
        onClick={() => setShowChart(true)}>Show Chart</button>
      </div>
  
      {showChart && (
        <>
          <div className="mb-4 space-y-2 filter-options">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-500 form-checkbox"
                checked={showTemperature}
                onChange={() => setShowTemperature(!showTemperature)}
              />
              <span className="ml-2 font-medium text-gray-700">Temperature</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-500 form-checkbox"
                checked={showHumidity}
                onChange={() => setShowHumidity(!showHumidity)}
              />
              <span className="ml-2 font-medium text-gray-700">Humidity</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-500 form-checkbox"
                checked={showWind}
                onChange={() => setShowWind(!showWind)}
              />
              <span className="ml-2 font-medium text-gray-700">Wind</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-500 form-checkbox"
                checked={showRainfall}
                onChange={() => setShowRainfall(!showRainfall)}
              />
              <span className="ml-2 font-medium text-gray-700">Rainfall</span>
            </label>
          </div>
          <div className="chart-container">
            {renderWeatherForecastChart()}
          </div>
        </>
      )}
  
      {!showChart && (
        <>
          {renderForecastList()}
        </>
      )}
    </div>
  )
};

export default WeatherForecast;