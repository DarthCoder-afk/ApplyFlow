'use client';

import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardStats } from '@/lib/types/dashboard';

const LABELS: Record<string, string> = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

type StatusChartProps = {
  data: DashboardStats['applicationsByStatus'];
};

export default function StatusChart({ data }: StatusChartProps) {
  const chartData = Object.entries(data).map(([status, count]) => ({
    status: LABELS[status] ?? status,
    count,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-4 text-lg font-semibold">Applications by status</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="status" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#22d3ee" radius={[8, 8, 0, 0]} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
