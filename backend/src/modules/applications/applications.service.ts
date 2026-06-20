import { prisma } from "../../config/database";
import { getJobById } from "../jobs/jobs.service";
import { ApplicationStatus } from "./applications.constants";

type ApplicationSortField = "createdAt" | "updatedAt" | "appliedAt" | "status";

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
    search?: string;
    page?: number;
    limit?: number;
    sort?: ApplicationSortField;
    order?: "asc" | "desc";
  };

export async function createApplication(input: CreateApplicationInput){
    const job = await getJobById(input.jobId, input.userId);

    if (!job){
        throw new Error("JOB_NOT_FOUND");
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
        throw new Error("APPLICATION_ALREADY_EXISTS");
    }

    return prisma.application.create({
        data: {
            jobId: input.jobId,
            userId: input.userId,
            status: input.status ?? "APPLIED",
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
    const limit =
      filters.limit && filters.limit > 0 && filters.limit <= 50
        ? filters.limit
        : 10;
    const skip = (page - 1) * limit;
    const sortField = filters.sort ?? "createdAt";
    const sortOrder = filters.order ?? "desc";
    const where = {
      userId: filters.userId,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search
        ? {
            job: {
              OR: [
                { title: { contains: filters.search, mode: "insensitive" as const } },
                { company: { contains: filters.search, mode: "insensitive" as const } },
              ],
            },
          }
        : {}),
    };
    const [applications, total] = await Promise.all([
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
        },
      }),
      prisma.application.count({ where }),
    ]);
    return {
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
}
  

export async function getApplicationsById(id: string, userId: string ) {
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

export async function updateApplication(
    id: string,
    userId: string,
    data: UpdateApplicationInput
  ) {

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