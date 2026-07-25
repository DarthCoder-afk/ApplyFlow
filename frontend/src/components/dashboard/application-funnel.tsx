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
  const supportedStages = funnel.filter((stage) => stage.supported);
  const max = Math.max(supportedStages[0]?.count ?? 0, 1);
  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
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
        {supportedStages.map((stage, index) => (
          <div key={stage.stage}>
            <div className="mb-1.5 flex justify-between text-sm">
              <span className="font-medium text-slate-700">{stage.stage}</span>
              <span className="text-slate-500">{stage.count} · {stage.conversionRate}%</span>
            </div>
            <div className="h-8 overflow-hidden rounded-lg bg-slate-100">
              <div
                className="flex h-full min-w-0 items-center rounded-lg px-3 text-xs text-white"
                style={{
                  width: `${Math.max((stage.count / max) * 100, stage.count ? 8 : 0)}%`,
                  backgroundColor: ['#4F46E5', '#6366F1', '#818CF8'][index] ?? '#A5B4FC',
                }}
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
