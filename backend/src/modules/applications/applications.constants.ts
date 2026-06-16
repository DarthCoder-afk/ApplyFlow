export const APPLICATION_STATUSES = [
    "SAVED",
    "APPLIED",
    "INTERVIEW",
    "OFFER",
    "REJECTED",
    "WITHDRAWN",
  ] as const;
  
  export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
  
  export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
    SAVED: "Saved",
    APPLIED: "Applied",
    INTERVIEW: "Interview",
    OFFER: "Offer",
    REJECTED: "Rejected",
    WITHDRAWN: "Withdrawn",
  };