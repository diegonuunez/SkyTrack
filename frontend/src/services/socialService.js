const API_URL = "http://127.0.0.1:8000/api/social";

export const socialService = {
  // Obtener comentarios de una misión
  getComments: async (missionId) => {
    const res = await fetch(`${API_URL}/mission/${missionId}/comments/`);
    if (!res.ok) throw new Error("Error al cargar comentarios");
    return res.json();
  },

  // Publicar un comentario
  postComment: async (missionId, text, token) => {
    const res = await fetch(`${API_URL}/mission/${missionId}/comments/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error("Error al publicar comentario");
    return res.json();
  }
};