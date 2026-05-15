import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { socialService } from '../services/socialService'; // Asegúrate de tener este servicio

export const ProfileCard = ({ profileData }) => {
  const { user: currentUser, token, logout, setUser } = useContext(AuthContext);
  const { username } = useParams(); // Para saber qué perfil estamos viendo
  const navigate = useNavigate();

  // Estados para seguidores (inicializados con los datos que vienen del backend)
  const [isFollowing, setIsFollowing] = useState(profileData?.is_following || false);
  const [followersCount, setFollowersCount] = useState(profileData?.followers_count || 0);
  const [followingCount, setFollowingCount] = useState(profileData?.following_count || 0);

  // ¿Es este mi propio perfil?
  const isOwnProfile = !username || username === currentUser?.username;
  const displayUser = isOwnProfile ? currentUser : profileData;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFollow = async () => {
    if (!token) {
      alert("Debes iniciar sesión para seguir a otros pilotos");
      return;
    }
    try {
      const data = await socialService.toggleFollow(displayUser.username, token);
      setIsFollowing(data.is_following);
      setFollowersCount(data.followers_count);
      setFollowingCount(data.following_count);
    } catch (err) {
      console.error("Error al seguir al usuario:", err);
    }
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    return `http://127.0.0.1:8000${avatarPath}`;
  };

  if (!displayUser) return <div className="p-6 text-center">Cargando perfil...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-32"></div>
      
      <div className="px-6 pb-6">
        <div className="relative flex justify-center -mt-16">
          <label className={`${isOwnProfile ? 'cursor-pointer' : ''} group relative`}>
            <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center overflow-hidden shadow-lg">
             {displayUser.profile?.avatar || displayUser.avatar ? (
                <img 
                  src={getAvatarUrl(displayUser.profile?.avatar || displayUser.avatar)} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-4xl font-bold text-blue-600">
                  {displayUser.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isOwnProfile && (
              <>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 rounded-full transition">
                  Editar
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={() => {/* Tu lógica de upload */}} />
              </>
            )}
          </label>
        </div>

        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-gray-800">{displayUser.username}</h2>
          <p className="text-blue-600 font-medium text-sm">
            {displayUser.profile?.experience_level || displayUser.experience_level || 'Piloto'}
          </p>
        </div>

        {/* --- CONTADORES DE SEGUIDORES --- */}
        <div className="flex justify-center gap-8 my-6 py-4 border-y border-gray-50">
          <div className="text-center">
            <span className="block text-xl font-bold text-gray-800">{followersCount}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Seguidores</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-gray-800">{followingCount}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Siguiendo</span>
          </div>
          <div className="text-center">
            <span className="block text-xl font-bold text-gray-800">{displayUser.stats?.missions || 0}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest">Vuelos</span>
          </div>
        </div>

        {/* --- BOTONES DE ACCIÓN --- */}
        <div className="flex flex-col gap-3">
          {!isOwnProfile ? (
            <button 
              onClick={handleFollow}
              className={`w-full py-3 rounded-xl font-bold transition-all shadow-md ${
                isFollowing 
                ? 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isFollowing ? 'Dejar de seguir' : 'Seguir Piloto'}
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/edit-profile')}
                className="py-2 px-4 border border-blue-200 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
              >
                Editar Perfil
              </button>
              <button 
                onClick={handleLogout}
                className="py-2 px-4 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;