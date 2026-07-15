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
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
