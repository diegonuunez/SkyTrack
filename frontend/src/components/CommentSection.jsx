import React, { useState, useEffect } from 'react';
import { socialService } from '../services/socialService';

const CommentSection = ({ missionId, token, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, [missionId]);

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
      const createdComment = await socialService.postComment(missionId, newComment, token);
      // Actualizamos la lista localmente para que sea instantáneo
      setComments([createdComment, ...comments]);
      setNewComment("");
    } catch (err) {
      alert("No se pudo publicar el comentario");
    }
  };

  if (loading) return <p className="text-gray-500">Cargando comentarios...</p>;

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-bold text-lg mb-4">Comentarios ({comments.length})</h3>

      {/* Formulario para comentar */}
      {token ? (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe un comentario como piloto..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Publicar
          </button>
        </form>
      ) : (
        <p className="text-sm text-gray-500 mb-4 italic">Inicia sesión para comentar.</p>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <img
              src={comment.user_avatar || "/default-avatar.png"}
              alt={comment.user_name}
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div className="bg-gray-50 p-3 rounded-lg flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sm text-blue-900">{comment.user_name}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;