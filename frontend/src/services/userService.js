import { apiFetch } from '../api/fetchClient';

export const userService = {
  login: async (username, password) => {
    return apiFetch('/token/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  register: async ({ username, email, password, password2 }) => {
    try {
      return await apiFetch('/users/register/', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, password2 }),
      });
    } catch (err) {
      // Re-throw raw field errors so the form can display them per-field
      throw err.data || err;
    }
  },

  getProfile: async () => {
    return apiFetch('/users/me/');
  },

  getPublicProfile: async (username) => {
    return apiFetch(`/profile/${username}/`);
  },

  getPublicMissions: async (username) => {
    return apiFetch(`/profile/${username}/missions/`);
  },

  search: async (query) => {
    return apiFetch(`/users/search/?search=${encodeURIComponent(query)}`);
  },

  updateProfile: async (formData) => {
    return apiFetch('/profile/update/', {
      method: 'PATCH',
      body: formData,
    });
  },
};
