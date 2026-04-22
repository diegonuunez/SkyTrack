import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/SkyTrackLogo.svg'

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      {/* Logo o Título de la App */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        <img src={logo} alt="Logo" className="h-22" />      
      </Link>

      {/* Lado derecho: Enlaces y Perfil */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-gray-600 hover:text-blue-600">Feed</Link>
        
        {user ? (
          // Si el usuario está logueado, mostramos su nombre/enlace al perfil
          <Link 
            to="/profile" 
            className="bg-blue-50 px-4 py-2 rounded-lg font-semibold text-blue-700 hover:bg-blue-100 transition"
          >
            {user.username}
          </Link>
        ) : (
          // Si no, mostramos el botón de login
          <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;