import { Lightbulb } from 'lucide-react';
import type { DashboardStats } from '@/lib/types/dashboard';

export default function InsightsPanel({ insights }: { insights: DashboardStats['insights'] }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-amber-600" />
        <h2 className="font-semibold text-slate-950">Smart insights</h2>
      </div>
      {insights.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          Not enough data for reliable insights yet. Keep tracking applications and outcomes.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {insights.map((insight) => (
            <li key={insight.id} className="rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {insight.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
