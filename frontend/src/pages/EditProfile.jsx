import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { userService } from '../services/userService';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export const EditProfilePage = () => {
  const { user, setUser, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const [formData, setFormData] = useState({
    bio:            user.profile?.bio            || '',
    location:       user.profile?.location       || '',
    favorite_drone: user.profile?.favorite_drone || '',
  });

  const [avatar, setAvatar]   = useState(null);
  const [preview, setPreview] = useState(() => {
    if (!user.profile?.avatar) return null;
    return user.profile.avatar.startsWith('http')
      ? user.profile.avatar
      : `http://127.0.0.1:8000${user.profile.avatar}`;
  });

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setAvatar(file); setPreview(URL.createObjectURL(file)); }
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
      setUser((prevUser) => {
        if (responseData.username) return responseData;
        return { ...prevUser, profile: responseData };
      });
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container container--sm">

          <h1 className="edit-title">
            Editar <span className="text-gradient">Perfil</span>
          </h1>

          {error && (
            <div className="alert alert--danger anim-fade-up edit-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="card anim-fade-up">
            <form onSubmit={handleSubmit} className="edit-form">

              <div className="avatar-upload">
                <div className="avatar-preview">
                  {preview
                    ? <img src={preview} alt="Preview" />
                    : <span className="avatar-empty-icon">👤</span>
                  }
                </div>
                <label className="avatar-upload-label">
                  Cambiar foto
                  <input
                    type="file"
                    className="file-input-hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="input-group">
                <label className="input-label">Biografía</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="input"
                  rows={3}
                />
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Ubicación</label>
                  <input
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Drone Favorito</label>
                  <input
                    value={formData.favorite_drone}
                    onChange={(e) => setFormData({ ...formData, favorite_drone: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn--primary btn--full btn--lg">
                {loading ? 'Guardando cambios...' : 'Guardar cambios'}
              </button>

            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default EditProfilePage;
