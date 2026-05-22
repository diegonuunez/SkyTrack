import { API_URL as BASE } from '../config';
const API_URL = `${BASE}/notifications`;

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