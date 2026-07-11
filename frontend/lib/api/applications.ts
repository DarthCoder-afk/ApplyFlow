import { apiFetch } from './client';
import type { Application, ApplicationsListResponse, ApplicationStatus } from '@/lib/types/application';

export async function getApplications(params?: {
  status?: ApplicationStatus;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  return apiFetch<ApplicationsListResponse>(`/api/applications${qs ? `?${qs}` : ''}`);
}

export async function createApplication(payload: {
  jobId: string;
  status?: ApplicationStatus;
  notes?: string;
}) {
  return apiFetch<{ message: string; application: Application }>('/api/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateApplication(
  id: string,
  payload: { status?: ApplicationStatus; notes?: string }
) {
  return apiFetch<{ message: string; application: Application }>(`/api/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteApplication(id: string) {
  return apiFetch<{ message: string }>(`/api/applications/${id}`, {
    method: 'DELETE',
  });
}