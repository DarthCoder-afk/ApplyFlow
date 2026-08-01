jest.mock('../../config/database', () => ({
  prisma: {
    job: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { prisma } from '../../config/database';
import {
  deleteJob,
  getJobsSummary,
  isPossibleDuplicate,
  normalizeJobTitle,
  normalizeJobUrl,
  updateJob,
} from './jobs.service';

const mockedJob = prisma.job as unknown as {
  findFirst: jest.Mock;
  findMany: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
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

  it('clears an existing job URL', async () => {
    mockedJob.findFirst.mockResolvedValue({
      id: 'job-1',
      userId: 'user-1',
      title: 'Developer',
      company: 'Acme',
      jobUrl: 'https://example.com/job',
    });
    mockedJob.findMany.mockResolvedValue([]);
    mockedJob.update.mockResolvedValue({ id: 'job-1', jobUrl: null });

    await updateJob('job-1', 'user-1', { jobUrl: null, userId: 'user-1' });

    expect(mockedJob.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ jobUrl: null }),
      })
    );
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
