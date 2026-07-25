import { buildDashboardAnalytics } from './dashboard.service';

type ApplicationInput = Parameters<typeof buildDashboardAnalytics>[0][number];

const now = new Date(2026, 6, 15, 12);

function application(
  overrides: Partial<ApplicationInput> = {}
): ApplicationInput {
  return {
    id: 'app-1',
    status: 'APPLIED',
    createdAt: new Date(2026, 6, 10),
    updatedAt: new Date(2026, 6, 10),
    appliedAt: new Date(2026, 6, 10),
    offeredAt: null,
    notes: null,
    job: {
      id: 'job-1',
      title: 'Frontend Developer',
      company: 'Acme',
      source: 'LINKEDIN',
    },
    interviews: [],
    ...overrides,
  };
}

describe('dashboard analytics', () => {
  it('handles an empty application list without division errors', () => {
    const result = buildDashboardAnalytics([], 0, now);

    expect(result.summary.responseRate).toBe(0);
    expect(result.summary.interviewRate).toBe(0);
    expect(result.goal.percentage).toBe(0);
    expect(result.goal.configured).toBe(false);
    expect(result.funnel[0].count).toBe(0);
  });

  it('filters current and previous calendar months', () => {
    const result = buildDashboardAnalytics(
      [
        application({ id: 'current', createdAt: new Date(2026, 6, 3) }),
        application({ id: 'previous', createdAt: new Date(2026, 5, 20) }),
        application({ id: 'older', createdAt: new Date(2026, 4, 20) }),
      ],
      3,
      now
    );

    expect(result.summary.applicationsThisMonth).toBe(1);
    expect(result.summary.previousMonthApplications).toBe(1);
  });

  it('calculates interview rate once per submitted application', () => {
    const result = buildDashboardAnalytics(
      [
        application({
          id: 'interviewed',
          interviews: [
            {
              id: 'i-1',
              type: 'INITIAL',
              status: 'COMPLETED',
              scheduledAt: new Date(2026, 6, 12),
              createdAt: new Date(2026, 6, 11),
            },
            {
              id: 'i-2',
              type: 'TECHNICAL',
              status: 'SCHEDULED',
              scheduledAt: new Date(2026, 6, 18),
              createdAt: new Date(2026, 6, 14),
            },
          ],
        }),
        application({ id: 'applied' }),
        application({ id: 'saved', status: 'SAVED' }),
      ],
      3,
      now
    );

    expect(result.summary.interviewApplications).toBe(1);
    expect(result.summary.submittedApplications).toBe(2);
    expect(result.summary.interviewRate).toBe(50);
  });

  it('finds follow-ups using the configured threshold', () => {
    const result = buildDashboardAnalytics(
      [
        application({
          id: 'old',
          updatedAt: new Date(now.getTime() - 10 * 86_400_000),
        }),
        application({
          id: 'fresh',
          updatedAt: new Date(now.getTime() - 2 * 86_400_000),
        }),
      ],
      2,
      now,
      20,
      7
    );

    expect(result.summary.pendingFollowUps).toBe(1);
    expect(result.summary.oldestWaitingDays).toBe(10);
  });

  it('builds cumulative funnel counts and excludes saved drafts', () => {
    const result = buildDashboardAnalytics(
      [
        application({ id: 'saved', status: 'SAVED' }),
        application({ id: 'applied' }),
        application({ id: 'interview', status: 'INTERVIEW' }),
        application({
          id: 'offer',
          status: 'OFFER',
          offeredAt: new Date(2026, 6, 14),
        }),
      ],
      4,
      now
    );

    expect(result.funnel.map((stage) => stage.count)).toEqual([3, 2, 1, 0]);
    expect(result.funnel[3].supported).toBe(false);
  });

  it('fills all seven activity days including zero-count days', () => {
    const result = buildDashboardAnalytics(
      [application({ createdAt: new Date(2026, 6, 15, 8) })],
      1,
      now
    );

    expect(result.weeklyActivity).toHaveLength(7);
    expect(result.weeklyActivity.reduce((sum, day) => sum + day.count, 0)).toBe(1);
    expect(result.weeklyActivity.some((day) => day.count === 0)).toBe(true);
  });

  it('separates jobs saved from applications submitted in weekly activity', () => {
    const result = buildDashboardAnalytics(
      [application({ createdAt: new Date(2026, 6, 15, 8) })],
      1,
      now,
      null,
      7,
      [new Date(2026, 6, 15, 9)]
    );

    expect(result.weeklyActivity.reduce((sum, day) => sum + day.applications, 0)).toBe(1);
    expect(result.weeklyActivity.reduce((sum, day) => sum + day.jobsSaved, 0)).toBe(1);
  });

  it('builds six months of real application, interview, and offer activity', () => {
    const result = buildDashboardAnalytics(
      [
        application({
          status: 'OFFER',
          offeredAt: new Date(2026, 6, 14),
          interviews: [{
            id: 'i-1',
            type: 'FINAL',
            status: 'COMPLETED',
            scheduledAt: new Date(2026, 6, 13),
            createdAt: new Date(2026, 6, 12),
          }],
        }),
      ],
      1,
      now
    );

    expect(result.applicationActivity).toHaveLength(6);
    expect(result.applicationActivity[result.applicationActivity.length - 1]).toMatchObject({
      applications: 1,
      interviews: 1,
      offers: 1,
    });
  });

  it('does not name a best source from fewer than three applications', () => {
    const result = buildDashboardAnalytics(
      [
        application({
          status: 'INTERVIEW',
          interviews: [{
            id: 'i-1',
            type: 'INITIAL',
            status: 'COMPLETED',
            scheduledAt: new Date(2026, 6, 10),
            createdAt: new Date(2026, 6, 9),
          }],
        }),
      ],
      1,
      now
    );

    expect(result.insights.some((insight) => insight.id === 'source')).toBe(false);
  });

  it('allows a source insight once the minimum sample is reached', () => {
    const apps = Array.from({ length: 3 }, (_, index) =>
      application({
        id: `app-${index}`,
        status: 'INTERVIEW',
        interviews: [{
          id: `i-${index}`,
          type: 'INITIAL',
          status: 'COMPLETED',
          scheduledAt: new Date(2026, 6, 10),
          createdAt: new Date(2026, 6, 9),
        }],
      })
    );
    const result = buildDashboardAnalytics(apps, 3, now);

    expect(result.insights.some((insight) => insight.id === 'source')).toBe(true);
  });
});
