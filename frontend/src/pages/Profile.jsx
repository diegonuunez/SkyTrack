import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ProfileCard } from '../components/ProfileCard';
import MissionCard from '../components/MissionCard';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser, token } = useContext(AuthContext);

  const [profileData, setProfileData] = useState(null);
  const [userMissions, setUserMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndMissions = async () => {
      setLoading(true);
      const targetUsername = username || currentUser?.username;
      if (!targetUsername) { setLoading(false); return; }

      try {
        const headers = {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        };
        const [profileRes, missionsRes] = await Promise.all([
          fetch(`${API_URL}/profile/${targetUsername}/`, { headers }),
          fetch(`${API_URL}/profile/${targetUsername}/missions/`, { headers }),
        ]);

        if (profileRes.ok && missionsRes.ok) {
          setProfileData(await profileRes.json());
          setUserMissions(await missionsRes.json());
        } else {
          setError('No se pudo cargar la información del piloto.');
        }
      } catch {
        setError('Error de conexión con el cielo... revisa tu servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndMissions();
  }, [username, currentUser, token]);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container container--md">

          {loading ? (
            <div className="profile-loading">
              <div className="spinner profile-spinner" />
              <p className="text-secondary text-sm">Sincronizando telemetría...</p>
            </div>
          ) : error ? (
            <div className="alert alert--danger anim-fade-up">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          ) : (
            <>
              <ProfileCard profileData={profileData} />

              <div className="profile-missions">
                <div className="profile-missions-header">
                  <h2 className="profile-missions-title">
                    Bitácora de <span className="text-gradient">Vuelo</span>
                  </h2>
                  <span className="badge badge--cyan">{userMissions.length} misiones</span>
                </div>

                {userMissions.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {userMissions.map((mission, i) => (
                      <div
                        key={mission.id}
                        className="anim-fade-up"
                        style={{ '--anim-delay': `${i * 60}ms` }}
                      >
                        <MissionCard mission={mission} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state card anim-fade-up">
                    <div className="empty-state__icon">🏚️</div>
                    <p className="empty-state__title">Hangar vacío</p>
                    <p className="text-sm text-muted feed-empty-msg">
                      Este piloto aún no ha registrado vuelos.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default Profile;
