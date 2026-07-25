import Link from 'next/link';
import { ArrowRight, ClipboardList } from 'lucide-react';

export default function DashboardEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <ClipboardList className="mx-auto h-8 w-8 text-slate-400" />
      <h2 className="mt-4 text-lg font-semibold text-slate-950">No applications yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        Add your first application to start seeing progress, priorities, conversion rates, and insights.
      </p>
      <Link href="/applications" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-medium text-white">
        Add application<ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
