import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ trackData }) => {
  // Coordenadas por defecto (Madrid) si no hay datos
  const defaultCenter = [40.4167, -3.7037];
  
  // Si trackData tiene puntos, usamos el primero como centro, si no, el defecto
  const center = trackData && trackData.length > 0 ? trackData[0] : defaultCenter;

  return (
    <div style={{ height: "500px", width: "100%", borderRadius: "12px", overflow: "hidden", border: "1px solid #ccc" }}>
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Solo dibujamos la línea si trackData tiene datos */}
        {trackData && trackData.length > 0 && (
          <Polyline 
            positions={trackData} 
            color="#3b82f6" 
            weight={5} 
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;