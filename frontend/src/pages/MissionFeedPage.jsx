import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { missionService } from '../services/missionService';
import MissionCard from '../components/MissionCard';
import Navbar from '../components/Navbar';
import '../style/global.css';

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

const FEED_META = {
  feed:  { icon: '🛸', empty: 'No hay misiones en el feed todavía.' },
  saved: { icon: '🔖', empty: 'Aún no has guardado ninguna misión.' },
  liked: { icon: '❤️', empty: 'Todavía no has dado like a ninguna misión.' },
};

export const MissionFeedPage = ({ title, feedType }) => {
  const { token } = useContext(AuthContext);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const meta = FEED_META[feedType] ?? { icon: '📡', empty: 'No hay misiones para mostrar.' };

  const removeMission = (id) => {
    setMissions(prev => prev.filter(m => m.id !== id));
  };

  const updateMission = (updatedMission) => {
    setMissions(prev =>
      prev.map(m => m.id === updatedMission.id ? { ...m, ...updatedMission } : m)
    );
  };

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (feedType === 'feed')  data = await missionService.getFeed(token);
        if (feedType === 'saved') data = await missionService.getSaved(token);
        if (feedType === 'liked') data = await missionService.getLiked(token);
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (feedType === 'feed' || token) {
      fetchMissions();
    } else {
      setLoading(false);
    }
  }, [feedType, token]);

  return (
    <>
      <Navbar />

      <div className="page-wrapper">
        <div className="container container--md">

          <div className="anim-fade-up feed-top">
            <div className="feed-header">
              <span className="feed-icon">{meta.icon}</span>
              <h1 className="feed-page-title">
                <span className="text-gradient">{title}</span>
              </h1>
            </div>
            <div className="divider" />
          </div>

          {error && (
            <div className="alert alert--danger anim-fade-up feed-error">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="flex flex-col gap-4">
              <MissionSkeleton />
              <MissionSkeleton />
              <MissionSkeleton />
            </div>
          )}

          {!loading && !error && missions.length === 0 && (
            <div className="empty-state card anim-fade-up">
              <div className="empty-state__icon">{meta.icon}</div>
              <p className="empty-state__title">Nada por aquí</p>
              <p className="text-sm text-muted feed-empty-msg">{meta.empty}</p>
              <a href="/create-mission" className="btn btn--secondary btn--sm">
                Explorar misiones
              </a>
            </div>
          )}

          {!loading && !error && missions.length > 0 && (
            <div className="flex flex-col gap-4">
              {missions.map((mission, i) => (
                <div
                  key={mission.id}
                  className="anim-fade-up"
                  style={{ '--anim-delay': `${i * 60}ms` }}
                >
                  <MissionCard
                    mission={mission}
                    onDeleted={removeMission}
                    onUpdated={updateMission}
                  />
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default MissionFeedPage;
