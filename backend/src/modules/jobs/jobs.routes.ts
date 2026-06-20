import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { create, getAll, getOne, update, remove } from "./jobs.controller";
import { JOB_SOURCES, JOB_SOURCE_LABELS } from "./jobs.constants";
import { validate } from "../../middleware/validate.middleware";
import { createJobSchema, updateJobSchema, jobIdParamSchema, listJobsQuerySchema } from "./jobs.schema";

const router = Router();

// Optional: API to get job sources
router.get("/sources", authenticate, (_req, res) => {
    res.json({
      sources: JOB_SOURCES.map((value) => ({
        value,
        label: JOB_SOURCE_LABELS[value],
      })),
    });
});

router.get("/", authenticate, validate({ query: listJobsQuerySchema }), getAll);
router.get("/:id", authenticate, validate({ params: jobIdParamSchema }), getOne);
router.post("/", authenticate, validate({ body: createJobSchema }), create);
router.put("/:id", authenticate, validate({ params: jobIdParamSchema, body: updateJobSchema }), update);
router.delete("/:id", authenticate, validate({ params: jobIdParamSchema }), remove);

export default router;