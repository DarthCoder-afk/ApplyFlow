export type DashboardInterview = {
  id: string;
  applicationId: string;
  type: string;
  typeLabel: string;
  scheduledAt: string;
  role: string;
  company: string;
};

export type DashboardStats = {
  totals: {
    totalJobs: number;
    totalApplications: number;
  };
  summary: {
    applicationsThisMonth: number;
    previousMonthApplications: number;
    responseRate: number;
    interviewRate: number;
    interviewApplications: number;
    submittedApplications: number;
    pendingFollowUps: number;
    oldestWaitingDays: number;
    nextInterview: DashboardInterview | null;
    goalRemaining: number;
  };
  goal: {
    target: number;
    current: number;
    percentage: number;
    monthLabel: string;
  };
  funnel: Array<{
    stage: string;
    count: number;
    conversionRate: number;
    supported: boolean;
  }>;
  funnelRates: {
    interviewRate: number;
    offerRate: number;
  };
  supportingStatuses: {
    rejected: number;
    withdrawn: number;
  };
  weeklyActivity: Array<{
    date: string;
    label: string;
    count: number;
  }>;
  sourcePerformance: Array<{
    source: string;
    totalApplications: number;
    interviews: number;
    interviewRate: number;
  }>;
  priorities: Array<{
    id: string;
    kind: 'INTERVIEW' | 'FOLLOW_UP' | 'GOAL';
    title: string;
    detail: string;
    href: string;
    actionLabel: string;
  }>;
  upcomingInterviews: DashboardInterview[];
  insights: Array<{
    id: string;
    text: string;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    occurredAt: string;
    title: string;
    detail: string;
  }>;
};
