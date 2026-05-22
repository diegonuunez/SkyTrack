import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { token, user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav className={`sky-nav ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="sky-nav-inner">

          <Link to="/" className="sky-logo">
            <div className="sky-logo-ping-wrap">
              <div className="sky-ping" />
              <div className="sky-logo-icon">🛸</div>
            </div>
            <span className="sky-logo-text">Sky<span>Track</span></span>
          </Link>

          {token && (
            <div className="sky-center">
              <Link to="/" className={`sky-nav-link${location.pathname === '/' ? ' active' : ''}`}>
                <span className="nav-icon">🗺️</span> Explorar
              </Link>
              <Link to="/liked" className={`sky-nav-link${location.pathname === '/liked' ? ' active' : ''}`}>
                <span className="nav-icon">❤️</span> Me Gusta
              </Link>
              <Link to="/saved" className={`sky-nav-link${location.pathname === '/saved' ? ' active' : ''}`}>
                <span className="nav-icon">🔖</span> Guardadas
              </Link>
              <Link to="/create-mission" className={`sky-nav-link${location.pathname === '/create-mission' ? ' active' : ''}`}>
                <span className="nav-icon">＋</span> Nueva Misión
              </Link>
              <Link to="/profile" className={`sky-nav-link${location.pathname === '/profile' ? ' active' : ''}`}>
                <span className="nav-icon">👤</span> Mi Perfil
              </Link>
              {user?.is_staff && (
                <a
                  href="http://127.0.0.1:8000/admin/"
                  target="_blank"
                  rel="noreferrer"
                  className="sky-nav-link"
                >
                  <span className="nav-icon">⚙️</span> Admin
                </a>
              )}
            </div>
          )}

          <div className="sky-right">
            {token ? (
              <>
                <NotificationDropdown />
                <div className="sky-divider" />
                <button className="sky-logout" onClick={logout}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Salir
                </button>
              </>
            ) : (
              <Link to="/login" className="sky-cta">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                Iniciar Sesión
              </Link>
            )}
          </div>

        </div>
      </nav>

      <div className="sky-nav-spacer" />
    </>
  );
};

export default Navbar;
