DROP INDEX IF EXISTS "jobs_userId_reviewStatus_idx";

ALTER TABLE "jobs"
DROP COLUMN IF EXISTS "reviewStatus";

DROP TYPE IF EXISTS "JobReviewStatus";
