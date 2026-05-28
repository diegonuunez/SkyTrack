import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userService } from '../services/userService';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokens = await userService.login(credentials.username, credentials.password);
      localStorage.setItem('token', tokens.access);
      localStorage.setItem('refresh', tokens.refresh);
      setToken(tokens.access);
      navigate('/');
    } catch {
      alert('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="card login-card anim-scale-in">

        <div className="login-header">
          <div className="login-logo-icon">🛸</div>
          <h1 className="login-title">
            Bienvenido a <span className="text-gradient">SkyTrack</span>
          </h1>
          <p className="text-sm text-muted">Inicia sesión para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Usuario</label>
            <input
              type="text"
              className="input"
              placeholder="Piloto Juan"
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn--primary btn--full btn--lg login-submit">
            Iniciar Sesión
          </button>
        </form>

        <p className="text-sm text-muted text-center" style={{ marginTop: 'var(--space-4)' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-gradient" style={{ fontWeight: 600 }}>
            Regístrate
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
