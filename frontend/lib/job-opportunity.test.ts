import {
  buildApplicationPayloadFromJob,
  buildJobsSummaryText,
  getDeadlineState,
  getJobAge,
  getJobAgeLabel,
  isJobStale,
} from './job-opportunity';

describe('getJobAge', () => {
  const now = new Date('2026-07-24T12:00:00.000Z');

  it('returns 0 for a job created today', () => {
    expect(getJobAge('2026-07-24T08:00:00.000Z', now)).toBe(0);
  });

  it('returns the number of whole days since creation', () => {
    expect(getJobAge('2026-07-17T12:00:00.000Z', now)).toBe(7);
  });

  it('never returns a negative age for future creation dates', () => {
    expect(getJobAge('2026-07-30T12:00:00.000Z', now)).toBe(0);
  });
});

describe('getJobAgeLabel', () => {
  const now = new Date('2026-07-24T12:00:00.000Z');

  it('labels a job created today', () => {
    expect(getJobAgeLabel('2026-07-24T08:00:00.000Z', now)).toBe('Saved today');
  });

  it('labels a job created yesterday', () => {
    expect(getJobAgeLabel('2026-07-23T12:00:00.000Z', now)).toBe('Saved yesterday');
  });

  it('labels a job created within the last two weeks in days', () => {
    expect(getJobAgeLabel('2026-07-17T12:00:00.000Z', now)).toBe('Saved 7 days ago');
  });

  it('labels a job created two or more weeks ago in weeks', () => {
    expect(getJobAgeLabel('2026-07-03T12:00:00.000Z', now)).toBe('Saved 3 weeks ago');
  });
});

describe('isJobStale', () => {
  const now = new Date('2026-07-24T12:00:00.000Z');

  it('is stale when older than the threshold and has no deadline', () => {
    expect(isJobStale({ createdAt: '2026-07-10T12:00:00.000Z', deadline: null }, now)).toBe(true);
  });

  it('is not stale when it has a deadline, regardless of age', () => {
    expect(
      isJobStale({ createdAt: '2026-07-10T12:00:00.000Z', deadline: '2026-08-01' }, now)
    ).toBe(false);
  });

  it('is not stale when younger than the threshold', () => {
    expect(isJobStale({ createdAt: '2026-07-20T12:00:00.000Z', deadline: null }, now)).toBe(false);
  });

  it('is stale exactly at the threshold boundary', () => {
    expect(isJobStale({ createdAt: '2026-07-10T12:00:00.000Z', deadline: null }, now)).toBe(true);
    // 14 days exactly
    expect(getJobAge('2026-07-10T12:00:00.000Z', now)).toBe(14);
  });
});

describe('getDeadlineState', () => {
  const now = new Date('2026-07-24T12:00:00.000Z');

  it('returns null when there is no deadline', () => {
    expect(getDeadlineState(null, now)).toBeNull();
  });

  it('labels a deadline of today', () => {
    const state = getDeadlineState('2026-07-24', now);
    expect(state).toEqual({ days: 0, label: 'Closes today', closed: false, closingSoon: true });
  });

  it('labels a future deadline within seven days as closing soon', () => {
    const state = getDeadlineState('2026-07-29', now);
    expect(state).toEqual({ days: 5, label: 'Closes in 5 days', closed: false, closingSoon: true });
  });

  it('labels a future deadline beyond seven days as not closing soon', () => {
    const state = getDeadlineState('2026-08-10', now);
    expect(state).toEqual({ days: 17, label: 'Closes in 17 days', closed: false, closingSoon: false });
  });

  it('labels a past deadline as closed', () => {
    const state = getDeadlineState('2026-07-20', now);
    expect(state).toEqual({ days: -4, label: 'Closed 4 days ago', closed: true, closingSoon: false });
  });
});

describe('buildApplicationPayloadFromJob', () => {
  it('builds an APPLIED payload referencing the job id', () => {
    expect(buildApplicationPayloadFromJob({ id: 'job-1' })).toEqual({
      jobId: 'job-1',
      status: 'APPLIED',
    });
  });
});

describe('buildJobsSummaryText', () => {
  it('uses singular wording for exactly one opportunity', () => {
    expect(buildJobsSummaryText({ all: 1 })).toBe('1 saved opportunity');
  });

  it('uses plural wording for zero opportunities', () => {
    expect(buildJobsSummaryText({ all: 0 })).toBe('0 saved opportunities');
  });

  it('uses plural wording for multiple opportunities', () => {
    expect(buildJobsSummaryText({ all: 5 })).toBe('5 saved opportunities');
  });
});