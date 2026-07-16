// api.js

/**
 * Wrapper around fetch that automatically attaches the JWT token
 * (from localStorage) as an Authorization header, and prefixes
 * the configured API URL.
 */
export async function apiFetch(path, options = {}) {
  const API_URL = import.meta.env.VITE_API_URL; // read fresh every call, not cached at module load
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(
      (data && data.error) || `Request failed with status ${res.status}`,
    );
  }

  return data;
}
