import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userService } from '../services/userService';

const Register = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', password2: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const tokens = await userService.register(form);
      localStorage.setItem('token', tokens.access);
      setToken(tokens.access);
      navigate('/');
    } catch (err) {
      setErrors(typeof err === 'object' ? err : { non_field_errors: ['Error al registrarse.'] });
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (key) => errors[key]?.[0];

  return (
    <div className="login-wrapper">
      <div className="card login-card anim-scale-in">

        <div className="login-header">
          <div className="login-logo-icon">🛸</div>
          <h1 className="login-title">
            Únete a <span className="text-gradient">SkyTrack</span>
          </h1>
          <p className="text-sm text-muted">Crea tu cuenta de piloto</p>
        </div>

        {fieldError('non_field_errors') && (
          <div className="alert alert--danger anim-fade-up" style={{ marginBottom: 'var(--space-4)' }}>
            <span>⚠️</span>
            <span>{fieldError('non_field_errors')}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label className="input-label">Usuario</label>
            <input
              type="text"
              className={`input${fieldError('username') ? ' input--error' : ''}`}
              placeholder="Piloto Juan"
              value={form.username}
              onChange={set('username')}
              required
            />
            {fieldError('username') && <p className="input-error-msg">{fieldError('username')}</p>}
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className={`input${fieldError('email') ? ' input--error' : ''}`}
              placeholder="piloto@email.com"
              value={form.email}
              onChange={set('email')}
              required
            />
            {fieldError('email') && <p className="input-error-msg">{fieldError('email')}</p>}
          </div>

          <div className="input-group">
            <label className="input-label">Contraseña</label>
            <input
              type="password"
              className={`input${fieldError('password') ? ' input--error' : ''}`}
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              required
            />
            {fieldError('password') && <p className="input-error-msg">{fieldError('password')}</p>}
          </div>

          <div className="input-group">
            <label className="input-label">Confirmar contraseña</label>
            <input
              type="password"
              className={`input${fieldError('password2') ? ' input--error' : ''}`}
              placeholder="••••••••"
              value={form.password2}
              onChange={set('password2')}
              required
            />
            {fieldError('password2') && <p className="input-error-msg">{fieldError('password2')}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn btn--primary btn--full btn--lg login-submit">
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-sm text-muted text-center" style={{ marginTop: 'var(--space-4)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-gradient" style={{ fontWeight: 600 }}>
            Inicia sesión
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;
