import React, { useState, useContext } from 'react'; 
import MapComponent from './Map'; 
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { missionService } from '../services/missionService';

const MissionCard = ({ mission }) => {
  const { token } = useContext(AuthContext); 

  const userName = mission?.user_name || 'Piloto';
  const missionName = mission?.name || 'Misión sin nombre';
  const description = mission?.description || 'Sin descripción disponible.';
  const userExperience = mission?.user_experience || 'None';
  
  // Estados para Likes
  const [isLiked, setIsLiked] = useState(mission?.is_liked || false);
  const [likesCount, setLikesCount] = useState(mission?.likes_count || 0);

  // NUEVO: Estados para Guardados (Bookmarks)
  const [isSaved, setIsSaved] = useState(mission?.is_saved || false);
  const [savesCount, setSavesCount] = useState(mission?.saves_count || 0);
  
  const mapCoordinates = mission?.points?.map(p => [p.latitude, p.longitude]) || [];
  
  const handleLike = async () => {
    if (!token) {
      alert("Debes iniciar sesión para dar me gusta a una misión.");
      return;
    }
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount(prev => newIsLiked ? prev + 1 : prev - 1);

    try {
      await missionService.toggleLike(mission.id, token);
    } catch (error) {
      setIsLiked(!newIsLiked);
      setLikesCount(prev => !newIsLiked ? prev + 1 : prev - 1);
      console.error("Error al dar like:", error);
    }
  };

  // NUEVO: Función para manejar el guardado
  const handleSave = async () => {
    if (!token) {
      alert("Debes iniciar sesión para guardar una misión.");
      return;
    }
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);
    setSavesCount(prev => newIsSaved ? prev + 1 : prev - 1);

    try {
      await missionService.toggleSave(mission.id, token);
    } catch (error) {
      setIsSaved(!newIsSaved);
      setSavesCount(prev => !newIsSaved ? prev + 1 : prev - 1);
      console.error("Error al guardar:", error);
    }
  };
  
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
      
      {/* 1. Cabecera */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <h4 className="font-bold text-gray-900 text-lg">{userName}</h4>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{userExperience}</p>
          </div>
        </div>
        <span className={`px-4 py-1 text-xs font-bold rounded-full uppercase shadow-sm ${
          mission.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {mission.status || 'En curso'}
        </span>
      </div>

      {/* 2. Cuerpo */}
      <div className="mb-5">
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{missionName}</h3>
        <p className="text-gray-600 leading-relaxed text-md truncate">{description}</p>
      </div>

      {/* 3. Mapa */}
      <div className="w-full h-56 rounded-2xl mb-6 overflow-hidden border-2 border-gray-100 shadow-inner relative z-0 pointer-events-none">
        {mapCoordinates.length > 0 ? (
          <MapComponent trackData={mapCoordinates} />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 font-semibold">
            <span>🗺️ Sin datos de vuelo</span>
          </div>
        )}
      </div>

      {/* 4. Pie de carta */}
      <div className="flex justify-between items-center pt-5 border-t border-gray-100">
        <div className="flex gap-5">
          
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors pointer-events-auto ${
              isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
            }`}
          >
            <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span> 
            <span className="font-bold">{likesCount}</span>
          </button>
          
          <button className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors pointer-events-auto">
            <span className="text-xl">💬</span>
            <span className="font-bold">Comentar</span>
          </button>

          {/* NUEVO: BOTÓN DE GUARDAR */}
          <button 
            onClick={handleSave}
            className={`flex items-center gap-1.5 transition-colors pointer-events-auto ${
              isSaved ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            <span className="text-xl">{isSaved ? '🔖' : '📑'}</span>
            <span className="font-bold">Guardar</span>
          </button>

        </div>
        
        <Link 
          to={`/mission/${mission.id}`} 
          className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-colors inline-block text-center pointer-events-auto"
        >
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};
 
export default MissionCard;