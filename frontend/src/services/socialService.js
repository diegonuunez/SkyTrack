import { apiFetch } from '../api/fetchClient';

export const socialService = {
  getSaved: async () => {
    return apiFetch('/social/saved/');
  },

  getLiked: async () => {
    return apiFetch('/social/liked/');
  },

  getComments: async (missionId) => {
    return apiFetch(`/social/mission/${missionId}/comments/`);
  },

  postComment: async (missionId, text) => {
    return apiFetch(`/social/mission/${missionId}/comments/`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  toggleFollow: async (username) => {
    return apiFetch(`/profile/user/${username}/follow/`, { method: 'POST' });
  },
};
