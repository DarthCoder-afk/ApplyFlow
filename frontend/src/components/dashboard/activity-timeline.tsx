import type { DashboardStats } from '@/lib/types/dashboard';

export default function ActivityTimeline({
  activity,
}: {
  activity: DashboardStats['recentActivity'];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold text-slate-950">Recent activity</h2>
      <p className="text-sm text-slate-500">Based on creation and latest update timestamps.</p>
      {activity.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No application activity yet.</p>
      ) : (
        <ol className="relative mt-5 space-y-5 border-l border-slate-200 pl-5">
          {activity.map((item) => (
            <li key={item.id} className="relative">
              <span className="absolute -left-[1.48rem] top-1.5 h-2.5 w-2.5 rounded-full bg-slate-900 ring-4 ring-white" />
              <p className="text-sm font-medium text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-500">{item.detail}</p>
              <time className="mt-1 block text-xs text-slate-400">
                {new Date(item.occurredAt).toLocaleString()}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
