import { APPLICATION_STATUS_LABELS } from '@/lib/validation/application';
import type { ApplicationStatus } from '@/lib/types/application';
import { cn } from '@/lib/utils';

const styles: Record<ApplicationStatus, string> = {
  SAVED: 'bg-slate-100 text-slate-700',
  APPLIED: 'bg-cyan-50 text-cyan-700',
  INTERVIEW: 'bg-violet-50 text-violet-700',
  OFFER: 'bg-emerald-50 text-emerald-700',
  REJECTED: 'bg-red-50 text-red-700',
  WITHDRAWN: 'bg-amber-50 text-amber-700',
};

export default function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', styles[status])}
    >
      {APPLICATION_STATUS_LABELS[status]}
    </span>
  );
}
