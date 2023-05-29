import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WeatherMap = ({ latitude, longitude }) => {
  const [weatherFronts, setWeatherFronts] = useState([]);
  const [radarImageURL, setRadarImageURL] = useState('');

  useEffect(() => {
    // Fetch weather fronts data from SMHI API
    const fetchWeatherFronts = async () => {
      try {
        const response = await fetch(
          `https://opendata-download-radar.smhi.se/api/latest/area/sweden/product/comp/${latitude}/${longitude}`
        );
        const data = await response.json();
        setWeatherFronts(data);
      } catch (error) {
        console.error('Error fetching weather fronts:', error);
      }
    };

    // Fetch radar image URL from SMHI API
    const fetchRadarImageURL = async () => {
      try {
        const response = await fetch(
          `https://opendata-download-radar.smhi.se/api/latest/area/sweden/product/comp/${latitude}/${longitude}?format=png`
        );
        const data = await response.json();
        setRadarImageURL(data.image);
      } catch (error) {
        console.error('Error fetching radar image:', error);
      }
    };

    fetchWeatherFronts();
    fetchRadarImageURL();
  }, [latitude, longitude]);

  return (
    <MapContainer center={[latitude, longitude]} zoom={8} style={{ height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data &copy; OpenStreetMap contributors"
      />

      {/* Display weather fronts */}
      {weatherFronts.map((front) => (
        <Polyline positions={front.geometry.coordinates} color="red" key={front.properties.id} />
      ))}

      {/* Display radar image overlay */}
      {radarImageURL && (
        <ImageOverlay url={radarImageURL} bounds={[[south, west], [north, east]]} />
      )}
    </MapContainer>
  );
};

export default WeatherMap;