import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/SkyTrackLogo.svg';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return `${avatarPath}?v=${Date.now()}`;
    return `http://127.0.0.1:8000${avatarPath}?v=${Date.now()}`;
  };

  return (
  <nav className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-[1000] shadow-sm">      {/* 1. Logo y Enlaces Principales */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="SkyTrack Logo" className="h-8 w-auto" />      
        </Link>

        {/* Menú de Navegación */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-sm font-bold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`
            }
          >
            Explorar
          </NavLink>

          {/* ESTO SOLO SE MUESTRA SI HAY USUARIO */}
          {user && (
            <>
              <NavLink 
                to="/saved" 
                className={({ isActive }) => 
                  `text-sm font-bold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`
                }
              >
                Guardados
              </NavLink>
              <NavLink 
                to="/liked" 
                className={({ isActive }) => 
                  `text-sm font-bold transition-colors ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`
                }
              >
                Me Gusta
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* 2. Lado derecho: Perfil o Login */}
      <div className="flex items-center gap-4">
        {user ? (
          <Link 
            to="/profile" 
            className="flex items-center gap-3 bg-gray-50 pr-4 pl-1.5 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-white font-bold shadow-inner">
              {user.profile?.avatar ? (
                <img 
                  src={getAvatarUrl(user.profile.avatar)} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-bold text-gray-800 group-hover:text-blue-700 leading-tight">
                {user.username}
              </span>
              <span className="text-[10px] uppercase font-extrabold text-blue-500 tracking-wider">
                {user.profile?.experience_level || 'Piloto'}
              </span>
            </div>
          </Link>
        ) : (
          <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all">
            Entrar
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;