import { Request, Response } from "express";
import { registerUser } from "./auth.service";

export async function register(req: Request, res: Response){
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await registerUser({ email, password, name });

        return res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        if(error instanceof Error && error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(400).json({ message: "Email already exists" });
        }

        console.error("Register error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}