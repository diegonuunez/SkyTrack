export const missionService = {
  toggleLike: async (missionId, token) => {
    const res = await fetch(`http://127.0.0.1:8000/api/missions/${missionId}/like/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return res.json();
  },
  toggleSave: async (missionId, token) => {
    const res = await fetch(`http://127.0.0.1:8000/api/missions/${missionId}/save/`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return res.json();
  }
};