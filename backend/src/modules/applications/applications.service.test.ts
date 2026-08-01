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
  isFollowUpNeeded,
  updateApplication,
} from './applications.service';

const mockedApplication = prisma.application as unknown as {
  findUnique: jest.Mock;
  findFirst: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
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

  it('updates the date applied', async () => {
    const appliedAt = '2026-07-01T12:00:00.000Z';
    mockedApplication.findFirst.mockResolvedValue({ id: 'application-1', userId: 'user-1' });
    mockedApplication.update.mockResolvedValue({ id: 'application-1', appliedAt });

    await updateApplication('application-1', 'user-1', { appliedAt });

    expect(mockedApplication.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ appliedAt: new Date(appliedAt) }),
      })
    );
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
