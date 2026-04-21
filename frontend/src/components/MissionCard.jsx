import React from 'react';
import MapComponent from './Map'; 

const MissionCard = ({ mission }) => {
  // Verificación de seguridad para los datos
  const userName = mission?.user_name|| 'Piloto';
  const missionName = mission?.name || 'Misión sin nombre';
  const description = mission?.description || 'Sin descripción disponible.';
  const userExperience = mission?.user_experience || 'None';
  
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8 border border-gray-100 hover:shadow-xl transition-all duration-300">
      
      {/* 1. Cabecera: Autor y Estado */}
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

      {/* 2. Cuerpo: Información técnica */}
      <div className="mb-5">
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{missionName}</h3>
        <p className="text-gray-600 leading-relaxed text-md">{description}</p>
      </div>

      {/* 3. Mapa: Integración con tu componente existente */}
      <div className="w-full h-56 rounded-2xl mb-6 overflow-hidden border-2 border-gray-100 shadow-inner">
        <MapComponent 
          lat={mission.latitude} 
          lng={mission.longitude} 
          zoom={13} 
        />
      </div>

      {/* 4. Pie de carta: Métricas y acciones */}
      <div className="flex justify-between items-center pt-5 border-t border-gray-100">
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
            <span className="text-xl">❤️</span> 
            <span className="font-bold">{mission.likes_count || 0}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
            <span className="text-xl">💬</span>
            <span className="font-bold">Comentar</span>
          </button>
        </div>
        
        <button className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-colors">
          Ver Detalles
        </button>
      </div>
    </div>
  );
};

export default MissionCard;