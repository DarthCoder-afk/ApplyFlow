import type { LoginFormValues } from '@/lib/validation/auth';

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
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