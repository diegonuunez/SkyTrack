import { API_URL } from '../config';

export const missionService = {
  getFeed: async (token) => {
    const headers = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token.trim()}`;
    }

    const res = await fetch(`${API_URL}/missions/`, { headers });
    
    if (!res.ok) throw new Error("Error al cargar el feed público");
    return res.json();
  },

  getSaved: async (token) => {
    const res = await fetch(`${API_URL}/social/saved/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Error al cargar guardados");
    return res.json();
  },

  getLiked: async (token) => {
    const res = await fetch(`${API_URL}/social/liked/`, {
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

toggleLike: async (missionId, token) => {
    const response = await fetch(`${API_URL}/social/mission/${missionId}/like/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Error al dar like');
    return response.json();
  },

toggleSave: async (missionId, token) => {
    const response = await fetch(`${API_URL}/social/mission/${missionId}/save/`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) throw new Error('Error al guardar');
    return response.json();
  },

  search: async (query, token) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token.trim()}`;
    const res = await fetch(`${API_URL}/missions/feed/?search=${encodeURIComponent(query)}`, { headers });
    if (!res.ok) throw new Error('Error al buscar misiones');
    return res.json();
  },

  uploadMission: async (missionData, token) => {
    const response = await fetch(`${API_URL}/missions/upload/`, {
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