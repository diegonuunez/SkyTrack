import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfileCard = () => {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('missions'); // 'missions', 'saved', 'liked'
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return <div className="p-6 text-center">Cargando perfil...</div>;

  const tabs = [
    { id: 'missions', label: 'Mis Misiones' },
    { id: 'saved', label: 'Guardadas' },
    { id: 'liked', label: 'Me Gusta' }
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-blue-600 h-24"></div>
      
      <div className="px-6 pb-6">
        <div className="relative flex justify-center -mt-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white flex items-center justify-center text-3xl font-bold text-blue-600">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="text-center mt-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
        </div>

        {/* Sistema de Pestañas */}
        <div className="flex border-b border-gray-200 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-sm font-bold uppercase transition-colors ${
                activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de las pestañas */}
        <div className="min-h-[200px]">
          <p className="text-center text-gray-500 italic">
            Aquí cargaremos la lista de misiones de tipo: {activeTab}
          </p>
          {/* Aquí mapearías tus componentes MissionCard */}
        </div>

        <button 
          onClick={handleLogout}
          className="w-full mt-6 py-2 px-4 border border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;