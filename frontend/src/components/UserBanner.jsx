import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

export const UserBanner = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="card flex items-center gap-3">
      <div className="skeleton avatar--md" />
      <div className="skeleton sk-title sk-w-60" />
    </div>
  );
  if (!user) return null;

  return (
    <Link to="/profile" className="user-banner">
      <div className="card card--interactive flex items-center gap-3">
        <div className="avatar-placeholder avatar--md user-banner-avatar">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-sm">{user.username}</p>
          <p className="text-xs text-muted">Ver mi perfil →</p>
        </div>
      </div>
    </Link>
  );
};

export default UserBanner;
