import type { DashboardStats } from '@/lib/types/dashboard';

export default function SourcePerformance({
  sources,
}: {
  sources: DashboardStats['sourcePerformance'];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-950">Source performance</h2>
      <p className="text-sm text-slate-500">Which channels lead to interviews.</p>
      {sources.length === 0 ? (
        <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          Add a source to jobs with applications to unlock source analytics.
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr><th className="pb-3">Source</th><th className="pb-3">Applications</th><th className="pb-3">Interviews</th><th className="pb-3 text-right">Rate</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sources.map((source) => (
                <tr key={source.source}>
                  <td className="py-3 font-medium text-slate-800">{source.source.replace('_', ' ')}</td>
                  <td className="py-3 text-slate-600">{source.totalApplications}</td>
                  <td className="py-3 text-slate-600">{source.interviews}</td>
                  <td className="py-3 text-right font-medium text-slate-800">{source.interviewRate}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
