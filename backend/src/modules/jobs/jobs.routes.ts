import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { create } from "./jobs.controller";
import { JOB_SOURCES, JOB_SOURCE_LABELS } from "./jobs.constants";

const router = Router();

router.post("/", authenticate, create);

// Optional: API to get job sources
router.get("/sources", authenticate, (_req, res) => {
    res.json({
      sources: JOB_SOURCES.map((value) => ({
        value,
        label: JOB_SOURCE_LABELS[value],
      })),
    });
});

export default router;