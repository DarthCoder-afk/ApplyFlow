import {
  getAppliedAgeLabel,
  getInterviewTimeLabel,
  getUpcomingInterview,
} from './application-pipeline';
import type { Interview } from './types/interview';

function interview(overrides: Partial<Interview> = {}): Interview {
  return {
    id: 'interview-1',
    type: 'INITIAL',
    status: 'SCHEDULED',
    scheduledAt: '2026-07-25T09:00:00.000Z',
    completedAt: null,
    location: null,
    meetingUrl: null,
    interviewer: null,
    notes: null,
    applicationId: 'application-1',
    createdAt: '2026-07-20T00:00:00.000Z',
    updatedAt: '2026-07-20T00:00:00.000Z',
    ...overrides,
  };
}

describe('getAppliedAgeLabel', () => {
  const now = new Date('2026-07-24T12:00:00.000Z');

  it('reports "Applied today" when applied within the current day', () => {
    expect(
      getAppliedAgeLabel({ appliedAt: '2026-07-24T08:00:00.000Z', createdAt: '2026-07-24T08:00:00.000Z' }, now)
    ).toBe('Applied today');
  });

  it('reports "Applied yesterday" for a single day difference', () => {
    expect(
      getAppliedAgeLabel({ appliedAt: '2026-07-23T08:00:00.000Z', createdAt: '2026-07-23T08:00:00.000Z' }, now)
    ).toBe('Applied yesterday');
  });

  it('reports the number of days for older applications', () => {
    expect(
      getAppliedAgeLabel({ appliedAt: '2026-07-17T08:00:00.000Z', createdAt: '2026-07-17T08:00:00.000Z' }, now)
    ).toBe('Applied 7 days ago');
  });

  it('falls back to createdAt when appliedAt is missing', () => {
    expect(
      getAppliedAgeLabel({ appliedAt: null, createdAt: '2026-07-22T08:00:00.000Z' }, now)
    ).toBe('Applied 2 days ago');
  });

  it('never returns a negative day count for future dates', () => {
    expect(
      getAppliedAgeLabel({ appliedAt: '2026-07-30T08:00:00.000Z', createdAt: '2026-07-30T08:00:00.000Z' }, now)
    ).toBe('Applied today');
  });
});

describe('getUpcomingInterview', () => {
  it('returns the first interview in the list', () => {
    const first = interview({ id: 'first' });
    const second = interview({ id: 'second' });

    expect(getUpcomingInterview({ interviews: [first, second] })).toEqual(first);
  });

  it('returns null when there are no interviews', () => {
    expect(getUpcomingInterview({ interviews: [] })).toBeNull();
  });

  it('returns null when interviews is undefined', () => {
    expect(getUpcomingInterview({ interviews: undefined })).toBeNull();
  });
});

describe('getInterviewTimeLabel', () => {
  const now = new Date('2026-07-24T08:00:00.000Z');

  it('labels an interview scheduled at or before the current time as today', () => {
    const label = getInterviewTimeLabel(
      interview({ scheduledAt: now.toISOString() }),
      now
    );

    expect(label).toMatch(/^Interview today at /);
  });

  it('labels an interview within the next 24 hours as tomorrow', () => {
    const label = getInterviewTimeLabel(
      interview({ scheduledAt: '2026-07-25T04:00:00.000Z' }), // +20 hours
      now
    );

    expect(label).toMatch(/^Interview tomorrow at /);
  });

  it('labels an interview scheduled multiple days out', () => {
    const label = getInterviewTimeLabel(
      interview({ scheduledAt: '2026-07-27T20:00:00.000Z' }), // +3.5 days
      now
    );

    expect(label).toBe('Interview in 4 days');
  });

  it('treats a past-due interview as due today', () => {
    const label = getInterviewTimeLabel(
      interview({ scheduledAt: '2026-07-20T09:00:00.000Z' }),
      now
    );

    expect(label).toMatch(/^Interview today at /);
  });
});