import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK", message: "Job Tracker API is running" });
});

export default app;