export type JobSource =
  | 'LINKEDIN'
  | 'INDEED'
  | 'JOBSTREET'
  | 'GLASSDOOR'
  | 'COMPANY_WEBSITE'
  | 'REFERRAL'
  | 'OTHER';

export type JobPriority = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  jobUrl: string | null;
  description: string | null;
  notes: string | null;
  source: JobSource | null;
  priority: JobPriority;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  applications: Array<{
    id: string;
    status: string;
    appliedAt: string | null;
  }>;
  possibleDuplicate?: boolean;
};

export type JobsListResponse = {
  count: number;
  jobs: Job[];
  summary: {
    all: number;
    highPriority: number;
    hasApplication: number;
    closingSoon: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
