import { prisma } from '../../config/database';
import { getJobById } from '../jobs/jobs.service';
import { ApplicationStatus } from './applications.constants';
import { JobSource } from '../jobs/jobs.constants';

type ApplicationSortField = 'createdAt' | 'updatedAt' | 'appliedAt' | 'status';

type CreateApplicationInput = {
  jobId: string;
  userId: string;
  status?: ApplicationStatus;
  appliedAt?: string;
  notes?: string;
};

type UpdateApplicationInput = {
  status?: ApplicationStatus;
  appliedAt?: string;
  notes?: string;
};

type GetApplicationsFilters = {
  userId: string;
  status?: ApplicationStatus;
  company?: string;
  source?: JobSource;
  followUpNeeded?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  sort?: ApplicationSortField;
  order?: 'asc' | 'desc';
};

const ACTIVE_APPLICATION_STATUSES: ApplicationStatus[] = ['SAVED', 'APPLIED', 'INTERVIEW'];
const UPCOMING_INTERVIEW_STATUSES = ['SCHEDULED', 'RESCHEDULED'] as const;
const FOLLOW_UP_DAYS = 7;

export function isFollowUpNeeded(
  application: {
    status: ApplicationStatus;
    updatedAt: Date;
    interviews: Array<{ scheduledAt: Date }>;
  },
  now = new Date()
) {
  const cutoff = new Date(now.getTime() - FOLLOW_UP_DAYS * 86_400_000);
  return (
    ACTIVE_APPLICATION_STATUSES.includes(application.status) &&
    application.updatedAt <= cutoff &&
    application.interviews.length === 0
  );
}

export async function createApplication(input: CreateApplicationInput) {
  const job = await getJobById(input.jobId, input.userId);

  if (!job) {
    throw new Error('JOB_NOT_FOUND');
  }

  const existing = await prisma.application.findUnique({
    where: {
      jobId_userId: {
        jobId: input.jobId,
        userId: input.userId,
      },
    },
  });

  if (existing) {
    throw new Error('APPLICATION_ALREADY_EXISTS');
  }

  return prisma.application.create({
    data: {
      jobId: input.jobId,
      userId: input.userId,
      status: input.status ?? 'APPLIED',
      appliedAt: input.appliedAt ? new Date(input.appliedAt) : new Date(),
      notes: input.notes,
    },

    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
  });
}

export async function getApplications(filters: GetApplicationsFilters) {
  const page = filters.page && filters.page > 0 ? filters.page : 1;
  const limit = filters.limit && filters.limit > 0 && filters.limit <= 50 ? filters.limit : 10;
  const skip = (page - 1) * limit;
  const sortField = filters.sort ?? 'createdAt';
  const sortOrder = filters.order ?? 'desc';
  const now = new Date();
  const followUpCutoff = new Date(now.getTime() - FOLLOW_UP_DAYS * 86_400_000);
  const upcomingInterviewWhere = {
    scheduledAt: { gte: now },
    status: { in: [...UPCOMING_INTERVIEW_STATUSES] },
  };
  const appliedAtFilter =
  filters.fromDate || filters.toDate
    ? {
        ...(filters.fromDate
          ? { gte: new Date(`${filters.fromDate}T00:00:00.000Z`) }
          : {}),
        ...(filters.toDate
          ? { lte: new Date(`${filters.toDate}T23:59:59.999Z`) }
          : {}),
      }
    : undefined;
  const where = {
    userId: filters.userId,

    ...(appliedAtFilter ? { appliedAt: appliedAtFilter } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.followUpNeeded
      ? {
          updatedAt: { lte: followUpCutoff },
          interviews: { none: upcomingInterviewWhere },
        }
      : {}),
    AND: [
      ...(filters.followUpNeeded
        ? [{ status: { in: ACTIVE_APPLICATION_STATUSES } }]
        : []),
      ...(filters.company
        ? [{ job: { company: { contains: filters.company, mode: 'insensitive' as const } } }]
        : []),
      ...(filters.source ? [{ job: { source: filters.source } }] : []),
      ...(filters.search
        ? [{
            job: {
              OR: [
                { title: { contains: filters.search, mode: 'insensitive' as const } },
                { company: { contains: filters.search, mode: 'insensitive' as const } },
              ],
            },
          }]
        : []),
    ],
  };
  const [applications, total, summaryApplications] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortField]: sortOrder },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: true,
            location: true,
            source: true,
            jobUrl: true,
          },
        },
        _count: {
          select: {
            interviews: true,
          },
        },
        interviews: {
          where: upcomingInterviewWhere,
          orderBy: { scheduledAt: 'asc' },
          take: 1,
          select: {
            id: true,
            type: true,
            status: true,
            scheduledAt: true,
            completedAt: true,
            location: true,
            meetingUrl: true,
            interviewer: true,
            notes: true,
            applicationId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    }),
    prisma.application.count({ where }),
    prisma.application.findMany({
      where: { userId: filters.userId },
      select: {
        status: true,
        updatedAt: true,
        interviews: {
          where: upcomingInterviewWhere,
          select: { scheduledAt: true },
        },
      },
    }),
  ]);
  return {
    applications: applications.map((application) => ({
      ...application,
      followUpNeeded: isFollowUpNeeded(application, now),
    })),
    summary: {
      active: summaryApplications.filter((application) =>
        ACTIVE_APPLICATION_STATUSES.includes(application.status)
      ).length,
      needsFollowUp: summaryApplications.filter((application) =>
        isFollowUpNeeded(application, now)
      ).length,
      upcomingInterviews: summaryApplications.reduce(
        (totalInterviews, application) =>
          totalInterviews + application.interviews.length,
        0
      ),
      offers: summaryApplications.filter((application) => application.status === 'OFFER').length,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getApplicationsById(id: string, userId: string) {
  return prisma.application.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          source: true,
          jobUrl: true,
          description: true,
        },
      },
    },
  });
}

export async function updateApplication(id: string, userId: string, data: UpdateApplicationInput) {
  const existing = await getApplicationsById(id, userId);

  if (!existing) {
    return null;
  }

  return prisma.application.update({
    where: { id },
    data: {
      status: data.status,
      notes: data.notes,
      appliedAt: data.appliedAt ? new Date(data.appliedAt) : undefined,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          source: true,
        },
      },
    },
  });
}
export async function deleteApplication(id: string, userId: string) {
  const existing = await getApplicationsById(id, userId);

  if (!existing) {
    return null;
  }

  await prisma.application.delete({
    where: { id },
  });

  return true;
}
