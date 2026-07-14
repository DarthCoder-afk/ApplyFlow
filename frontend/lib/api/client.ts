import { clearAuth, refreshAccessToken } from './auth';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

let refreshPromise: Promise<string> | null = null;

async function getValidAccessToken(): Promise<string | null> {
  return getAccessToken();
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const attempt = async (token: string | null) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
    return res;
  };

  let token = await getValidAccessToken();
  let res = await attempt(token);

  // On 401, try refresh once
  if (res.status === 401 && path !== '/api/auth/refresh') {
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      token = await refreshPromise;
      res = await attempt(token);
    } catch {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Session expired');
    }
  }

  const data = await res.json();

  if (!res.ok) {
    const message =
      Array.isArray(data.errors) && data.errors.length > 0
        ? data.errors.map((e: { field: string; message: string }) => `${e.field}: ${e.message}`).join(', ')
        : (data.message ?? 'Request failed');
    throw new Error(message);
  }

  return data as T;
}