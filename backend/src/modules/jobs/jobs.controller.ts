import { Request, Response } from 'express';
import { createJob, getJobsByUser, getJobById, updateJob, deleteJob } from './jobs.service';
import { JOB_SOURCES, JobSource } from './jobs.constants';
import { ListJobsQuery, listJobsQuerySchema } from './jobs.schema';

export async function create(req: Request, res: Response) {
  try {
    const {
      title, company, location, url, description, notes, source,
      priority, deadline, allowDuplicate,
    } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const job = await createJob({
      title,
      company,
      location,
      jobUrl:url,
      description,
      notes,
      source,
      priority,
      deadline,
      allowDuplicate,
      userId: req.userId,
    });

    return res.status(201).json({
      message: 'Job created successfully',
      job,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'POSSIBLE_DUPLICATE') {
      return res.status(409).json({
        message: 'Possible duplicate job',
        code: 'POSSIBLE_DUPLICATE',
      });
    }
    console.error('Create job error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAll(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const {
      sort, order, search, location, source, priority, hasApplication,
      closingSoon, page, limit, availableOnly, fromDate, toDate,
    } = req.validatedQuery as ListJobsQuery;


    const result = await getJobsByUser({
      userId: req.userId,
      search,
      location,
      source,
      priority,
      hasApplication,
      closingSoon,
      page,
      limit,
      sort,
      order,
      availableOnly,
      fromDate,
      toDate,
    });

    return res.status(200).json({
      count: result.jobs.length,
      jobs: result.jobs,
      summary: result.summary,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('List jobs error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const job = await getJobById(id as string, req.userId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    return res.status(200).json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const {
      title, company, location, url, description, notes, source,
      priority, deadline, allowDuplicate,
    } = req.body;
    if (source && !JOB_SOURCES.includes(source)) {
      return res.status(400).json({
        message: 'Invalid source',
        allowedSources: JOB_SOURCES,
      });
    }
    const job = await updateJob(id as string, req.userId, {
      title,
      company,
      location,
      jobUrl:url,
      description,
      notes,
      source,
      priority,
      deadline,
      allowDuplicate,
      userId: req.userId,
    });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    return res.status(200).json({
      message: 'Job updated successfully',
      job,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'POSSIBLE_DUPLICATE') {
      return res.status(409).json({
        message: 'Possible duplicate job',
        code: 'POSSIBLE_DUPLICATE',
      });
    }
    console.error('Update job error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;
    const deleted = await deleteJob(id as string, req.userId);
    if (!deleted) {
      return res.status(404).json({ message: 'Job not found' });
    }
    return res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete job error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
