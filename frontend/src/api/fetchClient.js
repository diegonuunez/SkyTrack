// src/api/fetchClient.js

export const apiFetch = async (endpoint, options = {}) => {
  // 1. Configuramos la URL base de tu backend
  const BASE_URL = 'http://localhost:8000/api';
  
  // 2. Recuperamos el token del bolsillo del piloto (localStorage)
  const token = localStorage.getItem('access_token');

  // 3. Preparamos las cabeceras por defecto
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Mantiene cualquier otra cabecera que le pasemos
  };

  // 4. Si hay token, se lo inyectamos a la cabecera
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 5. Hacemos la petición real con la API nativa
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

 
  if (!response.ok) {
    // Si el error es 401, el token ha caducado. (Aquí podríamos añadir lógica para desloguear)
    if (response.status === 401) {
      console.warn("Token inválido o caducado. Cierra sesión.");
      // localStorage.removeItem('access_token');
      // window.location.href = '/login';
    }
    
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Error en la petición al servidor');
  }

  // 6. Si todo va bien, devolvemos los datos limpios
  // Comprobamos que haya contenido para no romper el JSON parser si es un 204 No Content
  if (response.status !== 204) {
      return await response.json();
  }
  return null;
};