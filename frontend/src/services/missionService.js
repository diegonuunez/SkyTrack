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
  },

  toggleLike: async (id, token) => {
    const res = await fetch(`${API_URL}/missions/${id}/like/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) throw new Error("Error al modificar el like");
    return res.json();
  },

  toggleSave: async (id, token) => {
    const res = await fetch(`${API_URL}/missions/${id}/save/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) throw new Error("Error al guardar la misión");
    return res.json();
  },

  uploadMission: async (missionData, token) => {
    const response = await fetch('http://127.0.0.1:8000/api/missions/upload/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: missionData
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Error al subir la misión');
    return data;
  }


};