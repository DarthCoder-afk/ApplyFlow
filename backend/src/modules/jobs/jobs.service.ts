import { prisma } from '../../config/database';
import {
  JOB_SOURCES,
  JobPriority,
  JobSource,
} from './jobs.constants';

type JobSortField = 'createdAt' | 'updatedAt' | 'title' | 'company' | 'priority' | 'deadline';

type JobInput = {
  title?: string;
  company?: string;
  location?: string;
  jobUrl?: string;
  description?: string;
  notes?: string;
  source?: JobSource;
  priority?: JobPriority;
  deadline?: string | null;
  allowDuplicate?: boolean;
  userId: string;
};

type GetJobsFilters = {
  userId: string;
  search?: string;
  location?: string;
  source?: JobSource;
  priority?: JobPriority;
  hasApplication?: boolean;
  closingSoon?: boolean;
  page?: number;
  limit?: number;
  availableOnly?: boolean;
  fromDate?: string;
  toDate?: string;
  sort?: JobSortField;
  order?: 'asc' | 'desc';
};

export function normalizeJobUrl(value: string) {
  try {
    const url = new URL(value);
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (key.toLowerCase().startsWith('utm_')) url.searchParams.delete(key);
    }
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    url.pathname = url.pathname.replace(/\/+$/, '') || '/';
    return url.toString().replace(/\/$/, '');
  } catch {
    return value.trim().toLowerCase().replace(/\/+$/, '');
  }
}

