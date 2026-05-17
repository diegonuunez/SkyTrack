import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown'; 
const Navbar = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-black text-gray-900 tracking-tight">
        🚀 SkyTrack
      </Link>

      <div className="flex items-center gap-4">
        {token ? (
          <>
            <Link to="/create-mission" className="text-sm font-semibold text-gray-600 hover:text-blue-600">
              Nueva Misión
            </Link>
            <Link to="/profile" className="text-sm font-semibold text-gray-600 hover:text-blue-600">
              Mi Perfil
            </Link>
            
            <NotificationDropdown /> 
            
            <button onClick={logout} className="text-sm font-bold text-red-500 hover:text-red-600">
              Salir
            </button>
          </>
        ) : (
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm">
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;