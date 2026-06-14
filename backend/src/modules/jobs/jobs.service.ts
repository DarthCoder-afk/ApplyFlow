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