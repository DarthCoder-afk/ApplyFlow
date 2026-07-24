import { apiFetch } from './client';
import type {
  CreateInterviewPayload,
  Interview,
  UpdateInterviewPayload,
} from '@/lib/types/interview';

function interviewPath(
  applicationId: string,
  interviewId?: string
) {
  const basePath =
    `/api/applications/${encodeURIComponent(applicationId)}` +
    '/interviews';

  return interviewId
    ? `${basePath}/${encodeURIComponent(interviewId)}`
    : basePath;
}

export async function getInterviews(
  applicationId: string
) {
  return apiFetch<{
    count: number;
    interviews: Interview[];
  }>(interviewPath(applicationId));
}

export async function getInterview(
  applicationId: string,
  interviewId: string
) {
  return apiFetch<{
    interview: Interview;
  }>(interviewPath(applicationId, interviewId));
}

export async function createInterview(
  applicationId: string,
  payload: CreateInterviewPayload
) {
  return apiFetch<{
    message: string;
    interview: Interview;
  }>(interviewPath(applicationId), {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateInterview(
  applicationId: string,
  interviewId: string,
  payload: UpdateInterviewPayload
) {
  return apiFetch<{
    message: string;
    interview: Interview;
  }>(interviewPath(applicationId, interviewId), {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteInterview(
  applicationId: string,
  interviewId: string
) {
  return apiFetch<{
    message: string;
  }>(interviewPath(applicationId, interviewId), {
    method: 'DELETE',
  });
}