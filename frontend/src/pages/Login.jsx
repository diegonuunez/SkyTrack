import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (username, password) => {
    const response = await fetch('http://127.0.0.1:8000/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) throw new Error('Error');
    return response.json();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tokens = await login(credentials.username, credentials.password);
      localStorage.setItem('token', tokens.access);
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
              placeholder="tu_usuario"
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

      </div>
    </div>
  );
};

export default Login;
