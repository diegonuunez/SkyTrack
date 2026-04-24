import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfileCard = () => {
  const { user, setUser, token, logout } = useContext(AuthContext); // Añadimos token y setUser
  const [activeTab, setActiveTab] = useState('missions');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    
    if (avatarPath.startsWith('http')) {
      return `${avatarPath}?v=${Date.now()}`; 
    }
    
    return `http://127.0.0.1:8000${avatarPath}?v=${Date.now()}`;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/profile/update/', {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }, // Quitamos Content-Type
        body: formData
      });
      
      if (res.ok) {
        const updatedProfile = await res.json();
        // Actualizamos el contexto para que la imagen cambie al instante
        setUser({ ...user, profile: { ...user.profile, avatar: updatedProfile.avatar } });
      }
    } catch (err) {
      console.error("Error al subir imagen:", err);
    }
  };

  if (!user) return <div className="p-6 text-center">Cargando perfil...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-blue-600 h-24"></div>
      
      <div className="px-6 pb-6">
        <div className="relative flex justify-center -mt-12">
          {/* Avatar con selector de archivo */}
          <label className="cursor-pointer group relative">
            <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center text-3xl font-bold text-blue-600 overflow-hidden">
             {user.profile?.avatar ? (
                <img 
                  src={getAvatarUrl(user.profile.avatar)} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span className="text-3xl font-bold text-blue-600">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 rounded-full transition">
              Editar
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          </label>
        </div>

        <div className="text-center mt-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
        </div>

        {/* Sistema de Pestañas (igual que antes) */}
        {/* ... */}

        <button 
          onClick={handleLogout}
          className="w-full mt-6 py-2 px-4 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
        >
          Cerrar sesión
        </button>
         <button 
          onClick={() => navigate('/edit-profile')}
          className="w-full mt-6 py-2 px-4 border border-blue-200 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;