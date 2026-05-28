import { API_URL } from '../config';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

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
