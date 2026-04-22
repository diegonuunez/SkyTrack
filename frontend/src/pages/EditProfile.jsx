import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';

export const EditProfilePage = () => {
  const { user, setUser, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Mejor manejo visual de errores
  
  const [formData, setFormData] = useState({
    bio: user.profile?.bio || '',
    location: user.profile?.location || '',
    favorite_drone: user.profile?.favorite_drone || '',
  });
  
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(
    user.profile?.avatar ? `http://127.0.0.1:8000${user.profile.avatar}` : null
  );

  // Limpieza de memoria (Buena práctica PRO en React)
  useEffect(() => {
    return () => {
      // Si creamos una URL temporal para la imagen, la borramos al salir
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file)); // Vista previa instantánea
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (avatar) data.append('avatar', avatar);

    try {
      const responseData = await userService.updateProfile(data, token);
      
      // ACTUALIZACIÓN SEGURA: Mantiene el username y el email intactos
      setUser((prevUser) => {
        // Opción A: El backend devolvió el objeto User completo (tiene username)
        if (responseData.username) {
          return responseData;
        } 
        // Opción B: El backend devolvió SOLO el Profile (bio, location, etc.)
        else {
          return {
            ...prevUser,
            profile: responseData // Actualizamos solo la parte del perfil
          };
        }
      });

      navigate('/profile'); // Redirige instantáneamente y verás los cambios
    } catch (err) {
      console.error("Error en submit:", err);
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Editar Perfil</h1>
        
        {/* Mostramos el error si existe, en lugar de un alert molesto */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 border-4 border-white shadow-lg">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">👤</div>
              )}
            </div>
            <label className="text-blue-600 font-semibold cursor-pointer hover:underline">
              Cambiar foto
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Biografía</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Ubicación</label>
              <input 
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Drone Favorito</label>
              <input 
                value={formData.favorite_drone}
                onChange={(e) => setFormData({...formData, favorite_drone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className={`w-full text-white py-3 rounded-xl font-bold transition-all duration-300 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? "Guardando cambios..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default EditProfilePage;