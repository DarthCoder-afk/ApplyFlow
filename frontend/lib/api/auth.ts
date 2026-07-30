import type { LoginFormValues, RegisterFormValues } from '@/lib/validation/auth';
import type { UserProfile } from '@/lib/types/user';

type LoginResponse = {
  accessToken: string;
  user: UserProfile;
};

type RegisterPayload = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  suffix: string | null;
  email: string;
  password: string;
};

type ApiError = {
  message?: string;
};

async function readJsonResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type') ?? '';

  if (!contentType.includes('application/json')) {
    throw new Error('The authentication service returned an unexpected response. Please try again.');
  }

  return res.json() as Promise<T>;
}

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

  const data = await readJsonResponse<{ accessToken: string; message?: string }>(res);

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

  const data = await readJsonResponse<LoginResponse & ApiError>(res);

  if (!res.ok) {
    throw new Error(data.message ?? 'Invalid email or password');
  }

  return data;
}

export async function register(values: RegisterFormValues): Promise<LoginResponse> {
  const payload: RegisterPayload = {
    firstName: values.firstName.trim(),
    middleName: values.middleName.trim() || null,
    lastName: values.lastName.trim(),
    suffix: values.suffix.trim() || null,
    email: values.email.trim().toLowerCase(),
    password: values.password,
  };
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });
  const data = await readJsonResponse<LoginResponse & ApiError>(res);
  if (!res.ok) {
    throw new Error(data.message ?? 'Could not create account');
  }
  return data;
}
