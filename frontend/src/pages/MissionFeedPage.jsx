import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { missionService } from '../services/missionService';
import MissionCard from '../components/MissionCard'; // Ajusta la ruta a tu componente

export const MissionFeedPage = ({ title, feedType }) => {
  const { token } = useContext(AuthContext);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        // Dependiendo del prop 'feedType', llamamos a un servicio distinto
        if (feedType === 'feed') data = await missionService.getFeed(token);
        if (feedType === 'saved') data = await missionService.getSaved(token);
        if (feedType === 'liked') data = await missionService.getLiked(token);
        
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchMissions();
    }
  }, [feedType, token]); // Se vuelve a ejecutar si cambias de pestaña

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">{title}</h1>

      {loading && (
        <div className="text-center py-10 text-gray-500 font-bold animate-pulse">
          Cargando misiones...
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-6">
          {error}
        </div>
      )}

      {!loading && !error && missions.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No hay misiones para mostrar aquí.</p>
        </div>
      )}

      {!loading && missions.map(mission => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
    </div>
  );
};

export default MissionFeedPage;