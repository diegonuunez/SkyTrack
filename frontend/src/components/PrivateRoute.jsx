// frontend/src/components/PrivateRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  
  // Si no hay token, redirige al login
  return token ? children : <Navigate to="/login" />;
};
export default PrivateRoute;