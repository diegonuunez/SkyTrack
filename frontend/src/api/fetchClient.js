import { API_URL } from '../config';

const buildHeaders = (token, isFormData, extra = {}) => ({
  ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...extra,
});

const tryRefresh = async () => {
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return null;

  const res = await fetch(`${API_URL}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  localStorage.setItem('token', data.access);
  return data.access;
};

export const apiFetch = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;
  let token = localStorage.getItem('token');

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: buildHeaders(token, isFormData, options.headers),
  });

  if (response.status === 401) {
    const newToken = await tryRefresh();
    if (newToken) {
      response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: buildHeaders(newToken, isFormData, options.headers),
      });
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event('auth:logout'));
    }
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.detail || errorData.error || 'Error en la petición al servidor');
    error.data = errorData;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
};
