import type { DashboardStats } from '@/lib/types/dashboard';

export default function GoalProgress({ goal }: { goal: DashboardStats['goal'] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
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
        Default target: 20 applications. Ready to connect to user settings later.
      </p>
    </div>
  );
}
