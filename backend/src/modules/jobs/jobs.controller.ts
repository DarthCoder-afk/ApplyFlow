import { Request, Response } from "express";
import { createJob } from "./jobs.service";
import { JOB_SOURCES } from "./jobs.constants";

export async function create(req: Request, res: Response) {
    try {
        const { title, company, location, jobUrl, description, notes, source } = req.body;

        if(!title || !company){
            return res.status(400).json({ message: "Title and company are required" });
        }

        if (!req.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const job = await createJob({
            title,
            company,
            location,
            jobUrl,
            description,
            notes,
            source,
            userId: req.userId,
        });

        return res.status(201).json({
            message: "Job created successfully",
            job,
        });
    } catch (error) {
        console.error("Create job error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}