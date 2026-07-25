import { prisma } from '../../config/database';

export const DEFAULT_MONTHLY_GOAL = 20;
export const DEFAULT_FOLLOW_UP_DAYS = 7;

type AnalyticsInterview = {
  id: string;
  type: 'INITIAL' | 'HR' | 'TECHNICAL' | 'FINAL' | 'OTHER';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  scheduledAt: Date;
  createdAt: Date;
};

type AnalyticsApplication = {
  id: string;
  status: 'SAVED' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'WITHDRAWN';
  createdAt: Date;
  updatedAt: Date;
  appliedAt: Date | null;
  offeredAt: Date | null;
  notes: string | null;
  job: {
    id: string;
    title: string;
    company: string;
    source: 'LINKEDIN' | 'INDEED' | 'JOBSTREET' | 'GLASSDOOR' | 'COMPANY_WEBSITE' | 'REFERRAL' | 'OTHER' | null;
  };
  interviews: AnalyticsInterview[];
};

const DAY = 86_400_000;
const INTERVIEW_LABELS: Record<AnalyticsInterview['type'], string> = {
  INITIAL: 'Initial interview',
  HR: 'HR interview',
  TECHNICAL: 'Technical interview',
  FINAL: 'Final interview',
  OTHER: 'Interview',
};

