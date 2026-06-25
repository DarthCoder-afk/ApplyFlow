import { apiFetch } from './client';
import type { DashboardStats } from '@/lib/types/dashboard';

export async function getDashboardStats() {
  const data = await apiFetch<{ stats: DashboardStats }>('/api/dashboard/stats');
  return data.stats;
}
