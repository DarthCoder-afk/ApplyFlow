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
import { createApplication, deleteApplication, updateApplication } from './applications.service';

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
