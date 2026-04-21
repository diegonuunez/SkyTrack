import React, { useState, useEffect, useContext } from 'react';
import MissionCard from '../components/MissionCard';
import Navbar from '../components/Navbar.jsx';
import  AuthContext  from '../context/AuthContext';
import  UserBanner  from '../components/UserBanner';

const Home = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 4. Accedemos al usuario logueado desde el contexto
  const { user } = useContext(AuthContext);
  console.log("Usuario en el contexto:", user); // <--- AÑADE ESTO

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/missions/feed/');
        
        if (!response.ok) {
          throw new Error(`Error en el servidor: ${response.status}`);
        }

        const data = await response.json();
        setMissions(data);
      } catch (error) {
        console.error("Error al cargar el feed público:", error);
      } finally {
        setLoading(false); 
      }
    };

    fetchFeed();
  }, []);

  if (loading) return <div className="text-center mt-10"></div>;

return (
    <>
      <Navbar />
      {/* Contenedor principal con flex-row para poner cosas al lado */}
      <div className="max-w-5xl mx-auto p-4 flex gap-6">
        
        {/* Columna Izquierda: Feed de misiones (ocupa más espacio) */}
        <div className="flex-1 flex flex-col gap-4">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </div>

        {/* Columna Derecha: UserBanner (el cuadrado del perfil) */}
        {user && (
          <aside className="w-80">
            <div className="sticky top-4">
            </div>
          </aside>
        )}
      </div>
    </>
  );
};

export default Home;