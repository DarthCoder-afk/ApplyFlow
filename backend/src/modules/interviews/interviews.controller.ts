import { Request, Response } from 'express';
import {
  createInterview,
  deleteInterview,
  getInterviewById,
  getInterviews,
  updateInterview,
} from './interviews.service';

export async function create(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { applicationId } = req.params;

    const interview = await createInterview({
      applicationId: applicationId as string,
      userId: req.userId,
      ...req.body,
    });

    return res.status(201).json({
      message: 'Interview created successfully',
      interview,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'APPLICATION_NOT_FOUND'
    ) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    console.error('Create interview error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

export async function list(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { applicationId } = req.params;

    const interviews = await getInterviews(
      applicationId as string,
      req.userId
    );

    return res.status(200).json({
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'APPLICATION_NOT_FOUND'
    ) {
      return res.status(404).json({
        message: 'Application not found',
      });
    }

    console.error('List interviews error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

export async function getOne(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { applicationId, interviewId } = req.params;

    const interview = await getInterviewById({
      applicationId: applicationId as string,
      interviewId: interviewId as string,
      userId: req.userId,
    });

    if (!interview) {
      return res.status(404).json({
        message: 'Interview not found',
      });
    }

    return res.status(200).json({
      interview,
    });
  } catch (error) {
    console.error('Get interview error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

export async function update(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { applicationId, interviewId } = req.params;

    const interview = await updateInterview({
      applicationId: applicationId as string,
      interviewId: interviewId as string,
      userId: req.userId,
      ...req.body,
    });

    if (!interview) {
      return res.status(404).json({
        message: 'Interview not found',
      });
    }

    return res.status(200).json({
      message: 'Interview updated successfully',
      interview,
    });
  } catch (error) {
    console.error('Update interview error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

export async function remove(
  req: Request,
  res: Response
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const { applicationId, interviewId } = req.params;

    const deleted = await deleteInterview({
      applicationId: applicationId as string,
      interviewId: interviewId as string,
      userId: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: 'Interview not found',
      });
    }

    return res.status(200).json({
      message: 'Interview deleted successfully',
    });
  } catch (error) {
    console.error('Delete interview error:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}