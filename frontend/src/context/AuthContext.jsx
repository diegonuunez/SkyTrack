import { createContext, useState, useEffect } from 'react';
import { userService } from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const logout = () => {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    };

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true); // Empezamos a cargar
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const userData = await userService.getProfile(savedToken);
          setUser(userData);
        } catch (error) {
          console.error("Error al cargar:", error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false); 
    };

    loadUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, loading, logout}}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;