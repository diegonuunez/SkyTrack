import { apiFetch } from '../api/fetchClient';

export const notificationService = {
  getNotifications: async () => {
    return apiFetch('/notifications/');
  },

  markAsRead: async () => {
    return apiFetch('/notifications/read/', { method: 'POST' });
  },
};
