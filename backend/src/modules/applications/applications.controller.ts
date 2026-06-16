import { Request, Response } from "express";
import { createApplication } from "./applications.service";
import { APPLICATION_STATUSES } from "./applications.constants";


export async function create(req: Request, res: Response) {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { jobId, status, appliedAt, notes } = req.body;

        if (!jobId) {
            return res.status(400).json({ message: "jobId is required"});
        }

        if (status && !APPLICATION_STATUSES.includes(status)) {
            return res.status(400).json({ message: "Invalid status", allowedStatuses: APPLICATION_STATUSES});
        }

        const application = await createApplication({
            jobId,
            userId: req.userId,
            status,
            appliedAt,
            notes,
        });

        return res.status(201).json({
            message: "Application created successfully",
            application,
        });
    } catch (error) {
        if(error instanceof Error && error.message === "JOB_NOT_FOUND"){
            return res.status(404).json({ message: "Job not found"});
        }

        if (error instanceof Error && error.message === "APPLICATION_ALREADY_EXISTS") {
            return res.status(409).json({ message: "Application already exists for this job" });
        }
        
        console.error("Create application error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}