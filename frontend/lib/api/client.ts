export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    const message =
      Array.isArray(data.errors) && data.errors.length > 0
        ? data.errors
            .map((e: { field: string; message: string }) => `${e.field}: ${e.message}`)
            .join(', ')
        : (data.message ?? 'Request failed');
    throw new Error(message);
  }
  return data as T;
}
