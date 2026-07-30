import { apiFetch } from './client';
import type { DashboardStats } from '@/lib/types/dashboard';
import type { UserProfile } from '@/lib/types/user';
import { normalizeUserProfile, type UserProfilePayload } from '@/lib/user-profile';

export async function getDashboardStats() {
  const data = await apiFetch<{ stats: DashboardStats }>('/api/dashboard/stats');
  return data.stats;
}

export type CurrentUser = UserProfile;

export async function getCurrentUser() {
  const data = await apiFetch<{ user: UserProfilePayload }>('/api/auth/me');
  return normalizeUserProfile(data.user);
}
