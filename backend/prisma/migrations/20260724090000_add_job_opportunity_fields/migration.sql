-- CreateEnum
CREATE TYPE "JobReviewStatus" AS ENUM ('UNREVIEWED', 'REVIEWING', 'READY_TO_APPLY', 'NOT_INTERESTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "JobPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW', 'NONE');

-- AlterTable
ALTER TABLE "jobs"
ADD COLUMN "reviewStatus" "JobReviewStatus" NOT NULL DEFAULT 'UNREVIEWED',
ADD COLUMN "priority" "JobPriority" NOT NULL DEFAULT 'NONE',
ADD COLUMN "deadline" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "jobs_userId_reviewStatus_idx" ON "jobs"("userId", "reviewStatus");

-- CreateIndex
CREATE INDEX "jobs_userId_priority_idx" ON "jobs"("userId", "priority");
