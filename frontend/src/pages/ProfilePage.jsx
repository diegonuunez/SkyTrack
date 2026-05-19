import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MissionCard from '../components/MissionCard';
import '../style/global.css';

export const ProfilePage = () => {
  const { username } = useParams();
  const [user,     setUser]     = useState(null);
  const [missions, setMissions] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, missionsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/profile/${username}/`),
          fetch(`http://127.0.0.1:8000/api/profile/${username}/missions/`),
        ]);
        setUser(await userRes.json());
        setMissions(await missionsRes.json());
      } catch (e) {
        console.error('Error cargando perfil', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [username]);

  if (loading) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="card profile-header anim-fade-in">
          <div className="skeleton sk-avatar" />
          <div className="flex flex-col gap-3 flex-1">
            <div className="skeleton sk-h1 sk-w-40" />
            <div className="skeleton sk-body sk-w-20" />
            <div className="skeleton sk-body sk-w-60" />
          </div>
          <div className="skeleton sk-w-custom-180-80" />
        </div>
        {[0, 1].map(i => (
          <div key={i} className="card flex flex-col gap-4 mb-5">
            <div className="skeleton sk-card-img" />
            <div className="skeleton sk-title sk-w-50" />
            <div className="skeleton sk-xs sk-w-35" />
          </div>
        ))}
      </div>
    </div>
  );

  if (!user) return (
    <div className="page-wrapper">
      <div className="container">
        <div className="alert alert--danger anim-fade-up">
          <span>⚠️</span>
          <span>Usuario no encontrado.</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container">

        <div className="card profile-header anim-fade-up">
          {user.avatar ? (
            <img src={user.avatar} alt={user.username} className="avatar avatar--2xl" />
          ) : (
            <div className="avatar-placeholder avatar--2xl">
              {user.username[0].toUpperCase()}
            </div>
          )}

          <div className="profile-header-info">
            <h1 className="profile-header-name">{user.username}</h1>
            <p className="text-xs font-semibold profile-header-level">{user.experience_level}</p>
            <p className="text-secondary profile-header-bio">
              {user.bio || 'Este piloto prefiere que sus vuelos hablen por él.'}
            </p>
          </div>

          <div className="card card--glow flex gap-6 profile-stats-card">
            {[
              { label: 'Misiones', value: user.stats?.missions ?? 0, icon: '🛸' },
              { label: 'Me Gusta', value: user.stats?.likes    ?? 0, icon: '❤️' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="pc-stat">
                <p className="profile-stat-icon">{icon}</p>
                <p className="font-bold profile-stat-value">{value}</p>
                <p className="text-xs text-muted profile-stat-label">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 anim-fade-up anim-delay-1 mb-6">
          <h2 className="profile-missions-title">
            Historial de <span className="text-gradient">Vuelo</span>
          </h2>
          {missions.length > 0 && (
            <span className="badge badge--cyan">{missions.length}</span>
          )}
        </div>

        {missions.length === 0 ? (
          <div className="empty-state card anim-fade-up anim-delay-2">
            <div className="empty-state__icon">🏚️</div>
            <p className="empty-state__title">Hangar vacío</p>
            <p className="text-sm text-muted max-w-300">
              Este piloto no ha publicado misiones todavía.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {missions.map((mission, i) => (
              <div
                key={mission.id}
                className="anim-fade-up"
                style={{ '--anim-delay': `${i * 60}ms` }}
              >
                <MissionCard mission={mission} />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;
