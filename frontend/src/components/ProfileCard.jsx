import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { socialService } from '../services/socialService';

export const ProfileCard = ({ profileData }) => {
  const { user: currentUser, token, logout } = useContext(AuthContext);
  const { username } = useParams();
  const navigate = useNavigate();

  const [isFollowing,    setIsFollowing]    = useState(profileData?.is_following    || false);
  const [followersCount, setFollowersCount] = useState(profileData?.followers_count || 0);
  const [followingCount, setFollowingCount] = useState(profileData?.following_count || 0);

  const isOwnProfile = !username || username === currentUser?.username;
  const displayUser  = isOwnProfile ? currentUser : profileData;

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleFollow = async () => {
    if (!token) { alert('Debes iniciar sesión para seguir a otros pilotos'); return; }
    try {
      const data = await socialService.toggleFollow(displayUser.username, token);
      setIsFollowing(data.is_following);
      setFollowersCount(data.followers_count);
      setFollowingCount(data.following_count);
    } catch (err) {
      console.error('Error al seguir al usuario:', err);
    }
  };

  const getAvatarUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
  };

  if (!displayUser) return (
    <div className="card card-center">
      <div className="spinner" />
    </div>
  );

  const avatarSrc = getAvatarUrl(displayUser.profile?.avatar || displayUser.avatar);

  return (
    <div className="card anim-fade-up overflow-hidden">

      <div className="pc-banner" />

      <div className="pc-avatar-wrap">
        {avatarSrc ? (
          <img src={avatarSrc} alt="Avatar" className="pc-avatar" />
        ) : (
          <div className="avatar-placeholder pc-avatar-placeholder">
            {displayUser.username?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="pc-info">
        <h2 className="pc-username">{displayUser.username}</h2>
        <p className="pc-level">
          {displayUser.profile?.experience_level || displayUser.experience_level || 'Piloto'}
        </p>
      </div>

      <div className="pc-stats">
        {[
          { label: 'Seguidores', value: followersCount },
          { label: 'Siguiendo',  value: followingCount },
          { label: 'Vuelos',     value: displayUser.stats?.missions || 0 },
        ].map(({ label, value }) => (
          <div key={label} className="pc-stat">
            <span className="pc-stat-value">{value}</span>
            <span className="pc-stat-label">{label}</span>
          </div>
        ))}
      </div>

      {!isOwnProfile ? (
        <button
          onClick={handleFollow}
          className={`btn btn--full ${isFollowing ? 'btn--ghost' : 'btn--primary'}`}
        >
          {isFollowing ? 'Dejar de seguir' : 'Seguir Piloto'}
        </button>
      ) : (
        <div className="grid-2">
          <button onClick={() => navigate('/edit-profile')} className="btn btn--secondary">
            Editar Perfil
          </button>
          <button onClick={handleLogout} className="btn btn--danger">
            Salir
          </button>
        </div>
      )}

    </div>
  );
};

export default ProfileCard;
