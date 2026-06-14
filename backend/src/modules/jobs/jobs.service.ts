import { prisma } from "../../config/database";
import { JobSource } from "./jobs.constants";

type CreateJobInput = {
    title: string;
    company: string;
    location?: string;
    jobUrl?: string;
    description?: string;
    notes?: string;
    source?: JobSource;
    userId: string;
}

type UpdateJobInput = {
    title?: string;
    company?: string;
    location?: string;
    jobUrl?: string;
    description?: string;
    notes?: string;
    source?: JobSource;
    userId: string;
}

export async function createJob(input: CreateJobInput) {
    return prisma.job.create({
        data:{
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

export async function getJobsByUser(userId: string){
    return prisma.job.findMany({
        where: {userId},
        orderBy: {createdAt: "desc"},
    });
}

export async function getJobById(jobId: string, userId: string){
    return prisma.job.findFirst({
        where: {
            id: jobId,
            userId,
        },
    });
}

export async function updateJob(jobId: string, userId:string, data: UpdateJobInput) {
    const existingJob = await getJobById(jobId, userId);

    if (!existingJob){
        return null;
    }

    return prisma.job.update({
        where: {id: jobId},
        data,
    });
}

export async function deleteJob(jobId: string, userId: string){
    const existingJob = await getJobById(jobId, userId);

    if (!existingJob){
        return null;
    }
    await prisma.job.delete({
        where: {id: jobId },
    });

    return true;
}
