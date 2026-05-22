import React, { useState, useEffect, useContext } from 'react';
import MissionCard from '../components/MissionCard';
import Navbar from '../components/Navbar.jsx';
import AuthContext from '../context/AuthContext';
import UserBanner from '../components/UserBanner';
import { API_URL } from '../config';

const MissionSkeleton = () => (
  <div className="card flex flex-col gap-4">
    <div className="skeleton sk-map" />
    <div className="flex flex-col gap-2">
      <div className="skeleton sk-title sk-w-60" />
      <div className="skeleton sk-xs sk-w-40" />
    </div>
    <div className="flex gap-2">
      <div className="skeleton sk-tag sk-w-72" />
      <div className="skeleton sk-tag sk-w-56" />
    </div>
  </div>
);

const EmptyFeed = () => (
  <div className="empty-state card anim-fade-up">
    <div className="empty-state__icon">🛸</div>
    <p className="empty-state__title">El cielo está despejado</p>
    <p className="text-sm text-muted max-w-300">
      Todavía no hay misiones en el feed. ¡Sé el primero en subir una ruta!
    </p>
    <a href="/create-mission" className="btn btn--primary btn--sm">
      + Nueva Misión
    </a>
  </div>
);

const FILTERS = ['Recientes', 'Populares', 'Cercanas'];

const Home = () => {
  const [missions, setMissions]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeFilter, setFilter] = useState('Recientes');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response = await fetch(`${API_URL}/missions/feed/`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setMissions(data);
      } catch (error) {
        console.error('Error al cargar el feed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <div className="container">

          <div className="home-header anim-fade-up">
            <div>
              <h1 className="home-title">
                Feed de <span className="text-gradient">Misiones</span>
              </h1>
              <p className="text-sm text-muted">
                Rutas reales capturadas desde el aire por la comunidad
              </p>
            </div>

            <div className="card home-filters">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`home-filter-btn${activeFilter === f ? ' active' : ''}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="home-layout">
            <main className="flex flex-col gap-4">
              {loading ? (
                <>
                  <MissionSkeleton />
                  <MissionSkeleton />
                  <MissionSkeleton />
                </>
              ) : missions.length === 0 ? (
                <EmptyFeed />
              ) : (
                missions.map((mission, i) => (
                  <div
                    key={mission.id}
                    className="anim-fade-up"
                    style={{ '--anim-delay': `${i * 60}ms` }}
                  >
                    <MissionCard mission={mission} />
                  </div>
                ))
              )}
            </main>

            {user && (
              <aside className="home-sidebar">
                <UserBanner user={user} />

                <div className="card anim-fade-up anim-delay-2">
                  <p className="text-xs font-semibold text-secondary home-activity-label">
                    📡 Tu actividad
                  </p>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Misiones',   value: user.mission_count   ?? '—', icon: '🛸' },
                      { label: 'Seguidores', value: user.followers_count ?? '—', icon: '👥' },
                      { label: 'Km volados', value: user.total_km        ?? '—', icon: '📍' },
                    ].map(({ label, value, icon }) => (
                      <div key={label} className="stat-chip justify-between">
                        <span>{icon} {label}</span>
                        <span className="stat-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a href="/create-mission" className="btn btn--primary btn--full anim-fade-up anim-delay-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Nueva Misión
                </a>
              </aside>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
