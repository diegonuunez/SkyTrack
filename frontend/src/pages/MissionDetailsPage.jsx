import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { missionService } from '../services/missionService';
import { AuthContext } from '../context/AuthContext';
import MapView from '../components/Map';
import Navbar from '../components/Navbar';

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDuration(secs) {
  if (!secs || secs <= 0) return null;
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

function computeFlightMetrics(points) {
  if (!points || points.length === 0) return { distance: null, duration: null, waypoints: 0 };

  let distance = 0;
  for (let i = 1; i < points.length; i++) {
    distance += haversineKm(
      points[i - 1].latitude, points[i - 1].longitude,
      points[i].latitude,     points[i].longitude
    );
  }

  const timestamps = points.map(p => p.timestamp).filter(Boolean);
  const duration = timestamps.length >= 2
    ? formatDuration(Math.round(timestamps[timestamps.length - 1] - timestamps[0]))
    : null;

  return {
    distance: distance > 0 ? distance.toFixed(2) : null,
    duration,
    waypoints: points.length,
  };
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const MissionDetailsPage = () => {
  const { id }    = useParams();
  const { token } = useContext(AuthContext);
  const navigate  = useNavigate();

  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const mapCoordinates = mission?.points?.map(p => [p.latitude, p.longitude]) || [];

  const flightMetrics = useMemo(() => computeFlightMetrics(mission?.points), [mission?.points]);

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
                  {flightMetrics.distance && (
                    <div className="stat-chip">
                      <span>📍</span>
                      <span className="stat-value">{flightMetrics.distance} km</span>
                      <span className="text-muted text-xs">distancia</span>
                    </div>
                  )}
                  {flightMetrics.duration && (
                    <div className="stat-chip">
                      <span>⏱️</span>
                      <span className="stat-value">{flightMetrics.duration}</span>
                      <span className="text-muted text-xs">duración</span>
                    </div>
                  )}
                  {mission.max_alt_m > 0 && (
                    <div className="stat-chip">
                      <span>🔼</span>
                      <span className="stat-value">{mission.max_alt_m.toFixed(1)} m</span>
                      <span className="text-muted text-xs">altitud máx.</span>
                    </div>
                  )}
                  {mission.max_vel_ms > 0 && (
                    <div className="stat-chip">
                      <span>💨</span>
                      <span className="stat-value">{mission.max_vel_ms.toFixed(1)} m/s</span>
                      <span className="text-muted text-xs">velocidad máx.</span>
                    </div>
                  )}
                  {flightMetrics.waypoints > 0 && (
                    <div className="stat-chip">
                      <span>📡</span>
                      <span className="stat-value">{flightMetrics.waypoints}</span>
                      <span className="text-muted text-xs">waypoints</span>
                    </div>
                  )}
                  {mission.drone_model && mission.drone_model !== 'Unknown' && (
                    <div className="stat-chip">
                      <span>🚁</span>
                      <span className="stat-value">{mission.drone_model}</span>
                      <span className="text-muted text-xs">dron</span>
                    </div>
                  )}
                  {formatDate(mission.date) && (
                    <div className="stat-chip">
                      <span>📅</span>
                      <span className="stat-value">{formatDate(mission.date)}</span>
                      <span className="text-muted text-xs">fecha</span>
                    </div>
                  )}
                  {mission.likes_count > 0 && (
                    <div className="stat-chip">
                      <span>❤️</span>
                      <span className="stat-value">{mission.likes_count}</span>
                      <span className="text-muted text-xs">likes</span>
                    </div>
                  )}
                  {mission.saves_count > 0 && (
                    <div className="stat-chip">
                      <span>🔖</span>
                      <span className="stat-value">{mission.saves_count}</span>
                      <span className="text-muted text-xs">guardados</span>
                    </div>
                  )}
                  {mission.comments_count > 0 && (
                    <div className="stat-chip">
                      <span>💬</span>
                      <span className="stat-value">{mission.comments_count}</span>
                      <span className="text-muted text-xs">comentarios</span>
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
