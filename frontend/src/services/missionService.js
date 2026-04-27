const API_URL = 'http://127.0.0.1:8000/api';

export const missionService = {
  // Pide todas las misiones (Feed principal)
  getFeed: async (token) => {
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    const res = await fetch(`${API_URL}/missions/`, { headers });
    
    if (!res.ok) throw new Error("Error al cargar el feed público");
    return res.json();
  },

  // Pide las misiones guardadas
  getSaved: async (token) => {
    const res = await fetch(`${API_URL}/missions/saved/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error al cargar guardados");
    return res.json();
  },

  // Pide las misiones que te gustan
  getLiked: async (token) => {
    const res = await fetch(`${API_URL}/missions/liked/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error al cargar me gusta");
    return res.json();
  },

  getMissionById: async (id, token) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token.trim()}`;

    const res = await fetch(`${API_URL}/missions/${id}/`, { headers });
    if (!res.ok) throw new Error("Misión no encontrada");
    return res.json();
  }
};