import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { missionService } from '../services/missionService';
import { userService } from '../services/userService';

const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
};

const SearchBar = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [missions, setMissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setMissions([]);
      setUsers([]);
      setOpen(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    Promise.all([
      missionService.search(debouncedQuery, token).catch(() => []),
      userService.search(debouncedQuery).catch(() => []),
    ]).then(([m, u]) => {
      if (cancelled) return;
      setMissions(m.slice(0, 4));
      setUsers(u.slice(0, 4));
      setOpen(true);
      setLoading(false);
    });

    return () => { cancelled = true; };
  }, [debouncedQuery, token]);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const goTo = (path) => {
    setQuery('');
    setOpen(false);
    navigate(path);
  };

  const hasResults = missions.length > 0 || users.length > 0;

  return (
    <div className="search-bar-wrap" ref={containerRef}>
      <div className="search-bar-input-wrap">
        <svg className="search-bar-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className="search-bar-input"
          type="text"
          placeholder="Buscar misiones o pilotos…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (hasResults) setOpen(true); }}
        />
        {loading && <div className="search-bar-spinner" />}
      </div>

      {open && (
        <div className="search-dropdown">
          {!hasResults && !loading && (
            <p className="search-empty">Sin resultados para "{debouncedQuery}"</p>
          )}

          {users.length > 0 && (
            <div className="search-section">
              <p className="search-section-label">Pilotos</p>
              {users.map((u) => (
                <button key={u.id} className="search-item" onClick={() => goTo(`/profile/${u.username}`)}>
                  {u.avatar
                    ? <img src={u.avatar} alt={u.username} className="search-item-avatar" />
                    : <div className="search-item-avatar search-item-avatar--placeholder">{u.username[0].toUpperCase()}</div>
                  }
                  <div>
                    <p className="search-item-title">{u.username}</p>
                    {u.bio && <p className="search-item-sub">{u.bio}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {missions.length > 0 && (
            <div className="search-section">
              <p className="search-section-label">Misiones</p>
              {missions.map((m) => (
                <button key={m.id} className="search-item" onClick={() => goTo(`/mission/${m.id}`)}>
                  <div className="search-item-mission-icon">🛸</div>
                  <div>
                    <p className="search-item-title">{m.name}</p>
                    <p className="search-item-sub">{m.drone_model} · {m.user_name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
