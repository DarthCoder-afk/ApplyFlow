import type { DashboardStats } from '@/lib/types/dashboard';

export default function ApplicationFunnel({
  funnel,
  rates,
  supporting,
}: {
  funnel: DashboardStats['funnel'];
  rates: DashboardStats['funnelRates'];
  supporting: DashboardStats['supportingStatuses'];
}) {
  const max = Math.max(funnel[0]?.count ?? 0, 1);
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-950">Application funnel</h2>
          <p className="text-sm text-slate-500">Cumulative progress through your pipeline.</p>
        </div>
        <div className="text-right text-xs text-slate-500">
          <p>Interview rate {rates.interviewRate}%</p>
          <p>Offer rate {rates.offerRate}%</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {funnel.map((stage) => (
          <div key={stage.stage}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-medium text-slate-700">{stage.stage}</span>
              <span className="text-slate-500">
                {stage.supported ? `${stage.count} · ${stage.conversionRate}%` : 'Not tracked'}
              </span>
            </div>
            <div className="h-8 overflow-hidden rounded-lg bg-slate-100">
              <div
                className="flex h-full min-w-0 items-center rounded-lg bg-slate-900 px-3 text-xs text-white"
                style={{ width: stage.supported ? `${Math.max((stage.count / max) * 100, stage.count ? 8 : 0)}%` : '0%' }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Supporting outcomes: {supporting.rejected} rejected · {supporting.withdrawn} withdrawn
      </p>
    </section>
  );
}
