import type { DashboardStats } from '@/lib/types/dashboard';

export default function SourcePerformance({
  sources,
}: {
  sources: DashboardStats['sourcePerformance'];
}) {
  const max = Math.max(...sources.map((source) => source.totalApplications), 1);
  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
      <h2 className="font-semibold text-slate-950">Source performance</h2>
      <p className="text-sm text-slate-500">Which channels lead to interviews.</p>
      {sources.length === 0 ? (
        <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Add a source to jobs with applications to unlock source analytics.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {sources.map((source) => (
            <div key={source.source}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium capitalize text-slate-800">
                  {source.source.toLowerCase().replaceAll('_', ' ')}
                </span>
                <span className="text-xs text-slate-500">
                  {source.totalApplications} applications · {source.interviewRate}% interview rate
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-indigo-500"
                  style={{ width: `${(source.totalApplications / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
