import Link from 'next/link';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import type { DashboardStats } from '@/lib/types/dashboard';

export default function PriorityList({ priorities }: { priorities: DashboardStats['priorities'] }) {
  return (
    <section id="priorities" className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
      <h2 className="font-semibold text-slate-950">Today&apos;s priorities</h2>
      <p className="text-sm text-slate-500">Your most useful next actions.</p>
      {priorities.length === 0 ? (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          <CheckCircle2 className="mb-2 h-5 w-5 text-emerald-600" />
          You&apos;re all caught up. No urgent priorities right now.
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {priorities.slice(0, 6).map((priority) => (
            <li key={priority.id} className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-medium text-slate-900">{priority.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{priority.detail}</p>
              <Link href={priority.href} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                {priority.actionLabel}<ArrowUpRight className="h-3 w-3" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
