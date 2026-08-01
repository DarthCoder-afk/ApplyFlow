import type { Application } from './types/application';

import type { Interview } from './types/interview';

const DAY = 86_400_000;

export function getAppliedAgeLabel(application: Pick<Application, 'appliedAt' | 'createdAt'>, now = new Date()) {
  const date = new Date(application.appliedAt ?? application.createdAt);
  const days = Math.max(Math.floor((now.getTime() - date.getTime()) / DAY), 0);
  if (days === 0) return 'Applied today';
  if (days === 1) return 'Applied yesterday';
  return `Applied ${days} days ago`;
}

export function getUpcomingInterview(application: Pick<Application, 'interviews'>) {
  return application.interviews?.[0] ?? null;
}

export function getInterviewTimeLabel(interview: Interview, now = new Date()) {
  const scheduled = new Date(interview.scheduledAt);
  const dayDifference = Math.ceil((scheduled.getTime() - now.getTime()) / DAY);
  const time = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  }).format(scheduled);

  if (dayDifference <= 0) return `Interview today at ${time}`;
  if (dayDifference === 1) return `Interview tomorrow at ${time}`;
  return `Interview in ${dayDifference} days`;
}
