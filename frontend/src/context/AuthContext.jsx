import { createContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener('auth:logout', logout);
    return () => window.removeEventListener('auth:logout', logout);
  }, [logout]);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const userData = await userService.getProfile();
          setUser(userData);
        } catch {
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
