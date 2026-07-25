import type { DashboardStats } from '@/lib/types/dashboard';

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardSummary({
  name,
  summary,
}: {
  name?: string | null;
  summary: DashboardStats['summary'];
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight text-slate-950">
        {greeting()}{name ? `, ${name}` : ''}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        {summary.pendingFollowUps
          ? `${summary.pendingFollowUps} application${summary.pendingFollowUps === 1 ? '' : 's'} may need your attention.`
          : 'Here is the latest from your job search.'}
      </p>
    </section>
  );
}
