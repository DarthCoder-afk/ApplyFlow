import type { LoginFormValues, RegisterFormValues } from '@/lib/validation/auth';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

type ApiError = {
  message?: string;
};

export function setAccessToken(token: string) {
  localStorage.setItem('accessToken', token);
}

export function clearAuth() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken'); // cleanup old data
}

export async function refreshAccessToken(): Promise<string> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include', // sends httpOnly cookie
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message ?? 'Session expired');
  }

  setAccessToken(data.accessToken);
  return data.accessToken;
}

export async function logout(): Promise<void> {
  await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  clearAuth();
}

export async function login(values: LoginFormValues): Promise<LoginResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // receive refresh cookie
    body: JSON.stringify(values),
  });

  const data = (await res.json()) as LoginResponse & ApiError;

  if (!res.ok) {
    throw new Error(data.message ?? 'Invalid email or password');
  }

  return data;
}

export async function register(values: RegisterFormValues): Promise<LoginResponse> {
  const payload: RegisterPayload = {
    name: values.name,
    email: values.email,
    password: values.password,
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as LoginResponse & ApiError;
  if (!res.ok) {
    throw new Error(data.message ?? 'Could not create account');
  }
  return data;
}
