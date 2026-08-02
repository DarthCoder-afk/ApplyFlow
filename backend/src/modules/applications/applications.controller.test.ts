jest.mock('./applications.service', () => ({
  createApplication: jest.fn(),
  updateApplication: jest.fn(),
  getApplications: jest.fn(),
}));

import type { Request, Response } from 'express';
import { create, listApplications, update } from './applications.controller';
import { createApplication, getApplications, updateApplication } from './applications.service';

const mockedCreateApplication = createApplication as jest.Mock;
const mockedUpdateApplication = updateApplication as jest.Mock;
const mockedGetApplications = getApplications as jest.Mock;

function createResponseMock() {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };

  response.status.mockReturnValue(response);
  return response as unknown as Response;
}

describe('create application controller', () => {
  it('returns 401 when the user is not authenticated', async () => {
    const req = { body: {} } as unknown as Request;
    const res = createResponseMock();

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(mockedCreateApplication).not.toHaveBeenCalled();
  });

  it('returns 404 when the job does not exist for the user', async () => {
    mockedCreateApplication.mockRejectedValue(new Error('JOB_NOT_FOUND'));
    const req = {
      userId: 'user-1',
      body: { jobId: 'missing-job', status: 'APPLIED' },
    } as unknown as Request;
    const res = createResponseMock();

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Job not found' });
  });

  it('returns 409 when an application already exists for the job', async () => {
    mockedCreateApplication.mockRejectedValue(new Error('APPLICATION_ALREADY_EXISTS'));
    const req = {
      userId: 'user-1',
      body: { jobId: 'job-1', status: 'APPLIED' },
    } as unknown as Request;
    const res = createResponseMock();

    await create(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Application already exists for this job' });
  });

  it('creates an application and returns 201', async () => {
    const application = { id: 'application-1', jobId: 'job-1', status: 'APPLIED' };
    mockedCreateApplication.mockResolvedValue(application);
    const req = {
      userId: 'user-1',
      body: { jobId: 'job-1', status: 'APPLIED', notes: 'Submitted my resume.' },
    } as unknown as Request;
    const res = createResponseMock();

    await create(req, res);

    expect(mockedCreateApplication).toHaveBeenCalledWith({
      jobId: 'job-1',
      userId: 'user-1',
      status: 'APPLIED',
      appliedAt: undefined,
      notes: 'Submitted my resume.',
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Application created successfully',
      application,
    });
  });
});

describe('list applications controller', () => {
  it('returns 401 when the user is not authenticated', async () => {
    const req = { validatedQuery: {} } as unknown as Request;
    const res = createResponseMock();

    await listApplications(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(mockedGetApplications).not.toHaveBeenCalled();
  });

  it('forwards company, source, and follow-up filters to the service', async () => {
    const result = {
      applications: [],
      summary: { active: 0, needsFollowUp: 0, upcomingInterviews: 0, offers: 0 },
      pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    };
    mockedGetApplications.mockResolvedValue(result);
    const req = {
      userId: 'user-1',
      validatedQuery: {
        status: 'APPLIED',
        company: 'Acme',
        source: 'LINKEDIN',
        followUpNeeded: true,
        page: 1,
        limit: 10,
        sort: 'createdAt',
        order: 'desc',
      },
    } as unknown as Request;
    const res = createResponseMock();

    await listApplications(req, res);

    expect(mockedGetApplications).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        status: 'APPLIED',
        company: 'Acme',
        source: 'LINKEDIN',
        followUpNeeded: true,
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      count: 0,
      applications: result.applications,
      pagination: result.pagination,
    });
  });

  it('returns 500 when the service throws an unexpected error', async () => {
    mockedGetApplications.mockRejectedValue(new Error('boom'));
    const req = {
      userId: 'user-1',
      validatedQuery: {},
    } as unknown as Request;
    const res = createResponseMock();

    await listApplications(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
  });
});

describe('update application controller', () => {
  it('returns 401 when the user is not authenticated', async () => {
    const req = { params: { id: 'application-1' }, body: {} } as unknown as Request;
    const res = createResponseMock();

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    expect(mockedUpdateApplication).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid status', async () => {
    const req = {
      userId: 'user-1',
      params: { id: 'application-1' },
      body: { status: 'PENDING' },
    } as unknown as Request;
    const res = createResponseMock();

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Invalid status' })
    );
    expect(mockedUpdateApplication).not.toHaveBeenCalled();
  });

  it('returns 404 when the application does not exist for the user', async () => {
    mockedUpdateApplication.mockResolvedValue(null);
    const req = {
      userId: 'user-1',
      params: { id: 'missing-application' },
      body: { status: 'INTERVIEW' },
    } as unknown as Request;
    const res = createResponseMock();

    await update(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Application not found' });
  });

  it('updates an application and returns 200', async () => {
    const application = { id: 'application-1', status: 'INTERVIEW' };
    mockedUpdateApplication.mockResolvedValue(application);
    const req = {
      userId: 'user-1',
      params: { id: 'application-1' },
      body: { status: 'INTERVIEW', notes: 'Interview scheduled.' },
    } as unknown as Request;
    const res = createResponseMock();

    await update(req, res);

    expect(mockedUpdateApplication).toHaveBeenCalledWith('application-1', 'user-1', {
      status: 'INTERVIEW',
      appliedAt: undefined,
      notes: 'Interview scheduled.',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Application updated successfully',
      application,
    });
  });
});
