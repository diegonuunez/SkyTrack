// src/components/Map.jsx (O el nombre que le hayas dado a tu archivo de mapa)
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix temporal para los iconos de Leaflet (importante si luego añades <Marker>)
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

const MapComponent = ({ trackData }) => {
  const initialCenter = [40.4167, -3.7037];
  const initialZoom = 13;

  return (
    // Mantenemos las clases y el z-index como los definimos antes
    <div className="w-full h-full relative z-0 pointer-events-none">
      <MapContainer 
        center={initialCenter} 
        zoom={initialZoom} 
        className="w-full h-full"
        // Dado que el contenedor tiene pointer-events-none, 
        // desactivamos toda la interactividad nativa de Leaflet para ahorrar recursos
        dragging={false}
        touchZoom={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        boxZoom={false}
        keyboard={false}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* 2. Insertamos nuestro "director de cámara" */}
        <MapFitBounds trackData={trackData} />
        
        {/* Dibujamos la línea si hay datos */}
        {trackData && trackData.length > 0 && (
          <Polyline 
            positions={trackData} 
            color="#2563eb" // Azul de Tailwind (blue-600)
            weight={5} 
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapComponent;