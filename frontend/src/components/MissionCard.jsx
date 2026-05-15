import React, { useState, useContext } from 'react'; 
import MapComponent from './Map'; 
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { missionService } from '../services/missionService';
import CommentSection from '../components/CommentSection';

const MissionCard = ({ mission }) => {
  const { token, user } = useContext(AuthContext); 
  
  const userName = mission?.user_name || 'Piloto';
  const missionName = mission?.name || 'Misión sin nombre';
  const description = mission?.description || 'Sin descripción disponible.';
  const userExperience = mission?.user_experience || 'None';
  const isFollowingAuthor = mission?.is_following_author || false; 
  
  const [isLiked, setIsLiked] = useState(mission?.is_liked || false);
  const [likesCount, setLikesCount] = useState(mission?.likes_count || 0);
  const [isSaved, setIsSaved] = useState(mission?.is_saved || false);
  const [savesCount, setSavesCount] = useState(mission?.saves_count || 0);
  const [showComments, setShowComments] = useState(false);
  
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
    }
  };

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
    }
  };
  
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
      
      {/* 1. Cabecera */}
      <div className="flex items-center justify-between mb-5">
        <Link 
          to={`/profile/${userName}`} 
          className="flex items-center group cursor-pointer"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:ring-4 ring-blue-100 transition-all">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                {userName}
              </h4>
              {isFollowingAuthor && (
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">
                  Siguiendo
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{userExperience}</p>
          </div>
        </Link>

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
          <button onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-400'}`}>
            <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span> 
            <span className="font-bold">{likesCount}</span>
          </button>
          
          <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
            <span className="text-xl">💬</span>
            <span className="font-bold">{showComments ? 'Ocultar' : 'Comentar'}</span>
          </button>

          <button onClick={handleSave} className={`flex items-center gap-1.5 transition-colors ${isSaved ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}>
            <span className="text-xl">{isSaved ? '🔖' : '📑'}</span>
            <span className="font-bold">{savesCount}</span>
          </button>
        </div>
        
        <Link to={`/mission/${mission.id}`} className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-colors inline-block text-center">
          Ver Detalles
        </Link>
      </div>

      {/* 5. Renderizado Condicional Corregido */}
      {showComments && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <CommentSection missionId={mission.id} token={token} currentUser={user} />
        </div>
      )}
    </div>
  );
};
 
export default MissionCard;