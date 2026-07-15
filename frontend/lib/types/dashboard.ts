export type ApplicationStatus = 'SAVED' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED';

export type DashboardStats = {
  totalJobs: number;
  totalApplications: number;
  activeApplications: number;
  applicationsByStatus: Record<ApplicationStatus, number>;
  recentApplications: Array<{
    id: string;
    status: ApplicationStatus;
    updatedAt: string;
    job: { id: string; title: string; company: string };
  }>;
};
