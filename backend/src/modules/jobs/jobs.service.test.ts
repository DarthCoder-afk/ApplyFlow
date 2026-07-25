jest.mock('../../config/database', () => ({
  prisma: {
    job: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import { prisma } from '../../config/database';
import {
  createJob,
  deleteJob,
  getJobsByUser,
  getJobsSummary,
  isPossibleDuplicate,
  normalizeJobTitle,
  normalizeJobUrl,
  updateJob,
} from './jobs.service';

const mockedJob = prisma.job as unknown as {
  findFirst: jest.Mock;
  findMany: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  count: jest.Mock;
};

describe('updateJob', () => {
  it('updates an existing job owned by the user', async () => {
    const updatedJob = { id: 'job-1', title: 'Senior Developer' };
    mockedJob.findFirst.mockResolvedValue({
      id: 'job-1',
      userId: 'user-1',
      title: 'Developer',
      company: 'Acme',
      jobUrl: null,
    });
    mockedJob.findMany.mockResolvedValue([]);
    mockedJob.update.mockResolvedValue(updatedJob);

    await expect(updateJob('job-1', 'user-1', { title: 'Senior Developer', userId: 'user-1' }))
      .resolves.toEqual(updatedJob);

    expect(mockedJob.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'job-1', userId: 'user-1' } })
    );
    expect(mockedJob.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'job-1' },
        data: expect.objectContaining({ title: 'Senior Developer' }),
      })
    );
  });

  it('does not update a job that does not exist for the user', async () => {
    mockedJob.findFirst.mockResolvedValue(null);

    await expect(updateJob('missing-job', 'user-1', { title: 'New title', userId: 'user-1' }))
      .resolves.toBeNull();

    expect(mockedJob.update).not.toHaveBeenCalled();
  });
});

describe('createJob', () => {
  const input = {
    title: 'Frontend Developer',
    company: 'Acme',
    jobUrl: 'https://example.com/job/1',
    deadline: '2026-08-01',
    userId: 'user-1',
  };

  it('creates a job with a normalized deadline when no duplicate exists', async () => {
    mockedJob.findMany.mockResolvedValue([]);
    const createdJob = { id: 'job-1', ...input };
    mockedJob.create.mockResolvedValue(createdJob);

    await expect(createJob(input)).resolves.toEqual(createdJob);

    expect(mockedJob.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      select: { title: true, company: true, jobUrl: true },
    });
    expect(mockedJob.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        title: 'Frontend Developer',
        company: 'Acme',
        jobUrl: 'https://example.com/job/1',
        deadline: new Date('2026-08-01'),
      }),
    });
    expect(mockedJob.create.mock.calls[0][0].data.allowDuplicate).toBeUndefined();
  });

  it('rejects creation when a matching job already exists for the user', async () => {
    mockedJob.findMany.mockResolvedValue([
      { title: 'Frontend Developer', company: 'Acme', jobUrl: null },
    ]);

    await expect(createJob(input)).rejects.toThrow('POSSIBLE_DUPLICATE');
    expect(mockedJob.create).not.toHaveBeenCalled();
  });

  it('skips the duplicate check when allowDuplicate is true', async () => {
    const createdJob = { id: 'job-1', ...input };
    mockedJob.create.mockResolvedValue(createdJob);

    await expect(createJob({ ...input, allowDuplicate: true })).resolves.toEqual(createdJob);

    expect(mockedJob.findMany).not.toHaveBeenCalled();
    expect(mockedJob.create).toHaveBeenCalled();
  });

  it('stores a null deadline when none is provided', async () => {
    mockedJob.findMany.mockResolvedValue([]);
    mockedJob.create.mockResolvedValue({ id: 'job-1' });

    await createJob({ ...input, deadline: undefined });

    expect(mockedJob.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ deadline: null }) })
    );
  });
});

describe('updateJob duplicate detection', () => {
  it('rejects an update that would duplicate another job owned by the user', async () => {
    mockedJob.findFirst.mockResolvedValue({
      id: 'job-1',
      userId: 'user-1',
      title: 'Frontend Developer',
      company: 'Acme',
      jobUrl: null,
    });
    mockedJob.findMany.mockResolvedValue([
      { title: 'Senior Frontend Developer', company: 'acme', jobUrl: null },
    ]);

    await expect(
      updateJob('job-1', 'user-1', { title: 'Senior Frontend Developer', userId: 'user-1' })
    ).rejects.toThrow('POSSIBLE_DUPLICATE');

    expect(mockedJob.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1', id: { not: 'job-1' } },
      select: { title: true, company: true, jobUrl: true },
    });
    expect(mockedJob.update).not.toHaveBeenCalled();
  });
});

