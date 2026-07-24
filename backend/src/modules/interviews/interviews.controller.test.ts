jest.mock('./interviews.service', () => ({
    createInterview: jest.fn(),
    deleteInterview: jest.fn(),
    getInterviewById: jest.fn(),
    getInterviews: jest.fn(),
    updateInterview: jest.fn(),
  }));
  
  import type { Request, Response } from 'express';
  import {
    create,
    getOne,
    list,
    remove,
    update,
  } from './interviews.controller';
  import {
    createInterview,
    deleteInterview,
    getInterviewById,
    getInterviews,
    updateInterview,
  } from './interviews.service';
  
  const mockedCreateInterview = createInterview as jest.Mock;
  const mockedDeleteInterview = deleteInterview as jest.Mock;
  const mockedGetInterviewById = getInterviewById as jest.Mock;
  const mockedGetInterviews = getInterviews as jest.Mock;
  const mockedUpdateInterview = updateInterview as jest.Mock;
  
  function createResponseMock() {
    const response = {
      status: jest.fn(),
      json: jest.fn(),
    };
  
    response.status.mockReturnValue(response);
  
    return response as unknown as Response;
  }
  
  describe('interview controller', () => {
    it('returns 401 when creating without authentication', async () => {
      const req = {
        params: { applicationId: 'application-1' },
        body: {},
      } as unknown as Request;
  
      const res = createResponseMock();
  
      await create(req, res);
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized',
      });
      expect(mockedCreateInterview).not.toHaveBeenCalled();
    });
  
    it('returns 404 when creating for a missing application', async () => {
      mockedCreateInterview.mockRejectedValue(
        new Error('APPLICATION_NOT_FOUND')
      );
  
      const req = {
        userId: 'user-1',
        params: { applicationId: 'missing-application' },
        body: {
          type: 'INITIAL',
          scheduledAt: '2026-08-01T02:00:00.000Z',
        },
      } as unknown as Request;
  
      const res = createResponseMock();
  
      await create(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Application not found',
      });
    });
  
    it('creates an interview and returns 201', async () => {
      const interview = {
        id: 'interview-1',
        applicationId: 'application-1',
        type: 'INITIAL',
        status: 'SCHEDULED',
        scheduledAt: new Date('2026-08-01T02:00:00.000Z'),
      };
  
      mockedCreateInterview.mockResolvedValue(interview);
  
      const body = {
        type: 'INITIAL',
        scheduledAt: '2026-08-01T02:00:00.000Z',
        interviewer: 'Jane Doe',
      };
  
      const req = {
        userId: 'user-1',
        params: { applicationId: 'application-1' },
        body,
      } as unknown as Request;
  
      const res = createResponseMock();
  
      await create(req, res);
  
      expect(mockedCreateInterview).toHaveBeenCalledWith({
        applicationId: 'application-1',
        userId: 'user-1',
        ...body,
      });
  
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Interview created successfully',
        interview,
      });
    });
  
    it('lists interviews in an application', async () => {
      const interviews = [
        {
          id: 'interview-1',
          type: 'INITIAL',
        },
        {
          id: 'interview-2',
          type: 'TECHNICAL',
        },
      ];
  
      mockedGetInterviews.mockResolvedValue(interviews);
  
      const req = {
        userId: 'user-1',
        params: { applicationId: 'application-1' },
      } as unknown as Request;
  
      const res = createResponseMock();
  
      await list(req, res);
  
      expect(mockedGetInterviews).toHaveBeenCalledWith(
        'application-1',
        'user-1'
      );
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        count: 2,
        interviews,
      });
    });
  
    it('returns 404 when an interview cannot be found', async () => {
      mockedGetInterviewById.mockResolvedValue(null);
  
      const req = {
        userId: 'user-1',
        params: {
          applicationId: 'application-1',
          interviewId: 'missing-interview',
        },
      } as unknown as Request;
  
      const res = createResponseMock();
  
      await getOne(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Interview not found',
      });
    });
  
    it('updates an interview', async () => {
      const interview = {
        id: 'interview-1',
        status: 'COMPLETED',
      };
  
      mockedUpdateInterview.mockResolvedValue(interview);
  
      const body = {
        status: 'COMPLETED',
        completedAt: '2026-08-01T03:00:00.000Z',
      };
  
      const req = {
        userId: 'user-1',
        params: {
          applicationId: 'application-1',
          interviewId: 'interview-1',
        },
        body,
      } as unknown as Request;
  
      const res = createResponseMock();
  
      await update(req, res);
  
      expect(mockedUpdateInterview).toHaveBeenCalledWith({
        applicationId: 'application-1',
        interviewId: 'interview-1',
        userId: 'user-1',
        ...body,
      });
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Interview updated successfully',
        interview,
      });
    });
  
    it('returns 404 when deleting a missing interview', async () => {
      mockedDeleteInterview.mockResolvedValue(false);
  
      const req = {
        userId: 'user-1',
        params: {
          applicationId: 'application-1',
          interviewId: 'missing-interview',
        },
      } as unknown as Request;
  
      const res = createResponseMock();
  
      await remove(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Interview not found',
      });
    });
  
    it('deletes an interview', async () => {
      mockedDeleteInterview.mockResolvedValue(true);
  
      const req = {
        userId: 'user-1',
        params: {
          applicationId: 'application-1',
          interviewId: 'interview-1',
        },
      } as unknown as Request;
  
      const res = createResponseMock();
  
      await remove(req, res);
  
      expect(mockedDeleteInterview).toHaveBeenCalledWith({
        applicationId: 'application-1',
        interviewId: 'interview-1',
        userId: 'user-1',
      });
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Interview deleted successfully',
      });
    });
  });