import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { create, listApplications } from "./applications.controller";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, listApplications);

export default router;