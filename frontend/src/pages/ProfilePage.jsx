import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MissionCard from '../components/MissionCard';

export const ProfilePage = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Peticiones paralelas para ganar velocidad
        const [userRes, missionsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/profile/${username}/`),
          fetch(`http://127.0.0.1:8000/api/profile/${username}/missions/`)
        ]);

        const userData = await userRes.json();
        const missionsData = await missionsRes.json();

        setUser(userData);
        setMissions(missionsData);
      } catch (e) {
        console.error("Error cargando perfil", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  if (loading) return <div className="p-10 text-center font-bold">Cargando perfil...</div>;
  if (!user) return <div className="p-10 text-center text-red-500">Usuario no encontrado</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      
      {/* SECCIÓN 1: HEADER & STATS */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row items-center gap-10">
        <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-lg">
          {user.avatar ? <img src={user.avatar} className="rounded-full" /> : user.username[0].toUpperCase()}
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-black text-gray-900 mb-2">{user.username}</h1>
          <p className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">{user.experience_level}</p>
          <p className="text-gray-500 max-w-xl">{user.bio || "Este piloto prefiere que sus vuelos hablen por él."}</p>
        </div>

        {/* STATS BOX */}
        <div className="flex gap-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
          <div className="text-center">
            <p className="text-3xl font-black text-gray-900">{user.stats.missions}</p>
            <p className="text-xs font-bold text-gray-400 uppercase">Misiones</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-gray-900">{user.stats.likes}</p>
            <p className="text-xs font-bold text-gray-400 uppercase">Me Gusta</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: GRID DE MISIONES */}
      <h2 className="text-2xl font-black text-gray-900 mb-8 px-2">Historial de Vuelo</h2>
      
      <div className="flex flex-col items-center gap-8 w-full pb-10">
        {missions.map(mission => (
          <div key={mission.id} className="w-full max-w-2xl">
            <MissionCard mission={mission} />
          </div>
        ))}
      </div>

      {missions.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold text-lg">Este hangar está vacío por ahora...</p>
        </div>
      )}
    </div>
  );
};
export default ProfilePage;