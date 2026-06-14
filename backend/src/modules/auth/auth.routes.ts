import { Router } from "express";
import { register, login, refresh, logout } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", authenticate, (req, res) => {
    res.json({ userId: req.userId });
})

export default router;
