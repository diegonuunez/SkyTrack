import React, { useState, useContext } from 'react';
import MapComponent from './Map';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { missionService } from '../services/missionService';
import CommentSection from '../components/CommentSection';
import '../style/global.css';

const MissionCard = ({ mission }) => {
  const { token, user } = useContext(AuthContext);

  const userName        = mission?.user_name       || 'Piloto';
  const missionName     = mission?.name            || 'Misión sin nombre';
  const description     = mission?.description     || 'Sin descripción disponible.';
  const userExperience  = mission?.user_experience || 'None';
  const isFollowingAuthor = mission?.is_following_author || false;

  const [isLiked,      setIsLiked]      = useState(mission?.is_liked    || false);
  const [likesCount,   setLikesCount]   = useState(mission?.likes_count || 0);
  const [isSaved,      setIsSaved]      = useState(mission?.is_saved    || false);
  const [savesCount,   setSavesCount]   = useState(mission?.saves_count || 0);
  const [showComments, setShowComments] = useState(false);

  const mapCoordinates = mission?.points?.map(p => [p.latitude, p.longitude]) || [];

  const handleLike = async () => {
    if (!token) { alert('Debes iniciar sesión para dar me gusta.'); return; }
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount(prev => next ? prev + 1 : prev - 1);
    try {
      await missionService.toggleLike(mission.id, token);
    } catch {
      setIsLiked(!next);
      setLikesCount(prev => !next ? prev + 1 : prev - 1);
    }
  };

  const handleSave = async () => {
    if (!token) { alert('Debes iniciar sesión para guardar una misión.'); return; }
    const next = !isSaved;
    setIsSaved(next);
    setSavesCount(prev => next ? prev + 1 : prev - 1);
    try {
      await missionService.toggleSave(mission.id, token);
    } catch {
      setIsSaved(!next);
      setSavesCount(prev => !next ? prev + 1 : prev - 1);
    }
  };

  const statusBadge = mission.status === 'completed' ? 'badge badge--success' : 'badge badge--warning';
  const statusLabel = mission.status === 'completed' ? 'Completada' : (mission.status || 'En curso');

  return (
    <div className="card card--interactive anim-fade-up">

      {/* Header */}
      <div className="mc-header">
        <Link to={`/profile/${userName}`} className="mc-user-info link-plain">
          <div className="avatar-placeholder mc-avatar">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold mc-username">{userName}</span>
              {isFollowingAuthor && <span className="badge badge--cyan">Siguiendo</span>}
            </div>
            <p className="text-xs text-muted mc-experience">{userExperience}</p>
          </div>
        </Link>
        <span className={statusBadge}>{statusLabel}</span>
      </div>

      {/* Body */}
      <div className="mc-body">
        <h3 className="font-bold mc-title">{missionName}</h3>
        <p className="mc-desc">{description}</p>
      </div>

      {/* Map */}
      <div className="map-container mc-map">
        {mapCoordinates.length > 0 ? (
          <MapComponent trackData={mapCoordinates} />
        ) : (
          <div className="mc-map-empty">
            <span className="mc-map-empty-icon">🗺️</span>
            Sin datos de vuelo
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mc-footer">
        <div className="mc-actions">

          <button
            onClick={handleLike}
            className={`mc-action-btn${isLiked ? ' mc-action-btn--liked' : ''}`}
          >
            <span className="mc-action-icon">{isLiked ? '❤️' : '🤍'}</span>
            {likesCount}
          </button>

          <button
            onClick={() => setShowComments(v => !v)}
            className={`mc-action-btn${showComments ? ' mc-action-btn--active' : ''}`}
          >
            <span className="mc-action-icon">💬</span>
            {showComments ? 'Ocultar' : 'Comentar'}
          </button>

          <button
            onClick={handleSave}
            className={`mc-action-btn${isSaved ? ' mc-action-btn--active' : ''}`}
          >
            <span className="mc-action-icon">{isSaved ? '🔖' : '📑'}</span>
            {savesCount}
          </button>

        </div>

        <Link to={`/mission/${mission.id}`} className="btn btn--primary btn--sm">
          Ver Detalles
        </Link>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="mc-comments-section anim-fade-up">
          <CommentSection missionId={mission.id} token={token} currentUser={user} />
        </div>
      )}

    </div>
  );
};

export default MissionCard;
