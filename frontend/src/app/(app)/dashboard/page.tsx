'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/lib/api/dashboard';
import StatCard from '@/src/components/dashboard/stat-card';
import StatusChart from '@/src/components/dashboard/stat-chart';
import DashboardSkeleton from '@/src/components/dashboard/dashboard-skeleton';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return <p className="text-red-600">Could not load dashboard stats.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-[#6c757d]">Your job search at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total jobs" value={data.totalJobs} delay={0} />
        <StatCard
          label="Applications"
          value={data.totalApplications}
          delay={100}
          accent="text-[#212529]"
        />
        <StatCard
          label="Active"
          value={data.activeApplications}
          delay={200}
          accent="text-[#212529]"
        />
        <StatCard
          label="Interviews"
          value={data.applicationsByStatus.INTERVIEW}
          delay={300}
          accent="text-[#212529]"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StatusChart data={data.applicationsByStatus} />
        </div>

        <div className="rounded-2xl border border-[#dee2e6] bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Recent activity</h2>
          <ul className="space-y-3">
            {data.recentApplications.length === 0 ? (
              <li className="text-sm text-[#6c757d]">No applications yet.</li>
            ) : (
              data.recentApplications.map((app) => (
                <li key={app.id} className="rounded-xl border border-[#dee2e6] bg-[#f8f9fa] p-3">
                  <p className="font-medium">{app.job.title}</p>
                  <p className="text-sm text-[#6c757d]">{app.job.company}</p>
                  <p className="mt-1 text-xs text-[#212529]">{app.status}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
