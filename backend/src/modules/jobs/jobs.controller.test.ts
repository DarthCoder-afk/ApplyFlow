jest.mock('./jobs.service', () => ({
  createJob: jest.fn(),
  getJobsByUser: jest.fn(),
  getJobById: jest.fn(),
  updateJob: jest.fn(),
  deleteJob: jest.fn(),
}));

import type { Request, Response } from 'express';
import { create, getAll, getOne, remove, update } from './jobs.controller';
import { createJob, deleteJob, getJobById, getJobsByUser, updateJob } from './jobs.service';

const mockedCreateJob = createJob as jest.Mock;
const mockedGetJobsByUser = getJobsByUser as jest.Mock;
const mockedGetJobById = getJobById as jest.Mock;
const mockedUpdateJob = updateJob as jest.Mock;
const mockedDeleteJob = deleteJob as jest.Mock;

function createResponseMock() {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };

  response.status.mockReturnValue(response);
  return response as unknown as Response;
}

describe('create job controller', () => {
  it('returns 401 when the user is not authenticated', async () => {
    const req = { body: {} } as unknown as Request;
    const res = createResponseMock();

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockedCreateJob).not.toHaveBeenCalled();
  });

  it('creates a job and returns 201', async () => {
    const job = { id: 'job-1', title: 'Frontend Developer' };
    mockedCreateJob.mockResolvedValue(job);
    const req = {
      userId: 'user-1',
      body: {
        title: 'Frontend Developer',
        company: 'Example Inc.',
        location: 'Manila',
        url: 'https://example.com/job',
        description: 'Build web applications.',
        source: 'LINKEDIN',
      },
    } as unknown as Request;
    const res = createResponseMock();

    await create(req, res);

    expect(mockedCreateJob).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'user-1', jobUrl: 'https://example.com/job' })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'Job created successfully', job });
  });
});

describe('list jobs controller', () => {
  it('returns 401 when the user is not authenticated', async () => {
    const req = { validatedQuery: {} } as unknown as Request;
    const res = createResponseMock();

    await getAll(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(mockedGetJobsByUser).not.toHaveBeenCalled();
  });

  it('returns jobs and pagination information', async () => {
    const jobs = [{ id: 'job-1', title: 'Frontend Developer' }];
    const pagination = { page: 1, limit: 10, total: 1, totalPages: 1 };
    mockedGetJobsByUser.mockResolvedValue({ jobs, pagination });
    const req = {
      userId: 'user-1',
      validatedQuery: { page: 1, limit: 10, sort: 'createdAt', order: 'desc' },
    } as unknown as Request;
    const res = createResponseMock();

    await getAll(req, res);

    expect(mockedGetJobsByUser).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-1' }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ count: 1, jobs, pagination });
  });
});

describe('get job controller', () => {
  it('returns 404 when the job does not exist for the user', async () => {
    mockedGetJobById.mockResolvedValue(null);
    const req = { userId: 'user-1', params: { id: 'missing-job' } } as unknown as Request;
    const res = createResponseMock();

    await getOne(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Job not found' });
  });

  it('returns the requested job', async () => {
    const job = { id: 'job-1', title: 'Frontend Developer' };
    mockedGetJobById.mockResolvedValue(job);
    const req = { userId: 'user-1', params: { id: 'job-1' } } as unknown as Request;
    const res = createResponseMock();

    await getOne(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ job });
  });
});

describe('update job controller', () => {
  it('returns 400 for an invalid source', async () => {
    const req = {
      userId: 'user-1',
      params: { id: 'job-1' },
      body: { source: 'FACEBOOK' },
    } as unknown as Request;
    const res = createResponseMock();

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Invalid source' }));
    expect(mockedUpdateJob).not.toHaveBeenCalled();
  });

  it('returns 404 when the job does not exist for the user', async () => {
    mockedUpdateJob.mockResolvedValue(null);
    const req = {
      userId: 'user-1',
      params: { id: 'missing-job' },
      body: { title: 'Updated title' },
    } as unknown as Request;
    const res = createResponseMock();

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Job not found' });
  });

  it('updates a job and returns 200', async () => {
    const job = { id: 'job-1', title: 'Senior Developer' };
    mockedUpdateJob.mockResolvedValue(job);
    const req = {
      userId: 'user-1',
      params: { id: 'job-1' },
      body: { title: 'Senior Developer' },
    } as unknown as Request;
    const res = createResponseMock();

    await update(req, res);

    expect(mockedUpdateJob).toHaveBeenCalledWith(
      'job-1',
      'user-1',
      expect.objectContaining({ title: 'Senior Developer', userId: 'user-1' })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Job updated successfully', job });
  });
});

describe('delete job controller', () => {
  it('returns 404 when the job does not exist for the user', async () => {
    mockedDeleteJob.mockResolvedValue(null);
    const req = { userId: 'user-1', params: { id: 'missing-job' } } as unknown as Request;
    const res = createResponseMock();

    await remove(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Job not found' });
  });

  it('deletes a job and returns 200', async () => {
    mockedDeleteJob.mockResolvedValue(true);
    const req = { userId: 'user-1', params: { id: 'job-1' } } as unknown as Request;
    const res = createResponseMock();

    await remove(req, res);

    expect(mockedDeleteJob).toHaveBeenCalledWith('job-1', 'user-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Job deleted successfully' });
  });
});
