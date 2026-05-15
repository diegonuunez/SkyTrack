import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ProfileCard } from '../components/ProfileCard';
import MissionCard from '../components/MissionCard'; // Importamos el componente de misiones
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { username } = useParams(); 
  const { user: currentUser, token } = useContext(AuthContext);
  
  const [profileData, setProfileData] = useState(null);
  const [userMissions, setUserMissions] = useState([]); // Estado para las misiones
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndMissions = async () => {
      setLoading(true);
      const targetUsername = username || currentUser?.username;

      if (!targetUsername) {
        setLoading(false);
        return;
      }

      try {
        const profileRes = await fetch(`http://127.0.0.1:8000/api/profile/${targetUsername}/`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });

      const missionsRes = await fetch(`http://127.0.0.1:8000/api/profile/${targetUsername}/missions/`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });

        if (profileRes.ok && missionsRes.ok) {
          const profileJson = await profileRes.json();
          const missionsJson = await missionsRes.json();
          
          setProfileData(profileJson);
          setUserMissions(missionsJson);
        } else {
          setError("No se pudo cargar la información del piloto.");
        }
      } catch (err) {
        setError("Error de conexión con el cielo... revisa tu servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndMissions();
  }, [username, currentUser, token]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="container mx-auto py-12 px-4">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500 italic">Sincronizando telemetría...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-bold text-xl">{error}</p>
            <button onClick={() => window.history.back()} className="mt-4 text-blue-600 hover:underline">
              Volver al hangar
            </button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {username ? `Perfil de ${username}` : 'Mi Perfil'}
            </h1>
            
            {/* Tarjeta de Perfil y Seguidores */}
            <ProfileCard profileData={profileData} />
            
            {/* Listado de Misiones del Piloto */}
            <div className="mt-16 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8 border-b pb-4 border-gray-200">
                    <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
                        Bitácora de Vuelo
                    </h3>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                        {userMissions.length} misiones
                    </span>
                </div>

                {userMissions.length > 0 ? (
                    <div className="space-y-6">
                        {userMissions.map(mission => (
                            <MissionCard key={mission.id} mission={mission} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">Este piloto aún no ha registrado vuelos.</p>
                    </div>
                )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;