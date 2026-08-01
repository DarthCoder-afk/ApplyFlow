import { apiFetch } from './client';
import type {
  Job,
  JobPriority,
  JobsListResponse,
} from '../types/job';

export type CreateJobPayload = {
  title: string;
  company: string;
  location: string;
  description: string;
  url?: string | null;
  source: string;
  notes?: string;
  priority?: JobPriority;
  deadline?: string | null;
  allowDuplicate?: boolean;
};

export async function getJobs(params?: {
  search?: string;
  location?: string;
  source?: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  availableOnly?:boolean;
  priority?: JobPriority;
  hasApplication?: boolean;
  closingSoon?: boolean;
  sort?: 'createdAt' | 'updatedAt' | 'title' | 'company' | 'priority' | 'deadline';
  order?: 'asc' | 'desc';
}) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.location) query.set('location', params.location);
  if (params?.source) query.set('source', params.source);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.fromDate) query.set('fromDate', params.fromDate);
  if (params?.toDate) query.set('toDate', params.toDate);
  if (params?.availableOnly) {
    query.set('availableOnly', 'true');
  }
  if (params?.priority) query.set('priority', params.priority);
  if (params?.hasApplication !== undefined) {
    query.set('hasApplication', String(params.hasApplication));
  }
  if (params?.closingSoon !== undefined) {
    query.set('closingSoon', String(params.closingSoon));
  }
  if (params?.sort) query.set('sort', params.sort);
  if (params?.order) query.set('order', params.order);

  const qs = query.toString();
  return apiFetch<JobsListResponse>(`/api/jobs${qs ? `?${qs}` : ''}`);
}

export async function createJob(payload: CreateJobPayload) {
  return apiFetch<{ message: string; job: Job }>('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateJob(id: string, payload: Partial<CreateJobPayload>) {
  return apiFetch<{ message: string; job: Job }>(`/api/jobs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteJob(id: string) {
  return apiFetch<{ message: string }>(`/api/jobs/${id}`, {
    method: 'DELETE',
  });
}

export async function getJob(id: string) {
  return apiFetch<{ job: Job }>(`/api/jobs/${id}`);
}
