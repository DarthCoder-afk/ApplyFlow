import {
  BriefcaseBusiness,
  CalendarCheck2,
  FileText,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import type { DashboardStats } from '@/lib/types/dashboard';

const metrics: Array<{
  key: keyof DashboardStats['totals'];
  label: string;
  icon: LucideIcon;
  style: string;
  iconStyle: string;
}> = [
  {
    key: 'totalJobs',
    label: 'Saved jobs',
    icon: BriefcaseBusiness,
    style: 'bg-indigo-50',
    iconStyle: 'bg-indigo-100 text-indigo-600',
  },
  {
    key: 'totalApplications',
    label: 'Applications',
    icon: FileText,
    style: 'bg-emerald-50',
    iconStyle: 'bg-emerald-100 text-emerald-700',
  },
  {
    key: 'totalInterviews',
    label: 'Interviews',
    icon: CalendarCheck2,
    style: 'bg-amber-50',
    iconStyle: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'totalOffers',
    label: 'Offers',
    icon: Trophy,
    style: 'bg-rose-50',
    iconStyle: 'bg-rose-100 text-rose-700',
  },
];

export default function JobSearchOverview({
  totals,
}: {
  totals: DashboardStats['totals'];
}) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/30">
      <div>
        <h2 className="font-semibold text-slate-950">Job search overview</h2>
        <p className="mt-0.5 text-sm text-slate-500">Your pipeline at a glance.</p>
      </div>
      <div className="mt-5 grid flex-1 grid-cols-2 gap-3 lg:grid-cols-4">
        {metrics.map(({ key, label, icon: Icon, style, iconStyle }) => (
          <div key={key} className={`flex min-h-32 flex-col justify-between rounded-2xl p-4 ${style}`}>
            <span className={`grid h-8 w-8 place-items-center rounded-xl ${iconStyle}`}>
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
              {totals[key]}
            </p>
            <p className="mt-0.5 text-xs font-medium text-slate-600">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
