-- CreateEnum
CREATE TYPE "JobSource" AS ENUM ('LINKEDIN', 'INDEED', 'JOBSTREET', 'GLASSDOOR', 'COMPANY_WEBSITE', 'REFERRAL', 'OTHER');

-- AlterTable
ALTER TABLE "jobs" ADD COLUMN     "source" "JobSource";
