import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { create, listApplications, getOne, update, remove } from "./applications.controller";

const router = Router();

router.post("/", authenticate, create);
router.get("/", authenticate, listApplications);
router.get("/:id", authenticate, getOne);
router.put("/:id", authenticate, update);
router.delete("/:id", authenticate, remove);
export default router;