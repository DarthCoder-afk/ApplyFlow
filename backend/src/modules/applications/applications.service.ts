import { prisma } from "../../config/database";
import { getJobById } from "../jobs/jobs.service";
import { ApplicationStatus } from "./applications.constants";

type CreateApplicationInput = {
    jobId: string;
    userId: string;
    status?: ApplicationStatus;
    appliedAt?: string;
    notes?: string;
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

export async function getApplications(userId: string){
    return prisma.application.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
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
    })
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