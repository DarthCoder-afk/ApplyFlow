export type JobSource =
  | 'LINKEDIN'
  | 'INDEED'
  | 'JOBSTREET'
  | 'GLASSDOOR'
  | 'COMPANY_WEBSITE'
  | 'REFERRAL'
  | 'OTHER';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  jobUrl: string | null;
  description: string | null;
  notes: string | null;
  source: JobSource | null;
  createdAt: string;
  updatedAt: string;
};

export type JobsListResponse = {
  count: number;
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
