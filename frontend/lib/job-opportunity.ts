import type { Job } from './types/job';

const DAY = 86_400_000;
export const STALE_JOB_DAYS = 14;

export function getJobAge(createdAt: string, now = new Date()) {
  return Math.max(Math.floor((now.getTime() - new Date(createdAt).getTime()) / DAY), 0);
}

export function getJobAgeLabel(createdAt: string, now = new Date()) {
  const days = getJobAge(createdAt, now);
  if (days === 0) return 'Saved today';
  if (days === 1) return 'Saved yesterday';
  if (days < 14) return `Saved ${days} days ago`;
  return `Saved ${Math.floor(days / 7)} weeks ago`;
}

export function isJobStale(job: Pick<Job, 'createdAt' | 'deadline'>, now = new Date()) {
  return !job.deadline && getJobAge(job.createdAt, now) >= STALE_JOB_DAYS;
}

export function getDeadlineState(deadline: string | null, now = new Date()) {
  if (!deadline) return null;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const closing = new Date(deadline);
  closing.setHours(0, 0, 0, 0);
  const days = Math.round((closing.getTime() - today.getTime()) / DAY);
  if (days === 0) return { days, label: 'Closes today', closed: false, closingSoon: true };
  if (days > 0) return { days, label: `Closes in ${days} days`, closed: false, closingSoon: days <= 7 };
  return { days, label: `Closed ${Math.abs(days)} days ago`, closed: true, closingSoon: false };
}

export function buildApplicationPayloadFromJob(job: Pick<Job, 'id'>) {
  return {
    jobId: job.id,
    status: 'APPLIED' as const,
  };
}

export function buildJobsSummaryText(summary: {
  all: number;
}) {
  return `${summary.all} saved ${summary.all === 1 ? 'opportunity' : 'opportunities'}`;
}
