'use client';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { DashboardStats } from '@/lib/types/dashboard';

export default function WeeklyActivityChart({
  data,
}: {
  data: DashboardStats['weeklyActivity'];
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
      <h2 className="font-semibold text-slate-950">Weekly activity</h2>
      <p className="mt-0.5 text-sm text-slate-500">Jobs saved and applications submitted.</p>
      <div className="mt-4 h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -24 }}>
            <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="jobsSaved" name="Jobs saved" fill="#A5B4FC" radius={[5, 5, 0, 0]} />
            <Bar dataKey="applications" name="Applications" fill="#4F46E5" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex gap-4 text-xs text-slate-500">
        <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-indigo-300" />Jobs saved</span>
        <span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-indigo-600" />Applications</span>
      </div>
    </section>
  );
}
