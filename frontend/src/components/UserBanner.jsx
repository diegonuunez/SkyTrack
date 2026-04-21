import { useContext } from 'react';
import { Link } from 'react-router-dom'; 
import  AuthContext  from '../context/AuthContext';

export const UserBanner = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Cargando perfil...</div>; // Espera a que el contexto verifique
  if (!user) return null; // Si no hay usuario después de cargar, no mostramos nada

  return (
    <Link to="/profile" className="...">
       <span>{user.username}</span>
    </Link>
  );
};
export default UserBanner;