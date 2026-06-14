import { Request, Response } from "express";
import { createJob, getJobsByUser, getJobById, updateJob, deleteJob } from "./jobs.service";
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

        if (source && !JOB_SOURCES.includes(source)) {
            return res.status(400).json({
              message: "Invalid source",
              allowedSources: JOB_SOURCES,
            });
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

export async function getAll(req: Request, res: Response) {
    try {
        if (!req.userId) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        const jobs = await getJobsByUser(req.userId);
        return res.status(200).json({
          count: jobs.length,
          jobs,
        });
      } catch (error) {
        console.error("List jobs error:", error);
        return res.status(500).json({ message: "Internal server error" });
      }
}

export async function getOne(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { id } = req.params;
      const job = await getJobById(id as string, req.userId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      return res.status(200).json({ job });
    } catch (error) {
      console.error("Get job error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
}

export async function update(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { id } = req.params;
      const { title, company, location, jobUrl, description, notes, source } = req.body;
      if (source && !JOB_SOURCES.includes(source)) {
        return res.status(400).json({
          message: "Invalid source",
          allowedSources: JOB_SOURCES,
        });
      }
      const job = await updateJob(id as string, req.userId, {
        title,
        company,
        location,
        jobUrl,
        description,
        notes,
        source,
        userId: req.userId,
      });
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      return res.status(200).json({
        message: "Job updated successfully",
        job,
      });
    } catch (error) {
      console.error("Update job error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
}

export async function remove(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const { id } = req.params;
      const deleted = await deleteJob(id as string, req.userId);
      if (!deleted) {
        return res.status(404).json({ message: "Job not found" });
      }
      return res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
      console.error("Delete job error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
}