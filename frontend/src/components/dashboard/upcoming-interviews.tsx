import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import type { DashboardStats } from '@/lib/types/dashboard';

function remaining(value: string) {
  const hours = Math.max(Math.round((new Date(value).getTime() - Date.now()) / 3_600_000), 0);
  return hours < 24 ? `${hours}h remaining` : `${Math.ceil(hours / 24)}d remaining`;
}

export default function UpcomingInterviews({
  interviews,
}: {
  interviews: DashboardStats['upcomingInterviews'];
}) {
  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
      <h2 className="font-semibold text-slate-950">Upcoming interviews</h2>
      <p className="text-sm text-slate-500">Prepare for what&apos;s next.</p>
      {interviews.length === 0 ? (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          <CalendarDays className="mb-2 h-5 w-5" />
          No upcoming interview stages scheduled.
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {interviews.map((interview) => (
            <li key={interview.id} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <p className="text-sm font-medium text-slate-900">{interview.role}</p>
              <p className="text-xs text-slate-500">{interview.company} · {interview.typeLabel}</p>
              <p className="mt-1 text-xs font-medium text-slate-700">
                {new Date(interview.scheduledAt).toLocaleString()} · {remaining(interview.scheduledAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
      <Link href="/calendar" className="mt-4 inline-block text-xs font-medium text-indigo-600 hover:text-indigo-700">
        View calendar
      </Link>
    </section>
  );
}