export function normalizeJobTitle(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function isPossibleDuplicate(
  candidate: { title: string; company: string; jobUrl: string | null },
  existing: { title: string; company: string; jobUrl: string | null }
) {
  const sameUrl =
    Boolean(candidate.jobUrl && existing.jobUrl) &&
    normalizeJobUrl(candidate.jobUrl!) === normalizeJobUrl(existing.jobUrl!);
  const sameCompanyAndTitle =
    candidate.company.trim().toLowerCase() === existing.company.trim().toLowerCase() &&
    normalizeJobTitle(candidate.title) === normalizeJobTitle(existing.title);
  return sameUrl || sameCompanyAndTitle;
}

export function getJobsSummary(
  jobs: Array<{
    priority: JobPriority;
    deadline: Date | null;
    applications: Array<{ id: string }>;
  }>,
  now = new Date()
) {
  const closingLimit = new Date(now.getTime() + 7 * 86_400_000);
  return {
    all: jobs.length,
    highPriority: jobs.filter((job) => job.priority === 'HIGH').length,
    hasApplication: jobs.filter((job) => job.applications.length > 0).length,
    closingSoon: jobs.filter(
      (job) => job.deadline !== null && job.deadline >= now && job.deadline <= closingLimit
    ).length,
  };
}

async function assertNotDuplicate(
  input: JobInput & { title: string; company: string },
  excludeId?: string
) {
  if (input.allowDuplicate) return;
  const existing = await prisma.job.findMany({
    where: { userId: input.userId, ...(excludeId ? { id: { not: excludeId } } : {}) },
    select: { title: true, company: true, jobUrl: true },
  });
  if (
    existing.some((job) =>
      isPossibleDuplicate(
        { title: input.title, company: input.company, jobUrl: input.jobUrl ?? null },
        job
      )
    )
  ) {
    throw new Error('POSSIBLE_DUPLICATE');
  }
}

export async function createJob(input: JobInput & { title: string; company: string }) {
  await assertNotDuplicate(input);
  const { allowDuplicate: _allowDuplicate, deadline, ...data } = input;
  return prisma.job.create({
    data: {
      ...data,
      deadline: deadline ? new Date(deadline) : null,
    },
  });
}

export async function getJobsByUser(filters: GetJobsFilters) {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 && filters.limit <= 50 ? filters.limit : 10;
  const skip = (page - 1) * limit;
  const createdAt =
    filters.fromDate || filters.toDate
      ? {
          ...(filters.fromDate ? { gte: new Date(`${filters.fromDate}T00:00:00.000Z`) } : {}),
          ...(filters.toDate ? { lte: new Date(`${filters.toDate}T23:59:59.999Z`) } : {}),
        }
      : undefined;
  const normalizedSource = filters.search?.trim().toUpperCase().replace(/\s+/g, '_');
  const searchedSource = JOB_SOURCES.find((source) => source === normalizedSource);
  const applicationsFilter =
    filters.availableOnly || filters.hasApplication === false
      ? { none: { userId: filters.userId } }
      : filters.hasApplication === true
        ? { some: { userId: filters.userId } }
        : undefined;
  const where = {
    userId: filters.userId,
    ...(applicationsFilter ? { applications: applicationsFilter } : {}),
    ...(createdAt ? { createdAt } : {}),
    ...(filters.source ? { source: filters.source } : {}),
    ...(filters.location
      ? { location: { contains: filters.location, mode: 'insensitive' as const } }
      : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
    ...(filters.closingSoon
      ? { deadline: { gte: new Date(), lte: new Date(Date.now() + 7 * 86_400_000) } }
      : {}),
    ...(filters.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: 'insensitive' as const } },
            { company: { contains: filters.search, mode: 'insensitive' as const } },
            { location: { contains: filters.search, mode: 'insensitive' as const } },
            ...(searchedSource ? [{ source: searchedSource }] : []),
          ],
        }
      : {}),
  };
  const sortField = filters.sort ?? 'createdAt';
  const sortOrder = filters.order ?? (sortField === 'title' || sortField === 'company' ? 'asc' : 'desc');
  const orderBy =
    sortField === 'deadline'
      ? { deadline: { sort: 'asc' as const, nulls: 'last' as const } }
      : { [sortField]: sortOrder };

  const [jobs, total, summaryJobs] =
    await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          applications: {
            where: { userId: filters.userId },
            select: { id: true, status: true, appliedAt: true },
            take: 1,
          },
        },
      }),
      prisma.job.count({ where }),
      prisma.job.findMany({
        where: { userId: filters.userId },
        select: {
          id: true,
          title: true,
          company: true,
          jobUrl: true,
          priority: true,
          deadline: true,
          applications: {
            where: { userId: filters.userId },
            select: { id: true },
            take: 1,
          },
        },
      }),
    ]);

  return {
    jobs: jobs.map((job) => ({
      ...job,
      possibleDuplicate: summaryJobs.some(
        (candidate) => candidate.id !== job.id && isPossibleDuplicate(job, candidate)
      ),
    })),
    summary: getJobsSummary(summaryJobs),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getJobById(jobId: string, userId: string) {
  return prisma.job.findFirst({
    where: { id: jobId, userId },
    include: {
      applications: {
        where: { userId },
        select: { id: true, status: true, appliedAt: true },
        take: 1,
      },
    },
  });
}

export async function updateJob(jobId: string, userId: string, input: JobInput) {
  const existing = await getJobById(jobId, userId);
  if (!existing) return null;
  const merged = {
    ...input,
    title: input.title ?? existing.title,
    company: input.company ?? existing.company,
    jobUrl: input.jobUrl ?? existing.jobUrl ?? undefined,
  };
  await assertNotDuplicate(merged, jobId);
  const { allowDuplicate: _allowDuplicate, userId: _userId, deadline, ...data } = input;
  return prisma.job.update({
    where: { id: jobId },
    data: {
      ...data,
      deadline: deadline === undefined ? undefined : deadline ? new Date(deadline) : null,
    },
    include: {
      applications: {
        where: { userId },
        select: { id: true, status: true, appliedAt: true },
        take: 1,
      },
    },
  });
}

export async function deleteJob(jobId: string, userId: string) {
  const existing = await getJobById(jobId, userId);
  if (!existing) return null;
  await prisma.job.delete({ where: { id: jobId } });
  return true;
}
