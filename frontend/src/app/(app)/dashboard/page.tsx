'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { getCurrentUser, getDashboardStats } from '@/lib/api/dashboard';
import StatCard from '@/src/components/dashboard/stat-card';
import StatusChart from '@/src/components/dashboard/stat-chart';
import DashboardSkeleton from '@/src/components/dashboard/dashboard-skeleton';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: getDashboardStats,
  });
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return <p className="text-red-600">Could not load dashboard stats.</p>;
  }

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 px-6 py-7 text-white shadow-lg sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 h-52 w-52 rounded-full bg-violet-400/15 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-200 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              Your career workspace
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Welcome back{user?.name ? `, ${user.name}` : ''}.
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
              Keep your momentum going—every application moves you closer to the right role.
            </p>
          </div>
        </div>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-[#dee2e6] bg-white p-5 shadow-sm"
        >
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
        </motion.div>
      </div>
    </div>
  );
}
