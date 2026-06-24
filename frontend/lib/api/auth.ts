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

export async function login(values: LoginFormValues): Promise<LoginResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
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
