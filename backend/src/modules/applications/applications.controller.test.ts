jest.mock('./applications.service', () => ({
  createApplication: jest.fn(),
  updateApplication: jest.fn(),
}));

import type { Request, Response } from 'express';
import { create, update } from './applications.controller';
import { createApplication, updateApplication } from './applications.service';

const mockedCreateApplication = createApplication as jest.Mock;
const mockedUpdateApplication = updateApplication as jest.Mock;

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
