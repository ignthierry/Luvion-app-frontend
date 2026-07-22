export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.luvion.my.id/api';
export const STORAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '') + '/storage';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') {
      // Unauthorized, clear token and redirect
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}
