'use client';

import { useQuery } from '@tanstack/react-query';
import {
  CalendarCheck2,
  MessageCircleReply,
  Send,
  TrendingUp,
} from 'lucide-react';
import { getCurrentUser, getDashboardStats } from '@/lib/api/dashboard';
import DashboardSkeleton from '@/src/components/dashboard/dashboard-skeleton';
import DashboardSummary from '@/src/components/dashboard/dashboard-summary';
import MetricCard from '@/src/components/dashboard/metric-card';
import GoalProgress from '@/src/components/dashboard/goal-progress';
import ApplicationFunnel from '@/src/components/dashboard/application-funnel';
import WeeklyActivityChart from '@/src/components/dashboard/weekly-activity-chart';
import SourcePerformance from '@/src/components/dashboard/source-performance';
import PriorityList from '@/src/components/dashboard/priority-list';
import UpcomingInterviews from '@/src/components/dashboard/upcoming-interviews';
import InsightsPanel from '@/src/components/dashboard/insights-panel';
import ActivityTimeline from '@/src/components/dashboard/activity-timeline';
import DashboardEmptyState from '@/src/components/dashboard/dashboard-empty-state';

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
        Could not load dashboard insights. Please refresh and try again.
      </div>
    );
  }

  if (data.totals.totalApplications === 0) {
    return (
      <div className="space-y-6">
        <DashboardSummary name={user?.name} summary={data.summary} />
        <DashboardEmptyState />
      </div>
    );
  }

  const monthDifference =
    data.summary.applicationsThisMonth -
    data.summary.previousMonthApplications;

  return (
    <div className="space-y-6">
      <DashboardSummary name={user?.name} summary={data.summary} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Applications this month"
          value={data.summary.applicationsThisMonth}
          detail={`${monthDifference >= 0 ? '+' : ''}${monthDifference} compared with last month`}
          icon={Send}
        />
        <MetricCard
          label="Response rate"
          value={`${data.summary.responseRate}%`}
          detail="Submitted applications that reached interview or offer"
          icon={MessageCircleReply}
        />
        <MetricCard
          label="Interview rate"
          value={`${data.summary.interviewRate}%`}
          detail={`${data.summary.interviewApplications} interviews from ${data.summary.submittedApplications} submitted applications`}
          icon={TrendingUp}
        />
        <MetricCard
          label="Pending follow-ups"
          value={data.summary.pendingFollowUps}
          detail={
            data.summary.pendingFollowUps
              ? `Oldest has waited ${data.summary.oldestWaitingDays} days`
              : 'No applications older than 7 days'
          }
          icon={CalendarCheck2}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,0.8fr)]">
        <div className="space-y-6">
          <GoalProgress goal={data.goal} />
          <div className="grid gap-6 2xl:grid-cols-2">
            <ApplicationFunnel
              funnel={data.funnel}
              rates={data.funnelRates}
              supporting={data.supportingStatuses}
            />
            <WeeklyActivityChart data={data.weeklyActivity} />
          </div>
          <SourcePerformance sources={data.sourcePerformance} />
          <InsightsPanel insights={data.insights} />
          <ActivityTimeline activity={data.recentActivity} />
        </div>

        <aside className="space-y-6">
          <PriorityList priorities={data.priorities} />
          <UpcomingInterviews interviews={data.upcomingInterviews} />
        </aside>
      </div>
    </div>
  );
}
