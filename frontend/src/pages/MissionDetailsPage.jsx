import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { missionService } from '../services/missionService';
import { AuthContext } from '../context/AuthContext';
import MapView from '../components/Map';
import Navbar from '../components/Navbar';

export const MissionDetailsPage = () => {
  const { id }    = useParams();
  const { token } = useContext(AuthContext);
  const navigate  = useNavigate();

  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const mapCoordinates = mission?.points?.map(p => [p.latitude, p.longitude]) || [];

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const data = await missionService.getMissionById(id, token);
        setMission(data);
      } catch {
        setError('No se pudo cargar la misión. Puede que haya sido eliminada.');
      } finally {
        setLoading(false);
      }
    };
    fetchMission();
  }, [id, token]);

  const statusClass = mission?.status === 'completed' ? 'badge badge--success' : 'badge badge--warning';
  const statusLabel = mission?.status === 'completed' ? 'Completada' : (mission?.status || 'En curso');

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container container--md">

          {loading ? (
            <div className="flex flex-col gap-4">
              <div className="card flex flex-col gap-4">
                <div className="skeleton sk-h1 sk-w-55" />
                <div className="skeleton sk-body sk-w-80" />
                <div className="skeleton sk-body sk-w-65" />
                <div className="skeleton sk-block" />
              </div>
              <div className="skeleton sk-map-xl" />
            </div>
          ) : error ? (
            <>
              <div className="alert alert--danger anim-fade-up">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              <button onClick={() => navigate(-1)} className="btn btn--ghost mt-4">
                ← Volver
              </button>
            </>
          ) : !mission ? null : (
            <>
              <button
                onClick={() => navigate(-1)}
                className="btn btn--ghost btn--sm anim-fade-up mb-6"
              >
                ← Volver
              </button>

              <div className="card anim-fade-up md-card">

                <div className="md-header">
                  <h1 className="md-title">{mission.name || 'Misión sin título'}</h1>
                  <span className={statusClass}>{statusLabel}</span>
                </div>

                <p className="md-desc">
                  {mission.description || 'Sin descripción disponible.'}
                </p>

                <div className="md-stats">
                  {mission.distance_km && (
                    <div className="stat-chip">
                      <span>📍</span>
                      <span className="stat-value">{mission.distance_km} km</span>
                      <span className="text-muted text-xs">distancia</span>
                    </div>
                  )}
                  {mission.duration && (
                    <div className="stat-chip">
                      <span>⏱️</span>
                      <span className="stat-value">{mission.duration}</span>
                      <span className="text-muted text-xs">duración</span>
                    </div>
                  )}
                  {mission.max_altitude && (
                    <div className="stat-chip">
                      <span>🔼</span>
                      <span className="stat-value">{mission.max_altitude} m</span>
                      <span className="text-muted text-xs">altitud máx.</span>
                    </div>
                  )}
                </div>

                <div className="md-pilot">
                  <div className="avatar-placeholder md-pilot-avatar">
                    {mission.user_name ? mission.user_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="md-pilot-name">{mission.user_name || 'Desconocido'}</p>
                    <p className="text-xs text-muted md-pilot-level">
                      {mission.user_experience || 'Principiante'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="anim-fade-up anim-delay-2 md-map-section">
                <p className="text-xs font-semibold text-secondary md-map-label">
                  🛸 Ruta de vuelo
                </p>
                <div className="map-container md-map">
                  {mapCoordinates.length > 0 ? (
                    <MapView trackData={mapCoordinates} interactive={true} />
                  ) : (
                    <div className="md-map-empty">
                      <span className="md-map-empty-icon">🗺️</span>
                      <p className="font-semibold">Sin datos de telemetría</p>
                      <p className="text-sm text-muted">Esta misión no tiene puntos de ruta registrados.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default MissionDetailsPage;
