import { apiFetch } from './client';
import type { DashboardStats } from '@/lib/types/dashboard';

export async function getDashboardStats() {
  const data = await apiFetch<{ stats: DashboardStats }>('/api/dashboard/stats');
  return data.stats;
}

export type CurrentUser = {
  id: string;
  email: string;
  name: string | null;
};

export async function getCurrentUser() {
  const data = await apiFetch<{ user: CurrentUser }>('/api/auth/me');
  return data.user;
}
