import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WeatherMap = ({ date }) => {
  const [radarImageURL, setRadarImageURL] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRadarImageURL = async () => {
      try {
        const response = await fetch(
          `https://opendata-download-radar.smhi.se/api/latest/area/sweden/product/comp/${date}`
        );
        const data = await response.json();
        // extraherar bild url från data respons
        const imageUrl = data?.files?.image?.latest;
        if (imageUrl) {
          setRadarImageURL(imageUrl);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching radar image:', error);
        setIsLoading(false);
      }
    };

    fetchRadarImageURL();
  }, [date]);

  //visar kartan
  return (
    <div>
      {isLoading ? (
        <div>Loading radar image...</div>
      ) : (
        <MapContainer center={[59.33, 18.06]} zoom={6} style={{ height: '400px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ImageOverlay url={radarImageURL} bounds={[[55, 0], [70, 40]]} />
        </MapContainer>
      )}
    </div>
  );
};

export default WeatherMap;