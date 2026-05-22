import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapFitBounds = ({ trackData }) => {
  const map = useMap();
  
  useEffect(() => {
    if (trackData && trackData.length > 0 && map) {
      const bounds = L.latLngBounds(trackData);
      
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [trackData, map]);
  
  return null; 
};

const MapComponent = ({ trackData, interactive = false }) => {
  const initialCenter = [40.4167, -3.7037];
  const initialZoom = 13;
  const last = trackData ? trackData.length - 1 : -1;

  return (
    <div className={`w-full h-full relative z-0${interactive ? '' : ' pointer-events-none'}`}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        className="w-full h-full"
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        scrollWheelZoom={interactive}
        boxZoom={interactive}
        keyboard={interactive}
        zoomControl={interactive}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapFitBounds trackData={trackData} />

        {trackData && trackData.length > 0 && (
          <Polyline
            positions={trackData}
            color="#2563eb"
            weight={4}
            opacity={0.8}
          />
        )}

        {trackData && trackData.map((pos, i) => {
          const isStart = i === 0;
          const isEnd   = i === last;
          const color   = isStart ? '#22c55e' : isEnd ? '#ef4444' : '#2563eb';
          const radius  = isStart || isEnd ? 7 : 4;
          return (
            <CircleMarker
              key={i}
              center={pos}
              radius={radius}
              pathOptions={{ color, fillColor: '#ffffff', fillOpacity: 1, weight: 2.5 }}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;