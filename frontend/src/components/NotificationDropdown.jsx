import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
  const { token, user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const loadNotifications = async () => {
    if (!user) return;
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Error al traer notificaciones:', err);
    }
  };

  useEffect(() => { loadNotifications(); }, [user]);

  const handleToggle = async () => {
    if (!isOpen && unreadCount > 0) {
      try {
        await notificationService.markAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      } catch (err) {
        console.error('Error al marcar como leídas:', err);
      }
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notif-wrap" ref={dropdownRef}>

      <button
        onClick={handleToggle}
        className={`notif-btn${isOpen ? ' notif-btn--open' : ''}`}
      >
        <span className="notif-btn-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notif-count">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notif-dropdown">

          <div className="notif-header">
            <span className="notif-header-label text-xs font-semibold text-secondary">
              Centro de Control
            </span>
            {unreadCount > 0 && <span className="badge badge--cyan">{unreadCount} nuevas</span>}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="notif-empty">
                <div className="notif-empty-icon">🛩️</div>
                <p className="text-sm">Cielo despejado. Sin novedades.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notif-item${!notif.is_read ? ' notif-item--unread' : ''}`}
                >
                  <span className="notif-item-icon">
                    {notif.notification_type === 'like' ? '❤️' : '👤'}
                  </span>
                  <div className="notif-item-body">
                    <p className="notif-item-text text-sm">
                      <Link
                        to={`/profile/${notif.sender_name}`}
                        className="notif-sender"
                        onClick={() => setIsOpen(false)}
                      >
                        {notif.sender_name}
                      </Link>{' '}
                      {notif.notification_type === 'like' ? (
                        <>
                          le dio like a{' '}
                          <Link
                            to={`/mission/${notif.mission}`}
                            className="notif-mission"
                            onClick={() => setIsOpen(false)}
                          >
                            {notif.mission_name}
                          </Link>
                        </>
                      ) : (
                        <span className="text-secondary">comenzó a seguirte.</span>
                      )}
                    </p>
                    <span className="notif-item-time text-xs text-muted">
                      {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  {!notif.is_read && <span className="notif-unread-dot" />}
                </div>
              ))
            )}
          </div>

          <div className="notif-footer">
            <span className="text-xs text-muted">Las alertas se marcan como leídas al abrirse</span>
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
