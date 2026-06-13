import { Router } from "express";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Job Tracker API is running" });
});

export default router;