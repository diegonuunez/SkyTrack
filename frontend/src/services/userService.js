import { API_URL } from '../config';

export const userService = {
  register: async ({ username, email, password, password2 }) => {
    const res = await fetch(`${API_URL}/users/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, password2 }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  },

  getProfile: async (token) => {
    if (!token) throw new Error("No token provided");

    try {
      const res = await fetch(`${API_URL}/users/me/`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token.trim()}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        let errorData;
        try {
          errorData = await res.json();
        } catch {
          errorData = { detail: "Error desconocido del servidor" };
        }
        console.error("Error en API:", errorData);
        throw new Error(errorData.detail || `Error ${res.status}`);
      }
      
      return await res.json();
      
    } catch (error) {
      console.error("Error en la conexión con el servidor:", error);
      throw error;
    }
  },
  search: async (query) => {
    const res = await fetch(`${API_URL}/users/search/?search=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Error al buscar usuarios');
    return res.json();
  },

  updateProfile: async (formData, token) => {
    const res = await fetch(`${API_URL}/profile/update/`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token.trim()}`
      },
      body: formData
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Error al actualizar");
    }
    
    return await res.json(); 
  }
};