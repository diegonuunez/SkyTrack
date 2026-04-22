const API_URL = 'http://127.0.0.1:8000/api';

export const userService = {
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

      // Si la respuesta no es 200-299, intentamos leer el error
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
  updateProfile: async (formData, token) => {
    const res = await fetch(`${API_URL}/profile/update/`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token.trim()}`
        // IMPORTANTE: No pongas 'Content-Type', el navegador lo pone solo con FormData
      },
      body: formData
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || "Error al actualizar");
    }
    
    return await res.json(); // Retorna el usuario actualizado
  }
};