describe('getJobsByUser', () => {
  function mockJobsQuery(mainJobs: unknown[], summaryJobs: unknown[], total: number) {
    mockedJob.findMany.mockResolvedValueOnce(mainJobs).mockResolvedValueOnce(summaryJobs);
    mockedJob.count.mockResolvedValue(total);
  }

  it('builds priority, hasApplication, closingSoon, and location filters', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-24T00:00:00.000Z'));
    mockJobsQuery([], [], 0);

    await getJobsByUser({
      userId: 'user-1',
      priority: 'HIGH',
      hasApplication: true,
      closingSoon: true,
      location: 'Manila',
    });

    const mainQuery = mockedJob.findMany.mock.calls[0][0];
    expect(mainQuery.where).toEqual(
      expect.objectContaining({
        userId: 'user-1',
        priority: 'HIGH',
        applications: { some: { userId: 'user-1' } },
        location: { contains: 'Manila', mode: 'insensitive' },
        deadline: { gte: new Date('2026-07-24T00:00:00.000Z'), lte: new Date(Date.now() + 7 * 86_400_000) },
      })
    );

    jest.useRealTimers();
  });

  it('excludes jobs with an application when hasApplication is false', async () => {
    mockJobsQuery([], [], 0);

    await getJobsByUser({ userId: 'user-1', hasApplication: false });

    expect(mockedJob.findMany.mock.calls[0][0].where.applications).toEqual({
      none: { userId: 'user-1' },
    });
  });

  it('matches a search term against a known job source', async () => {
    mockJobsQuery([], [], 0);

    await getJobsByUser({ userId: 'user-1', search: 'linkedin' });

    const mainQuery = mockedJob.findMany.mock.calls[0][0];
    expect(mainQuery.where.OR).toEqual(
      expect.arrayContaining([{ source: 'LINKEDIN' }])
    );
  });

  it('sorts by deadline with nulls last regardless of the requested order', async () => {
    mockJobsQuery([], [], 0);

    await getJobsByUser({ userId: 'user-1', sort: 'deadline', order: 'desc' });

    expect(mockedJob.findMany.mock.calls[0][0].orderBy).toEqual({
      deadline: { sort: 'asc', nulls: 'last' },
    });
  });

  it('flags possible duplicates and returns a summary computed from all user jobs', async () => {
    const jobA = { id: 'job-a', title: 'Frontend Developer', company: 'Acme', jobUrl: null, priority: 'HIGH', deadline: null, applications: [] };
    const jobB = { id: 'job-b', title: 'Frontend-Developer', company: 'acme', jobUrl: null, priority: 'NONE', deadline: null, applications: [] };
    mockJobsQuery([jobA], [jobA, jobB], 1);

    const result = await getJobsByUser({ userId: 'user-1' });

    expect(result.jobs).toEqual([{ ...jobA, possibleDuplicate: true }]);
    expect(result.summary).toEqual({
      all: 2,
      highPriority: 1,
      hasApplication: 0,
      closingSoon: 0,
    });
    expect(result.pagination).toEqual({ page: 1, limit: 10, total: 1, totalPages: 1 });
  });

  it('applies pagination skip based on the requested page', async () => {
    mockJobsQuery([], [], 0);

    await getJobsByUser({ userId: 'user-1', page: 3, limit: 5 });

    expect(mockedJob.findMany.mock.calls[0][0].skip).toBe(10);
    expect(mockedJob.findMany.mock.calls[0][0].take).toBe(5);
  });
});

describe('job opportunity summary', () => {
  const now = new Date('2026-07-24T00:00:00.000Z');
  const base = {
    priority: 'NONE' as const,
    deadline: null,
    applications: [] as Array<{ id: string }>,
  };

  it('counts all, high-priority, linked, and closing jobs', () => {
    const summary = getJobsSummary(
      [
        { ...base, priority: 'HIGH', deadline: new Date('2026-07-31T00:00:00.000Z') },
        { ...base, applications: [{ id: 'app-1' }] },
        { ...base },
      ],
      now
    );

    expect(summary).toMatchObject({
      all: 3,
      highPriority: 1,
      hasApplication: 1,
      closingSoon: 1,
    });
  });

  it('includes the seven-day closing boundary but excludes past deadlines', () => {
    const summary = getJobsSummary(
      [
        { ...base, deadline: new Date('2026-07-31T00:00:00.000Z') },
        { ...base, deadline: new Date('2026-07-23T23:59:59.000Z') },
      ],
      now
    );
    expect(summary.closingSoon).toBe(1);
  });
});

describe('duplicate detection', () => {
  it('normalizes tracking parameters and URL formatting', () => {
    expect(normalizeJobUrl('https://www.example.com/jobs/1/?utm_source=linkedin#apply')).toBe(
      'https://example.com/jobs/1'
    );
  });

  it('normalizes punctuation and spacing in titles', () => {
    expect(normalizeJobTitle('  Senior Front-End Developer! ')).toBe(
      'senior front end developer'
    );
  });

  it('detects duplicate normalized URLs', () => {
    expect(
      isPossibleDuplicate(
        { title: 'A', company: 'One', jobUrl: 'https://example.com/job/1?utm_source=x' },
        { title: 'B', company: 'Two', jobUrl: 'https://www.example.com/job/1' }
      )
    ).toBe(true);
  });

  it('detects duplicate normalized company and title', () => {
    expect(
      isPossibleDuplicate(
        { title: 'Frontend Developer', company: 'Acme', jobUrl: null },
        { title: 'Frontend-Developer', company: 'acme', jobUrl: null }
      )
    ).toBe(true);
  });
});

describe('deleteJob', () => {
  it('deletes an existing job owned by the user', async () => {
    mockedJob.findFirst.mockResolvedValue({ id: 'job-1', userId: 'user-1' });
    mockedJob.delete.mockResolvedValue({ id: 'job-1' });

    await expect(deleteJob('job-1', 'user-1')).resolves.toBe(true);

    expect(mockedJob.delete).toHaveBeenCalledWith({ where: { id: 'job-1' } });
  });

  it('does not delete a job that does not exist for the user', async () => {
    mockedJob.findFirst.mockResolvedValue(null);

    await expect(deleteJob('missing-job', 'user-1')).resolves.toBeNull();

    expect(mockedJob.delete).not.toHaveBeenCalled();
  });
});
