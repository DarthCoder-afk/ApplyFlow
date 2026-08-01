import { apiFetch } from './client';
import type {
  Application,
  ApplicationsListResponse,
  ApplicationStatus,
} from '@/lib/types/application';
import type { JobSource } from '@/lib/types/job';

export async function getApplications(params?: {
  status?: ApplicationStatus;
  company?: string;
  source?: JobSource;
  followUpNeeded?: boolean;
  search?: string;
  page?: number;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  sort?: 'createdAt' | 'updatedAt' | 'appliedAt' | 'status';
  order?: 'asc' | 'desc';
}) {
  const query = new URLSearchParams();
  if (params?.status) query.set('status', params.status);
  if (params?.company) query.set('company', params.company);
  if (params?.source) query.set('source', params.source);
  if (params?.followUpNeeded !== undefined) {
    query.set('followUpNeeded', String(params.followUpNeeded));
  }
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.fromDate) query.set('fromDate', params.fromDate);
  if (params?.toDate) query.set('toDate', params.toDate);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.order) query.set('order', params.order);

  const qs = query.toString();
  return apiFetch<ApplicationsListResponse>(`/api/applications${qs ? `?${qs}` : ''}`);
}

export async function createApplication(payload: {
  jobId: string;
  status?: ApplicationStatus;
  appliedAt?: string;
  notes?: string;
}) {
  return apiFetch<{ message: string; application: Application }>('/api/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateApplication(
  id: string,
  payload: { status?: ApplicationStatus; appliedAt?: string; notes?: string }
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
