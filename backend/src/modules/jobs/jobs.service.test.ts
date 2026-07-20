jest.mock('../../config/database', () => ({
  prisma: {
    job: {
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { prisma } from '../../config/database';
import { deleteJob, updateJob } from './jobs.service';

const mockedJob = prisma.job as unknown as {
  findFirst: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
};

describe('updateJob', () => {
  it('updates an existing job owned by the user', async () => {
    const updatedJob = { id: 'job-1', title: 'Senior Developer' };
    mockedJob.findFirst.mockResolvedValue({ id: 'job-1', userId: 'user-1' });
    mockedJob.update.mockResolvedValue(updatedJob);

    await expect(updateJob('job-1', 'user-1', { title: 'Senior Developer', userId: 'user-1' }))
      .resolves.toEqual(updatedJob);

    expect(mockedJob.findFirst).toHaveBeenCalledWith({ where: { id: 'job-1', userId: 'user-1' } });
    expect(mockedJob.update).toHaveBeenCalledWith({
      where: { id: 'job-1' },
      data: { title: 'Senior Developer', userId: 'user-1' },
    });
  });

  it('does not update a job that does not exist for the user', async () => {
    mockedJob.findFirst.mockResolvedValue(null);

    await expect(updateJob('missing-job', 'user-1', { title: 'New title', userId: 'user-1' }))
      .resolves.toBeNull();

    expect(mockedJob.update).not.toHaveBeenCalled();
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
