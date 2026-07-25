'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DashboardStats } from '@/lib/types/dashboard';

export default function ApplicationActivityChart({
  data,
}: {
  data: DashboardStats['applicationActivity'];
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
      <h2 className="font-semibold text-slate-950">Application activity</h2>
      <p className="mt-0.5 text-sm text-slate-500">Progress across the last six months.</p>
      <div className="mt-4 h-52 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: -24, right: 8 }}>
            <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#6B7280' }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Line type="monotone" dataKey="applications" name="Applications" stroke="#4F46E5" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="interviews" name="Interviews" stroke="#10B981" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="offers" name="Offers" stroke="#F59E0B" strokeWidth={2.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
        <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-indigo-600" />Applications</span>
        <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-emerald-500" />Interviews</span>
        <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber-500" />Offers</span>
      </div>
    </section>
  );
}
