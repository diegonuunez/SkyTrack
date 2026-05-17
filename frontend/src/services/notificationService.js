const API_URL = 'http://127.0.0.1:8000/api/notifications';

export const notificationService = {
  getNotifications: async (token) => {
    const response = await fetch(`${API_URL}/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  },
  markAsRead: async (token) => {
    const response = await fetch(`${API_URL}/read/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.json();
  }
};