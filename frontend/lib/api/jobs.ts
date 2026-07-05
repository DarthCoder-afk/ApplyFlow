import { apiFetch } from './client';
import type { Job, JobsListResponse } from '../types/job';

export async function getJobs(params?: {
  search?: string;
  source?: string;
  page?: number;
  limit?: number;
}) {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.source) query.set('source', params.source);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const qs = query.toString();
  return apiFetch<JobsListResponse>(`/api/jobs${qs ? `?${qs}` : ''}`);
}

export async function createJob(payload: {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  source: string;
  notes?: string;
}) {
  return apiFetch<{ message: string; job: Job }>('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
