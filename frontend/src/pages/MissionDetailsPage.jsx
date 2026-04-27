// src/pages/MissionDetailsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { missionService } from '../services/missionService';
import { AuthContext } from '../context/AuthContext';
import MapView from '../components/Map';

export const MissionDetailsPage = () => {
  const { id } = useParams(); // Extrae el ID de la URL (ej: /mission/3 -> id=3)
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapCoordinates = mission?.points?.map(p => [p.latitude, p.longitude]) || [];

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const data = await missionService.getMissionById(id, token);
        setMission(data);
      } catch (err) {
        setError("No se pudo cargar la misión. Puede que haya sido eliminada.");
      } finally {
        setLoading(false);
      }
    };
    fetchMission();
  }, [id, token]);

  if (loading) return <div className="text-center py-20 animate-pulse text-gray-500 font-bold">Cargando detalles del vuelo...</div>;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;
  if (!mission) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Botón volver */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 text-gray-500 hover:text-blue-600 font-bold flex items-center gap-2 transition-colors"
      >
        ← Volver
      </button>

      {/* Cabecera de la Misión */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-extrabold text-gray-900">{mission.name || "Misión sin título"}</h1>
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
            {mission.status || "En Curso"}
          </span>
        </div>
        
        <p className="text-gray-600 text-lg mb-6 leading-relaxed">
          {mission.description || "Sin descripción disponible."}
        </p>

        {/* Creador */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {mission.user_name ? mission.user_name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Piloto: {mission.user_name || "Desconocido"}</p>
            <p className="text-xs text-gray-500 font-semibold">{mission.user_experience || "Principiante"}</p>
          </div>
        </div>
      </div>

      {/* Aquí irá el mapa grande en el futuro */}
      <div className="bg-gray-200 w-full h-96 rounded-2xl flex items-center justify-center text-gray-500 font-bold mb-8 shadow-inner border-2 border-dashed border-gray-300">
        {mission?.points?.length > 0 ? (
        <MapView trackData={mapCoordinates} />
      ) : (
        <div className="w-full h-[500px] bg-gray-50 flex flex-col items-center justify-center text-gray-400 rounded-2xl border border-dashed border-gray-300">
            <span className="text-5xl mb-4">🗺️</span>
            <p className="text-lg font-semibold">Aún no hay datos de telemetría</p>
        </div>
      )}
      </div>
      
    </div>
  );
};
export default MissionDetailsPage;