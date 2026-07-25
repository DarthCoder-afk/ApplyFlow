import Link from 'next/link';
import { Target } from 'lucide-react';
import type { DashboardStats } from '@/lib/types/dashboard';

export default function GoalProgress({ goal }: { goal: DashboardStats['goal'] }) {
  if (!goal.configured) {
    return (
      <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
        <h2 className="font-semibold text-slate-950">Monthly goal</h2>
        <div className="mt-5 flex flex-1 flex-col justify-center rounded-xl bg-indigo-50 p-4">
          <Target className="h-5 w-5 text-indigo-600" />
          <p className="mt-3 text-sm font-medium text-slate-900">No goal configured</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Set a monthly application target when goal preferences become available.
          </p>
          <Link href="/settings" className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:text-indigo-700">
            View settings
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{goal.monthLabel} goal</p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {goal.current} <span className="text-slate-400">/ {goal.target}</span>
          </p>
        </div>
        <p className="text-sm font-semibold text-slate-700">{goal.percentage}%</p>
      </div>
      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-label={`${goal.monthLabel} application goal`}
        aria-valuenow={goal.percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-slate-950" style={{ width: `${goal.percentage}%` }} />
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {goal.remaining} application{goal.remaining === 1 ? '' : 's'} remaining this month.
      </p>
    </section>
  );
}
