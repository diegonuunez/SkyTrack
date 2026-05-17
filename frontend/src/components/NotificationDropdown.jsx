import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const loadNotifications = async () => {
    if (!token) return;
    try {
      const data = await notificationService.getNotifications(token);
      setNotifications(data);
    } catch (err) {
      console.error("Error al traer notificaciones:", err);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [token]);

  const handleToggle = async () => {
    if (!isOpen && unreadCount > 0) {
      try {
        await notificationService.markAsRead(token);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      } catch (err) {
        console.error("Error al marcar como leídas:", err);
      }
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de la Campana */}
      <button 
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Menú Desplegable Flotante */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="px-4 py-2 border-b border-gray-50 flex justify-between items-center">
            <span className="font-black text-gray-900 uppercase text-xs tracking-wider">Centro de Control</span>
            {unreadCount > 0 && (
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md font-bold">
                Nuevas alertas
              </span>
            )}
          </div>

          {/* Lista de Alertas */}
          <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-400 italic">
                🛩️ Cielo despejado. Sin novedades.
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-start gap-2.5 ${
                    !notif.is_read ? 'bg-blue-50/20' : ''
                  }`}
                >
                  <span className="text-lg mt-0.5 shrink-0">
                    {notif.notification_type === 'like' ? '❤️' : '👤'}
                  </span>
                  <div className="flex-1">
                    <p className="leading-normal">
                      <Link 
                        to={`/profile/${notif.sender_name}`} 
                        className="font-bold text-gray-900 hover:text-blue-600"
                        onClick={() => setIsOpen(false)}
                      >
                        {notif.sender_name}
                      </Link>{' '}
                      {notif.notification_type === 'like' ? (
                        <>
                          le dio like a{' '}
                          <Link 
                            to={`/mission/${notif.mission}`} 
                            className="font-semibold text-blue-600 hover:underline"
                            onClick={() => setIsOpen(false)}
                          >
                            {notif.mission_name}
                          </Link>
                        </>
                      ) : (
                        'comenzó a seguirte.'
                      )}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {notif.created_at ? new Date(notif.created_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  {!notif.is_read && (
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0 mt-1.5"></span>
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Pie del Desplegable */}
          <div className="p-2 border-t border-gray-50 bg-gray-50/50 text-center rounded-b-2xl">
            <span className="text-[11px] font-bold text-gray-400">
              Las alertas se marcan como leídas al abrirse
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;