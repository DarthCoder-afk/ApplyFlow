import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { create, listApplications, getOne } from "./applications.controller";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, listApplications);
router.get("/:id", authenticate, getOne);

export default router;