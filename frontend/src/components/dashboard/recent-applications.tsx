import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { DashboardStats } from '@/lib/types/dashboard';
import StatusBadge from '@/src/components/applications/status-badge';

function updatedLabel(value: string) {
  const days = Math.max(
    Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000),
    0
  );
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days} days ago`;
}

export default function RecentApplications({
  applications,
}: {
  applications: DashboardStats['recentApplications'];
}) {
  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-950">Recent applications</h2>
          <p className="mt-0.5 text-sm text-slate-500">Your latest pipeline updates.</p>
        </div>
        <Link href="/applications" className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
          View all<ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      {applications.length === 0 ? (
        <div className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
          No applications yet. Add one to start your pipeline.
        </div>
      ) : (
        <div className="scrollbar-hidden mt-4 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs text-slate-400">
              <tr>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Stage</th>
                <th className="pb-3 text-right font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((application) => (
                <tr key={application.id}>
                  <td className="py-3">
                    <p className="font-medium text-slate-900">{application.role}</p>
                    <p className="text-xs text-slate-500">{application.company}</p>
                  </td>
                  <td className="py-3"><StatusBadge status={application.status} /></td>
                  <td className="py-3 text-right text-xs text-slate-500">{updatedLabel(application.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
