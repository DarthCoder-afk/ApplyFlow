import {
  Bookmark,
  CalendarDays,
  CircleX,
  Send,
  Trophy,
  Undo2,
  type LucideIcon,
} from 'lucide-react';
import type { ApplicationStatus } from '@/lib/types/application';
import { cn } from '@/lib/utils';

const STATUS_ICONS: Record<ApplicationStatus, LucideIcon> = {
  SAVED: Bookmark,
  APPLIED: Send,
  INTERVIEW: CalendarDays,
  OFFER: Trophy,
  REJECTED: CircleX,
  WITHDRAWN: Undo2,
};

const STATUS_ICON_STYLES: Record<ApplicationStatus, string> = {
  SAVED: 'text-slate-500',
  APPLIED: 'text-cyan-600',
  INTERVIEW: 'text-violet-600',
  OFFER: 'text-emerald-600',
  REJECTED: 'text-red-600',
  WITHDRAWN: 'text-amber-600',
};

export default function ApplicationStatusIcon({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const Icon = STATUS_ICONS[status];

  return (
    <Icon
      className={cn(
        'h-4 w-4',
        STATUS_ICON_STYLES[status],
        className
      )}
      aria-hidden="true"
    />
  );
}
