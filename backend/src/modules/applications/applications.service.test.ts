jest.mock('../../config/database', () => ({
  prisma: {
    application: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock('../jobs/jobs.service', () => ({
  getJobById: jest.fn(),
}));

import { prisma } from '../../config/database';
import { getJobById } from '../jobs/jobs.service';
import {
  createApplication,
  deleteApplication,
  getApplications,
  isFollowUpNeeded,
  updateApplication,
} from './applications.service';

const mockedApplication = prisma.application as unknown as {
  findUnique: jest.Mock;
  findFirst: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  findMany: jest.Mock;
  count: jest.Mock;
};
const mockedGetJobById = getJobById as jest.Mock;

describe('createApplication', () => {
  const input = { jobId: 'job-1', userId: 'user-1', status: 'APPLIED' as const };

  it('creates an application for a job owned by the user', async () => {
    const createdApplication = { id: 'application-1', ...input };
    mockedGetJobById.mockResolvedValue({ id: 'job-1', userId: 'user-1' });
    mockedApplication.findUnique.mockResolvedValue(null);
    mockedApplication.create.mockResolvedValue(createdApplication);

    await expect(createApplication(input)).resolves.toEqual(createdApplication);
    expect(mockedApplication.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          jobId: 'job-1',
          userId: 'user-1',
          status: 'APPLIED',
          appliedAt: expect.any(Date),
        }),
      })
    );
  });

  it('rejects an application for a job the user cannot access', async () => {
    mockedGetJobById.mockResolvedValue(null);

    await expect(createApplication(input)).rejects.toThrow('JOB_NOT_FOUND');
    expect(mockedApplication.create).not.toHaveBeenCalled();
  });

  it('rejects a duplicate application for the same job', async () => {
    mockedGetJobById.mockResolvedValue({ id: 'job-1', userId: 'user-1' });
    mockedApplication.findUnique.mockResolvedValue({ id: 'application-1' });

    await expect(createApplication(input)).rejects.toThrow('APPLICATION_ALREADY_EXISTS');
    expect(mockedApplication.create).not.toHaveBeenCalled();
  });
});

describe('updateApplication', () => {
  it('updates an application owned by the user', async () => {
    const updatedApplication = { id: 'application-1', status: 'INTERVIEW' };
    mockedApplication.findFirst.mockResolvedValue({ id: 'application-1', userId: 'user-1' });
    mockedApplication.update.mockResolvedValue(updatedApplication);

    await expect(updateApplication('application-1', 'user-1', { status: 'INTERVIEW' })).resolves.toEqual(
      updatedApplication
    );
    expect(mockedApplication.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'application-1' },
        data: { status: 'INTERVIEW', notes: undefined, appliedAt: undefined },
      })
    );
  });

  it('does not update an application that does not exist for the user', async () => {
    mockedApplication.findFirst.mockResolvedValue(null);

    await expect(updateApplication('missing-application', 'user-1', { status: 'INTERVIEW' })).resolves.toBeNull();
    expect(mockedApplication.update).not.toHaveBeenCalled();
  });
});

describe('isFollowUpNeeded', () => {
  const now = new Date('2026-07-24T12:00:00.000Z');

  it('recommends follow-up after seven days without activity', () => {
    expect(
      isFollowUpNeeded(
        {
          status: 'APPLIED',
          updatedAt: new Date('2026-07-17T12:00:00.000Z'),
          interviews: [],
        },
        now
      )
    ).toBe(true);
  });

  it('does not recommend follow-up when an interview is upcoming', () => {
    expect(
      isFollowUpNeeded(
        {
          status: 'INTERVIEW',
          updatedAt: new Date('2026-07-10T12:00:00.000Z'),
          interviews: [{ scheduledAt: new Date('2026-07-25T12:00:00.000Z') }],
        },
        now
      )
    ).toBe(false);
  });

  it('does not recommend follow-up for a terminal application', () => {
    expect(
      isFollowUpNeeded(
        {
          status: 'REJECTED',
          updatedAt: new Date('2026-07-10T12:00:00.000Z'),
          interviews: [],
        },
        now
      )
    ).toBe(false);
  });
});

