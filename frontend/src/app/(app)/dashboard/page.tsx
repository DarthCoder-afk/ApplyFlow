'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrentUser, getDashboardStats } from '@/lib/api/dashboard';
import DashboardSkeleton from '@/src/components/dashboard/dashboard-skeleton';
import DashboardSummary from '@/src/components/dashboard/dashboard-summary';
import JobSearchOverview from '@/src/components/dashboard/job-search-overview';
import ApplicationActivityChart from '@/src/components/dashboard/application-activity-chart';
import WeeklyActivityChart from '@/src/components/dashboard/weekly-activity-chart';
import ApplicationFunnel from '@/src/components/dashboard/application-funnel';
import GoalProgress from '@/src/components/dashboard/goal-progress';
import RecentApplications from '@/src/components/dashboard/recent-applications';
import UpcomingInterviews from '@/src/components/dashboard/upcoming-interviews';
import SourcePerformance from '@/src/components/dashboard/source-performance';
import PriorityList from '@/src/components/dashboard/priority-list';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
  });

  if (isLoading) return <DashboardSkeleton />;

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        Could not load your dashboard. Please refresh and try again.
      </div>
    );
  }

  const offerCount =
    data.totals.totalOffers ??
    data.funnel.find((stage) => stage.stage === 'Offer')?.count ??
    0;
  const overviewTotals = {
    ...data.totals,
    totalInterviews:
      data.totals.totalInterviews ?? data.summary.interviewApplications,
    totalOffers: offerCount,
  };

  return (
    <div className="space-y-5">
      <DashboardSummary name={user?.name} summary={data.summary} />

      <div className="grid items-stretch gap-4 xl:grid-cols-12">
        <div className="h-full min-w-0 xl:col-span-7">
          <JobSearchOverview totals={overviewTotals} />
        </div>
        <div className="h-full min-w-0 xl:col-span-5">
          <ApplicationActivityChart data={data.applicationActivity ?? []} />
        </div>

        <div className="h-full min-w-0 xl:col-span-5">
          <WeeklyActivityChart data={data.weeklyActivity} />
        </div>
        <div className="h-full min-w-0 xl:col-span-4">
          <ApplicationFunnel
            funnel={data.funnel}
            rates={data.funnelRates}
            supporting={data.supportingStatuses}
          />
        </div>
        <div className="h-full min-w-0 xl:col-span-3">
          <GoalProgress goal={data.goal} />
        </div>

        <div className="h-full min-w-0 xl:col-span-7">
          <RecentApplications applications={data.recentApplications ?? []} />
        </div>
        <div className="h-full min-w-0 xl:col-span-5">
          <UpcomingInterviews interviews={data.upcomingInterviews} />
        </div>

        <div className="h-full min-w-0 xl:col-span-7">
          <SourcePerformance sources={data.sourcePerformance} />
        </div>
        <div className="h-full min-w-0 xl:col-span-5">
          <PriorityList priorities={data.priorities} />
        </div>
      </div>
    </div>
  );
}
