import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
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
    <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white sm:px-8">
      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            <Sparkles className="h-3.5 w-3.5" />Your next move
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            {greeting()}{name ? `, ${name}` : ''}.
          </h1>
          <div className="mt-4 space-y-1 text-sm leading-6 text-slate-300 sm:text-base">
            <p>
              {summary.pendingFollowUps
                ? `${summary.pendingFollowUps} application${summary.pendingFollowUps === 1 ? '' : 's'} may need a follow-up.`
                : 'You have no overdue follow-ups.'}
            </p>
            <p>
              {summary.nextInterview
                ? `Your next interview is ${new Date(summary.nextInterview.scheduledAt).toLocaleString()}.`
                : 'No upcoming interview stages are scheduled.'}
            </p>
            <p>
              {summary.goalRemaining
                ? `${summary.goalRemaining} application${summary.goalRemaining === 1 ? '' : 's'} to reach this month’s goal.`
                : 'You reached this month’s application goal.'}
            </p>
          </div>
        </div>
        <Link
          href="#priorities"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-slate-950 hover:bg-slate-100"
        >
          View priorities<ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
