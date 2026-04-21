// frontend/src/components/ProfileCard.jsx
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Para redirigir al login

export const ProfileCard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigimos al login tras salir
  };

  if (!user) return <div className="p-6 text-center">Cargando perfil...</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-blue-600 h-24"></div>
      
      <div className="px-6 pb-6">
        <div className="relative flex justify-center -mt-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center text-3xl font-bold text-blue-600">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="text-center mt-4">
          <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>

        <div className="mt-6 border-t border-gray-100 pt-6">
          {/* ... tus otros datos ... */}
          
          {/* BOTÓN DE CIERRE DE SESIÓN */}
          <button 
            onClick={handleLogout}
            className="w-full mt-6 py-2 px-4 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileCard;