import { API_URL } from '../config';
const SOCIAL_URL = `${API_URL}/social`;

export const socialService = {
  // Obtener comentarios de una misión
  getComments: async (missionId) => {
    const res = await fetch(`${SOCIAL_URL}/mission/${missionId}/comments/`);
    if (!res.ok) throw new Error("Error al cargar comentarios");
    return res.json();
  },

  // Publicar un comentario
  postComment: async (missionId, text, token) => {
    const res = await fetch(`${SOCIAL_URL}/mission/${missionId}/comments/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error("Error al publicar comentario");
    return res.json();
  },
  toggleFollow: async (username, token) => {
  const response = await fetch(`${API_URL}/profile/user/${username}/follow/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    
  });

  if (!response.ok) {
    const errorText = await response.text(); 
    console.error("Respuesta del servidor:", errorText);
    throw new Error('Error en el servidor');
  }

  return response.json();
},
};