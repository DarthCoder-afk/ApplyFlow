export const JOB_SOURCES = [
    "LINKEDIN",
    "INDEED",
    "JOBSTREET",
    "GLASSDOOR",
    "COMPANY_WEBSITE",
    "REFERRAL",
    "OTHER",
] as const;
  
export type JobSource = (typeof JOB_SOURCES)[number];

export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
    LINKEDIN: "LinkedIn",
    INDEED: "Indeed",
    JOBSTREET: "JobStreet",
    GLASSDOOR: "Glassdoor",
    COMPANY_WEBSITE: "Company Website",
    REFERRAL: "Referral",
    OTHER: "Other",
};