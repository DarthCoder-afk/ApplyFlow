import { z } from "zod";
import { APPLICATION_STATUSES } from "./applications.constants";

export const createApplicationSchema = z.object({
  jobId: z.string().min(1, "jobId is required"),
  status: z.enum(APPLICATION_STATUSES).optional(),
  appliedAt: z.string().datetime().optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const updateApplicationSchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  appliedAt: z.string().datetime().optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const applicationIdParamSchema = z.object({
  id: z.string().min(1, "Application id is required"),
});

export const listApplicationsQuerySchema = z.object({
  status: z.enum(APPLICATION_STATUSES).optional(),
  search: z.string().trim().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(["createdAt", "updatedAt", "appliedAt", "status"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type ListApplicationsQuery = z.infer<typeof listApplicationsQuerySchema>;