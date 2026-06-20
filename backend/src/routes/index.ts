import { Router } from "express";
import { prisma } from "../config/database";
import authRoutes from "../modules/auth/auth.routes";
import jobsRoutes from "../modules/jobs/jobs.routes";
import applicationsRoutes from "../modules/applications/applications.route";
import dashboardRoutes from "../modules/dashboard/dashboard.route";

const router = Router();

router.get("/health/db", async (_req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: "OK", message: "Database connected" });
      } catch (error) {
        console.error("Database connection failed:", error);
        res.status(503).json({ status: "ERROR", message: "Database unavailable" });
      }
})

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Job Tracker API is running" });
});

router.use("/auth", authRoutes);
router.use("/jobs", jobsRoutes);
router.use("/applications", applicationsRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;