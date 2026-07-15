import { prisma } from '../../config/database';
import { JobSource } from './jobs.constants';

type JobSortField = 'createdAt' | 'updatedAt' | 'title' | 'company';

type CreateJobInput = {
  title: string;
  company: string;
  location?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  source?: JobSource;
  userId: string;
};

type UpdateJobInput = {
  title?: string;
  company?: string;
  location?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  source?: JobSource;
  userId: string;
};

type GetJobsFilters = {
  userId: string;
  search?: string;
  source?: JobSource;
  page?: number;
  limit?: number;
  availableOnly?: boolean;
  sort?: JobSortField;
  order?: 'asc' | 'desc';
};


export async function createJob(input: CreateJobInput) {
  return prisma.job.create({
    data: {
      title: input.title,
      company: input.company,
      location: input.location,
      jobUrl: input.jobUrl,
      description: input.description,
      notes: input.notes,
      source: input.source,
      userId: input.userId,
    },
  });
}

export async function getJobsByUser(filters: GetJobsFilters) {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 && filters.limit <= 50 ? filters.limit : 10;
  const skip = (page - 1) * limit;
  const sortField = filters.sort ?? 'createdAt';
  const sortOrder = filters.order ?? 'desc';
  const where = {
    userId: filters.userId,

    ...(filters.availableOnly
      ? {
          applications: {
            none: {
              userId: filters.userId,
            },
          },
        }
      : {}),

    ...(filters.source ? { source: filters.source } : {}),
    ...(filters.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: 'insensitive' as const } },
            { company: { contains: filters.search, mode: 'insensitive' as const } },
            { location: { contains: filters.search, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  };
  const [jobs, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortField]: sortOrder },
    }),
    prisma.job.count({ where }),
  ]);
  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getJobById(jobId: string, userId: string) {
  return prisma.job.findFirst({
    where: {
      id: jobId,
      userId,
    },
  });
}

export async function updateJob(jobId: string, userId: string, data: UpdateJobInput) {
  const existingJob = await getJobById(jobId, userId);

  if (!existingJob) {
    return null;
  }

  return prisma.job.update({
    where: { id: jobId },
    data,
  });
}

export async function deleteJob(jobId: string, userId: string) {
  const existingJob = await getJobById(jobId, userId);

  if (!existingJob) {
    return null;
  }
  await prisma.job.delete({
    where: { id: jobId },
  });

  return true;
}