describe('getApplications', () => {
  const baseApplication = {
    id: 'application-1',
    status: 'APPLIED',
    updatedAt: new Date('2026-07-01T00:00:00.000Z'),
    interviews: [],
    job: { id: 'job-1', title: 'Frontend Developer', company: 'Acme' },
  };

  it('applies company, source, and search filters together in the AND clause', async () => {
    mockedApplication.findMany.mockResolvedValueOnce([baseApplication]).mockResolvedValueOnce([]);
    mockedApplication.count.mockResolvedValue(1);

    await getApplications({
      userId: 'user-1',
      company: 'Acme',
      source: 'LINKEDIN',
      search: 'Frontend',
    });

    const mainQuery = mockedApplication.findMany.mock.calls[0][0];
    expect(mainQuery.where.userId).toBe('user-1');
    expect(mainQuery.where.AND).toEqual(
      expect.arrayContaining([
        { job: { company: { contains: 'Acme', mode: 'insensitive' } } },
        { job: { source: 'LINKEDIN' } },
        {
          job: {
            OR: [
              { title: { contains: 'Frontend', mode: 'insensitive' } },
              { company: { contains: 'Frontend', mode: 'insensitive' } },
            ],
          },
        },
      ])
    );
  });

  it('filters for stale active applications without upcoming interviews when followUpNeeded is set', async () => {
    mockedApplication.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([]);
    mockedApplication.count.mockResolvedValue(0);
    const now = new Date('2026-07-24T12:00:00.000Z');
    jest.useFakeTimers().setSystemTime(now);

    await getApplications({ userId: 'user-1', followUpNeeded: true });

    const mainQuery = mockedApplication.findMany.mock.calls[0][0];
    expect(mainQuery.where.updatedAt).toEqual({
      lte: new Date(now.getTime() - 7 * 86_400_000),
    });
    expect(mainQuery.where.interviews).toEqual({
      none: { scheduledAt: { gte: now }, status: { in: ['SCHEDULED', 'RESCHEDULED'] } },
    });
    expect(mainQuery.where.AND).toEqual(
      expect.arrayContaining([{ status: { in: ['SAVED', 'APPLIED', 'INTERVIEW'] } }])
    );

    jest.useRealTimers();
  });

  it('annotates each application with followUpNeeded and returns pagination', async () => {
    const stale = {
      ...baseApplication,
      id: 'application-stale',
      updatedAt: new Date('2026-07-01T00:00:00.000Z'),
    };
    const fresh = {
      ...baseApplication,
      id: 'application-fresh',
      updatedAt: new Date('2026-07-23T00:00:00.000Z'),
    };
    jest.useFakeTimers().setSystemTime(new Date('2026-07-24T12:00:00.000Z'));
    mockedApplication.findMany.mockResolvedValueOnce([stale, fresh]).mockResolvedValueOnce([]);
    mockedApplication.count.mockResolvedValue(2);

    const result = await getApplications({ userId: 'user-1', page: 2, limit: 5 });

    expect(result.applications).toEqual([
      { ...stale, followUpNeeded: true },
      { ...fresh, followUpNeeded: false },
    ]);
    expect(result.pagination).toEqual({ page: 2, limit: 5, total: 2, totalPages: 1 });
    expect(mockedApplication.findMany.mock.calls[0][0].skip).toBe(5);
    expect(mockedApplication.findMany.mock.calls[0][0].take).toBe(5);

    jest.useRealTimers();
  });

  it('computes summary counts for active, follow-up, upcoming interview, and offer applications', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-24T12:00:00.000Z'));
    const summarySource = [
      { status: 'APPLIED', updatedAt: new Date('2026-07-01T00:00:00.000Z'), interviews: [] },
      {
        status: 'INTERVIEW',
        updatedAt: new Date('2026-07-20T00:00:00.000Z'),
        interviews: [{ scheduledAt: new Date('2026-07-30T00:00:00.000Z') }],
      },
      { status: 'OFFER', updatedAt: new Date('2026-07-05T00:00:00.000Z'), interviews: [] },
      { status: 'REJECTED', updatedAt: new Date('2026-06-01T00:00:00.000Z'), interviews: [] },
    ];
    mockedApplication.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce(summarySource);
    mockedApplication.count.mockResolvedValue(0);

    const result = await getApplications({ userId: 'user-1' });

    expect(result.summary).toEqual({
      active: 2, // APPLIED + INTERVIEW
      needsFollowUp: 1, // stale APPLIED without upcoming interview
      upcomingInterviews: 1,
      offers: 1,
    });

    jest.useRealTimers();
  });
});

describe('deleteApplication', () => {
  it('deletes an application owned by the user', async () => {
    mockedApplication.findFirst.mockResolvedValue({ id: 'application-1', userId: 'user-1' });
    mockedApplication.delete.mockResolvedValue({ id: 'application-1' });

    await expect(deleteApplication('application-1', 'user-1')).resolves.toBe(true);
    expect(mockedApplication.delete).toHaveBeenCalledWith({ where: { id: 'application-1' } });
  });

  it('does not delete an application that does not exist for the user', async () => {
    mockedApplication.findFirst.mockResolvedValue(null);

    await expect(deleteApplication('missing-application', 'user-1')).resolves.toBeNull();
    expect(mockedApplication.delete).not.toHaveBeenCalled();
  });
});
