import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WeatherMap = ({ date }) => {
  const [radarImageURL, setRadarImageURL] = useState('');

  useEffect(() => {
    // hämtar  radar image url från SMHI API
    const fetchRadarImageURL = async () => {
      try {
        const response = await fetch(
          `https://opendata-download-radar.smhi.se/api/latest/area/sweden/product/comp/${date}`
        );
        const data = await response.json();
        setRadarImageURL(data.image);
      } catch (error) {
        console.error('Error fetching radar image:', error);
      }
    };

    fetchRadarImageURL();
  }, [date]);

  return (
    <MapContainer center={[60, 15]} zoom={6} style={{ height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data &copy; OpenStreetMap contributors"
      />

      {/* visar karta */}
      {radarImageURL && (
        <ImageOverlay url={radarImageURL} bounds={[[54, 6], [69, 24]]} />
      )}
    </MapContainer>
  );
};

export default WeatherMap;