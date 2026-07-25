export type ApplicationStatus =
  | 'SAVED'
  | 'APPLIED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export type Application = {
  id: string;
  status: ApplicationStatus;
  appliedAt: string | null;
  notes: string | null;
  jobId: string;
  createdAt: string;
  updatedAt: string;
  followUpNeeded?: boolean;
  interviews?: Interview[];
  _count?: {
    interviews: number;
  };
  job: {
    id: string;
    title: string;
    company: string;
    location?: string | null;
    source?: string | null;
    jobUrl?: string | null;
  };
};

export type ApplicationsListResponse = {
  count: number;
  applications: Application[];
  summary: {
    active: number;
    needsFollowUp: number;
    upcomingInterviews: number;
    offers: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
import type { Interview } from './interview';
