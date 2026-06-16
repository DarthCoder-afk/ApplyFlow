import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { create, getApplications } from "./applications.controller";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getApplications);

export default router;