function percentage(part: number, total: number) {
  return total === 0 ? 0 : Math.round((part / total) * 100);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSubmitted(application: AnalyticsApplication) {
  return application.status !== 'SAVED';
}

function reachedInterview(application: AnalyticsApplication) {
  return (
    application.interviews.length > 0 ||
    application.status === 'INTERVIEW' ||
    application.status === 'OFFER'
  );
}

export function buildDashboardAnalytics(
  applications: AnalyticsApplication[],
  totalJobs: number,
  now = new Date(),
  monthlyGoal = DEFAULT_MONTHLY_GOAL,
  followUpDays = DEFAULT_FOLLOW_UP_DAYS
) {
  const currentMonthStart = startOfMonth(now);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const currentMonth = applications.filter(
    (app) => app.createdAt >= currentMonthStart && app.createdAt < nextMonthStart
  );
  const previousMonth = applications.filter(
    (app) => app.createdAt >= previousMonthStart && app.createdAt < currentMonthStart
  );
  const submitted = applications.filter(isSubmitted);
  const interviewApplications = submitted.filter(reachedInterview);
  const offerApplications = submitted.filter(
    (app) => app.status === 'OFFER' || app.offeredAt !== null
  );

  // Response rate = submitted applications that progressed to an interview or offer,
  // divided by all submitted applications. Saved drafts are excluded.
  const responseRate = percentage(interviewApplications.length, submitted.length);
  // Interview rate uses the same submitted denominator and counts each application once,
  // even when it contains multiple interview stages.
  const interviewRate = percentage(interviewApplications.length, submitted.length);

  const followUpCutoff = new Date(now.getTime() - followUpDays * DAY);
  const pending = applications
    .filter(
      (app) =>
        ['SAVED', 'APPLIED', 'INTERVIEW'].includes(app.status) &&
        app.updatedAt <= followUpCutoff
    )
    .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime());

  const upcoming = applications
    .flatMap((app) =>
      app.interviews
        .filter(
          (interview) =>
            interview.scheduledAt >= now &&
            ['SCHEDULED', 'RESCHEDULED'].includes(interview.status)
        )
        .map((interview) => ({
          id: interview.id,
          applicationId: app.id,
          type: interview.type,
          typeLabel: INTERVIEW_LABELS[interview.type],
          scheduledAt: interview.scheduledAt,
          role: app.job.title,
          company: app.job.company,
        }))
    )
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());

  const funnel = [
    { stage: 'Applied', count: submitted.length, conversionRate: 100, supported: true },
    {
      stage: 'Interview',
      count: interviewApplications.length,
      conversionRate: percentage(interviewApplications.length, submitted.length),
      supported: true,
    },
    {
      stage: 'Offer',
      count: offerApplications.length,
      conversionRate: percentage(offerApplications.length, interviewApplications.length),
      supported: true,
    },
    { stage: 'Hired', count: 0, conversionRate: 0, supported: false },
  ];

  const weeklyActivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const end = new Date(date.getTime() + DAY);
    return {
      date: date.toISOString(),
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      count: applications.filter(
        (app) => app.createdAt >= date && app.createdAt < end
      ).length,
    };
  });

  const sourceMap = new Map<string, { total: number; interviews: number }>();
  for (const app of submitted) {
    if (!app.job.source) continue;
    const current = sourceMap.get(app.job.source) ?? { total: 0, interviews: 0 };
    current.total += 1;
    if (reachedInterview(app)) current.interviews += 1;
    sourceMap.set(app.job.source, current);
  }
  const sourcePerformance = [...sourceMap.entries()]
    .map(([source, value]) => ({
      source,
      totalApplications: value.total,
      interviews: value.interviews,
      interviewRate: percentage(value.interviews, value.total),
    }))
    .sort((a, b) => b.totalApplications - a.totalApplications);

  const goalCurrent = currentMonth.length;
  const goalRemaining = Math.max(monthlyGoal - goalCurrent, 0);
  const priorities = [
    ...upcoming.slice(0, 3).map((interview) => ({
      id: `interview-${interview.id}`,
      kind: 'INTERVIEW' as const,
      urgency: interview.scheduledAt.getTime(),
      title: `Prepare for ${interview.typeLabel.toLowerCase()}`,
      detail: `${interview.role} at ${interview.company}`,
      href: '/calendar',
      actionLabel: 'View calendar',
    })),
    ...pending.slice(0, 5).map((app) => ({
      id: `follow-up-${app.id}`,
      kind: 'FOLLOW_UP' as const,
      urgency: app.updatedAt.getTime(),
      title: 'Follow up on application',
      detail: `${app.job.title} at ${app.job.company} · ${Math.floor(
        (now.getTime() - app.updatedAt.getTime()) / DAY
      )} days waiting`,
      href: '/applications',
      actionLabel: 'View application',
    })),
    ...(goalRemaining > 0
      ? [{
          id: 'monthly-goal',
          kind: 'GOAL' as const,
          urgency: Number.MAX_SAFE_INTEGER,
          title: 'Keep your monthly momentum',
          detail: `${goalRemaining} application${goalRemaining === 1 ? '' : 's'} to reach your goal`,
          href: '/applications',
          actionLabel: 'Add application',
        }]
      : []),
  ].sort((a, b) => a.urgency - b.urgency);

  const insights: Array<{ id: string; text: string }> = [];
  if (pending.length > 0) {
    insights.push({
      id: 'follow-ups',
      text: `${pending.length} application${pending.length === 1 ? '' : 's'} may need a follow-up.`,
    });
  }
  const qualifiedSources = sourcePerformance.filter((source) => source.totalApplications >= 3);
  if (qualifiedSources.length > 0) {
    const best = [...qualifiedSources].sort(
      (a, b) => b.interviewRate - a.interviewRate
    )[0];
    if (best.interviews > 0) {
      insights.push({
        id: 'source',
        text: `${best.source.replace('_', ' ')} has your strongest interview conversion at ${best.interviewRate}%.`,
      });
    }
  }
  const thisWeek = weeklyActivity.reduce((sum, day) => sum + day.count, 0);
  const previousWeekStart = new Date(now.getTime() - 13 * DAY);
  previousWeekStart.setHours(0, 0, 0, 0);
  const previousWeekEnd = new Date(now.getTime() - 6 * DAY);
  previousWeekEnd.setHours(0, 0, 0, 0);
  const previousWeek = applications.filter(
    (app) => app.createdAt >= previousWeekStart && app.createdAt < previousWeekEnd
  ).length;
  if (thisWeek + previousWeek >= 3 && thisWeek !== previousWeek) {
    insights.push({
      id: 'pace',
      text: `You sent ${thisWeek > previousWeek ? 'more' : 'fewer'} applications this week (${thisWeek}) than last week (${previousWeek}).`,
    });
  }

  const recentActivity = [
    ...applications.map((app) => ({
      id: `application-${app.id}`,
      type: app.updatedAt.getTime() === app.createdAt.getTime() ? 'CREATED' : 'UPDATED',
      occurredAt:
        app.updatedAt.getTime() === app.createdAt.getTime() ? app.createdAt : app.updatedAt,
      title:
        app.updatedAt.getTime() === app.createdAt.getTime()
          ? `Applied to ${app.job.title}`
          : `${app.job.title} is currently ${app.status.toLowerCase()}`,
      detail: app.job.company,
    })),
    ...applications.flatMap((app) =>
      app.interviews.map((interview) => ({
        id: `interview-${interview.id}`,
        type: 'INTERVIEW_ADDED',
        occurredAt: interview.createdAt,
        title: `Added ${INTERVIEW_LABELS[interview.type].toLowerCase()}`,
        detail: `${app.job.title} at ${app.job.company}`,
      }))
    ),
  ]
    .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
    .slice(0, 8);

  return {
    totals: { totalJobs, totalApplications: applications.length },
    summary: {
      applicationsThisMonth: currentMonth.length,
      previousMonthApplications: previousMonth.length,
      responseRate,
      interviewRate,
      interviewApplications: interviewApplications.length,
      submittedApplications: submitted.length,
      pendingFollowUps: pending.length,
      oldestWaitingDays: pending[0]
        ? Math.floor((now.getTime() - pending[0].updatedAt.getTime()) / DAY)
        : 0,
      nextInterview: upcoming[0] ?? null,
      goalRemaining,
    },
    goal: {
      target: monthlyGoal,
      current: goalCurrent,
      percentage: Math.min(percentage(goalCurrent, monthlyGoal), 100),
      monthLabel: now.toLocaleDateString('en-US', { month: 'long' }),
    },
    funnel,
    funnelRates: {
      interviewRate,
      offerRate: percentage(offerApplications.length, submitted.length),
    },
    supportingStatuses: {
      rejected: applications.filter((app) => app.status === 'REJECTED').length,
      withdrawn: applications.filter((app) => app.status === 'WITHDRAWN').length,
    },
    weeklyActivity,
    sourcePerformance,
    priorities,
    upcomingInterviews: upcoming.slice(0, 5),
    insights,
    recentActivity,
  };
}

export async function getDashboardStats(userId: string) {
  const [totalJobs, applications] = await Promise.all([
    prisma.job.count({ where: { userId } }),
    prisma.application.findMany({
      where: { userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            source: true,
          },
        },
        interviews: {
          select: {
            id: true,
            type: true,
            status: true,
            scheduledAt: true,
            createdAt: true,
          },
        },
      },
    }),
  ]);

  return buildDashboardAnalytics(applications, totalJobs);
}
