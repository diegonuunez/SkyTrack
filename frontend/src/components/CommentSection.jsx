import React, { useState, useEffect } from 'react';
import { socialService } from '../services/socialService';

const CommentSection = ({ missionId, token, currentUser }) => {
  const [comments, setComments]     = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading]       = useState(true);

  useEffect(() => { loadComments(); }, [missionId]);

  const loadComments = async () => {
    try {
      const data = await socialService.getComments(missionId);
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const created = await socialService.postComment(missionId, newComment, token);
      setComments([created, ...comments]);
      setNewComment('');
    } catch {
      alert('No se pudo publicar el comentario');
    }
  };

  if (loading) return <p className="text-sm text-muted">Cargando comentarios...</p>;

  return (
    <div>
      <h4 className="font-semibold text-secondary text-xs comment-header">
        💬 Comentarios ({comments.length})
      </h4>

      {token ? (
        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            className="input"
            placeholder="Escribe un comentario como piloto..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="btn btn--secondary btn--sm">
            Publicar
          </button>
        </form>
      ) : (
        <p className="text-sm text-muted comment-login-msg">
          Inicia sesión para comentar.
        </p>
      )}

      <div className="comment-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            {comment.user_avatar ? (
              <img
                src={comment.user_avatar}
                alt={comment.user_name}
                className="avatar avatar--sm flex-shrink-0"
              />
            ) : (
              <div className="avatar-placeholder avatar--sm flex-shrink-0">
                {comment.user_name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="comment-bubble">
              <div className="comment-meta">
                <span className="comment-author">{comment.user_name}</span>
                <span className="text-xs text-muted">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
