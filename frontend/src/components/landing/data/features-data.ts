export type FeatureIconName = 'briefcase' | 'barChart3' | 'bellRing';

export type FeatureSpotlightItem = {
  icon: FeatureIconName;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

export const FEATURES: FeatureSpotlightItem[] = [
  {
    icon: 'briefcase',
    eyebrow: 'Job Tracker',
    title: 'Focus on applying, not managing spreadsheets',
    description:
      'Save opportunities from across the web and keep every role in one clean pipeline.',
    bullets: [
      'Save jobs from LinkedIn, Indeed, JobStreet, and more',
      'Move applications as you progress through each stage',
      'Keep company, role, and source details in one place',
    ],
  },
  {
    icon: 'barChart3',
    eyebrow: 'Dashboard',
    title: 'See your job hunt at a glance',
    description: 'Monitor statuses from Applied to Offer with stats that show real momentum.',
    bullets: [
      'Track applications, interviews, and offers in one view',
      'Filter and sort jobs by status, date, or company',
      'Spot trends in your search with clear dashboard stats',
    ],
  },
  {
    icon: 'bellRing',
    eyebrow: 'Applications',
    title: 'Stay on top of every follow-up',
    description: 'Notes, status updates, and timelines so nothing slips through the cracks.',
    bullets: [
      'Attach notes to each application',
      'Update status in seconds as things move forward',
      'Stay prepared for interviews and deadline reminders',
    ],
  },
];
