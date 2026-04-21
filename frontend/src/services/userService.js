export const userService = {
  getProfile: async (token) => {
    console.log("Intentando obtener perfil con token:", token); // <-- DEBUG
    
    const res = await fetch('http://127.0.0.1:8000/api/users/me/', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`, // Verifica que el espacio tras 'Bearer' exista
        'Content-Type': 'application/json'
      }
    });

    console.log("Respuesta del servidor (status):", res.status); // <-- DEBUG
    
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Detalle del error del backend:", errorData); // <-- ERROR REAL
      throw new Error(`Error ${res.status}`);
    }
    
    return res.json();
  }
};