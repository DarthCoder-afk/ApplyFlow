import { Request, Response } from 'express';
import {
  createApplication,
  getApplications,
  getApplicationsById,
  updateApplication,
  deleteApplication,
} from './applications.service';
import { APPLICATION_STATUSES } from './applications.constants';
import { ListApplicationsQuery, listApplicationsQuerySchema } from './applications.schema';

export async function create(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { jobId, status, appliedAt, notes } = req.body;

    const application = await createApplication({
      jobId,
      userId: req.userId,
      status,
      appliedAt,
      notes,
    });

    return res.status(201).json({
      message: 'Application created successfully',
      application,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'JOB_NOT_FOUND') {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (error instanceof Error && error.message === 'APPLICATION_ALREADY_EXISTS') {
      return res.status(409).json({ message: 'Application already exists for this job' });
    }

    console.error('Create application error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function listApplications(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { status, search, page, limit, sort, order } = req.validatedQuery as ListApplicationsQuery;

    const result = await getApplications({
      userId: req.userId,
      status,
      search,
      page,
      limit,
      sort,
      order,
    });

    return res.status(200).json({
      count: result.applications.length,
      applications: result.applications,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('List applications error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unathorized' });
    }

    const { id } = req.params;
    const application = await getApplicationsById(id as string, req.userId);

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.status(200).json({ application });
  } catch (error) {
    console.error(' Get application error: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { status, appliedAt, notes } = req.body;

    if (status && !APPLICATION_STATUSES.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        allowedStatuses: APPLICATION_STATUSES,
      });
    }

    const application = await updateApplication(id as string, req.userId, {
      status,
      appliedAt,
      notes,
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.status(200).json({
      message: 'Application updated successfully',
      application,
    });
  } catch (error) {
    console.error('Update application error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
export async function remove(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const deleted = await deleteApplication(id as string, req.userId);

    if (!deleted) {
      return res.status(404).json({ message: 'Application not found' });
    }

    return res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Delete application error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
