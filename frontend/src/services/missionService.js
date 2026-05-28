import { apiFetch } from '../api/fetchClient';

export const missionService = {
  getFeed: async () => {
    return apiFetch('/missions/');
  },

  getMissionById: async (id) => {
    return apiFetch(`/missions/${id}/`);
  },

  search: async (query) => {
    return apiFetch(`/missions/feed/?search=${encodeURIComponent(query)}`);
  },

  toggleLike: async (missionId) => {
    return apiFetch(`/social/mission/${missionId}/like/`, { method: 'POST' });
  },

  toggleSave: async (missionId) => {
    return apiFetch(`/social/mission/${missionId}/save/`, { method: 'POST' });
  },

  uploadMission: async (formData) => {
    return apiFetch('/missions/upload/', {
      method: 'POST',
      body: formData,
    });
  },

  updateMission: async (id, data) => {
    return apiFetch(`/missions/my/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteMission: async (id) => {
    return apiFetch(`/missions/my/${id}/`, { method: 'DELETE' });
  },
};
