import React, { useState, useContext } from 'react';
import MapComponent from './Map';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { missionService } from '../services/missionService';
import CommentSection from '../components/CommentSection';
import '../style/global.css';

const EDIT_FIELDS = [
  { name: 'name',        label: 'Nombre',      type: 'text' },
  { name: 'drone_model', label: 'Dron',         type: 'text' },
  { name: 'description', label: 'Descripción',  type: 'textarea' },
];

const MissionCard = ({ mission, onDeleted, onUpdated }) => {
  const { token, user } = useContext(AuthContext);

  const isOwner = user && user.username === mission?.user_name;

  const userName        = mission?.user_name       || 'Piloto';
  const userExperience  = mission?.user_experience || 'None';
  const isFollowingAuthor = mission?.is_following_author || false;

  const [missionData, setMissionData] = useState(mission);
  const [isLiked,      setIsLiked]      = useState(mission?.is_liked    || false);
  const [likesCount,   setLikesCount]   = useState(mission?.likes_count || 0);
  const [isSaved,      setIsSaved]      = useState(mission?.is_saved    || false);
  const [savesCount,   setSavesCount]   = useState(mission?.saves_count || 0);
  const [showComments, setShowComments] = useState(false);

  const [showEditModal, setShowEditModal]   = useState(false);
  const [editForm,      setEditForm]        = useState({});
  const [isSaving,      setIsSaving]        = useState(false);
  const [isDeleting,    setIsDeleting]      = useState(false);
  const [editError,     setEditError]       = useState(null);

  const mapCoordinates = missionData?.points?.map(p => [p.latitude, p.longitude]) || [];

  const handleLike = async () => {
    if (!token) { alert('Debes iniciar sesión para dar me gusta.'); return; }
    const next = !isLiked;
    setIsLiked(next);
    setLikesCount(prev => next ? prev + 1 : prev - 1);
    try {
      await missionService.toggleLike(missionData.id);
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
      await missionService.toggleSave(missionData.id);
    } catch {
      setIsSaved(!next);
      setSavesCount(prev => !next ? prev + 1 : prev - 1);
    }
  };

  const openEdit = () => {
    setEditForm({
      name:        missionData.name        || '',
      drone_model: missionData.drone_model || '',
      description: missionData.description || '',
      visibility:  missionData.visibility  || 'public',
      status:      missionData.status      || 'completed',
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setEditError(null);
    try {
      const updated = await missionService.updateMission(missionData.id, editForm);
      setMissionData(prev => ({ ...prev, ...updated }));
      setShowEditModal(false);
      if (onUpdated) onUpdated(updated);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`¿Eliminar la misión "${missionData.name}"? Esta acción no se puede deshacer.`)) return;
    setIsDeleting(true);
    try {
      await missionService.deleteMission(missionData.id);
      if (onDeleted) onDeleted(missionData.id);
    } catch {
      alert('No se pudo eliminar la misión.');
      setIsDeleting(false);
    }
  };

  const statusBadge = missionData.status === 'completed' ? 'badge badge--success' : 'badge badge--warning';
  const statusLabel = missionData.status === 'completed' ? 'Completada' : (missionData.status || 'En curso');

  return (
    <>
      <div className="card card--interactive anim-fade-up">

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
          <div className="flex items-center gap-2">
            <span className={statusBadge}>{statusLabel}</span>
            {isOwner && (
              <div className="mc-owner-actions">
                <button onClick={openEdit} className="btn btn--ghost btn--sm" title="Editar misión">
                  ✏️
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="btn btn--danger btn--sm"
                  title="Eliminar misión"
                >
                  {isDeleting ? '...' : '🗑️'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mc-body">
          <h3 className="font-bold mc-title">{missionData.name || 'Misión sin nombre'}</h3>
          <p className="mc-desc">{missionData.description || 'Sin descripción disponible.'}</p>
        </div>

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

          <Link to={`/mission/${missionData.id}`} className="btn btn--primary btn--sm">
            Ver Detalles
          </Link>
        </div>

        {showComments && (
          <div className="mc-comments-section anim-fade-up">
            <CommentSection missionId={missionData.id} currentUser={user} />
          </div>
        )}

      </div>

      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Editar Misión</h2>

            <form onSubmit={handleEditSubmit} className="create-form">

              {EDIT_FIELDS.map(field => (
                <div key={field.name} className="input-group">
                  <label className="input-label">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      rows={3}
                      value={editForm[field.name]}
                      onChange={handleEditChange}
                      className="input"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={editForm[field.name]}
                      onChange={handleEditChange}
                      className="input"
                    />
                  )}
                </div>
              ))}

              <div className="grid-2">
                <div className="input-group">
                  <label className="input-label">Visibilidad</label>
                  <select name="visibility" value={editForm.visibility} onChange={handleEditChange} className="input">
                    <option value="public">Pública</option>
                    <option value="private">Privada</option>
                  </select>
                </div>
                <div className="input-group">
                  <label className="input-label">Estado</label>
                  <select name="status" value={editForm.status} onChange={handleEditChange} className="input">
                    <option value="completed">Completada</option>
                    <option value="in_progress">En curso</option>
                  </select>
                </div>
              </div>

              {editError && (
                <p className="text-sm" style={{ color: 'var(--danger)' }}>{editError}</p>
              )}

              <div className="create-form-footer">
                <button type="button" onClick={() => setShowEditModal(false)} className="btn btn--ghost">
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="btn btn--primary">
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default MissionCard;
