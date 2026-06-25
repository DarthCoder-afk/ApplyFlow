'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/lib/api/dashboard';
import StatCard from '@/src/components/dashboard/stat-card';
import StatusChart from '@/src/components/dashboard/stat-chart';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });

  if (isLoading) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  if (error || !data) {
    return <p className="text-red-600">Could not load dashboard stats.</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-slate-600">Your job search at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total jobs" value={data.totalJobs} delay={0} />
        <StatCard
          label="Applications"
          value={data.totalApplications}
          delay={100}
          accent="text-cyan-600"
        />
        <StatCard
          label="Active"
          value={data.activeApplications}
          delay={200}
          accent="text-violet-600"
        />
        <StatCard
          label="Interviews"
          value={data.applicationsByStatus.INTERVIEW}
          delay={300}
          accent="text-emerald-600"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <StatusChart data={data.applicationsByStatus} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Recent activity</h2>
          <ul className="space-y-3">
            {data.recentApplications.length === 0 ? (
              <li className="text-sm text-slate-500">No applications yet.</li>
            ) : (
              data.recentApplications.map((app) => (
                <li key={app.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="font-medium">{app.job.title}</p>
                  <p className="text-sm text-slate-500">{app.job.company}</p>
                  <p className="mt-1 text-xs text-cyan-700">{app.status}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
