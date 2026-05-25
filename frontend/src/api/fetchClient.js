export const apiFetch = async (endpoint, options = {}) => {
  const BASE_URL = 'http://localhost:8000/api';
  
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

 
  if (!response.ok) {
    if (response.status === 401) {
      console.warn("Token inválido o caducado. Cierra sesión.");
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error en la petición al servidor');
  }
  if (response.status !== 204) {
      return await response.json();
  }
  return null;
};