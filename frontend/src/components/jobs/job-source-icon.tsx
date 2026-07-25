import {
  Building2,
  CircleEllipsis,
  Globe,
  MapPin,
  Search,
  Users,
} from 'lucide-react';
import type { ComponentType } from 'react';
import type { JobSource } from '@/lib/types/job';
import { cn } from '@/lib/utils';

type SourceIcon = ComponentType<{ className?: string }>;

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="3" fill="currentColor" />
      <path
        fill="white"
        d="M6 9h3v9H6V9Zm1.5-4A1.75 1.75 0 1 1 7.5 8.5 1.75 1.75 0 0 1 7.5 5ZM11 9h2.88v1.23h.04A3.16 3.16 0 0 1 16.77 8.67C19.81 8.67 20 10.67 20 13.27V18h-3v-4.19c0-1 0-2.29-1.4-2.29s-1.61 1.09-1.61 2.22V18H11V9Z"
      />
    </svg>
  );
}

const JOB_SOURCE_ICONS: Record<JobSource, SourceIcon> = {
  LINKEDIN: LinkedInIcon,
  INDEED: Search,
  JOBSTREET: MapPin,
  GLASSDOOR: Building2,
  COMPANY_WEBSITE: Globe,
  REFERRAL: Users,
  OTHER: CircleEllipsis,
};

const JOB_SOURCE_ICON_STYLES: Record<JobSource, string> = {
  LINKEDIN: 'text-[#0a66c2]',
  INDEED: 'text-indigo-600',
  JOBSTREET: 'text-blue-600',
  GLASSDOOR: 'text-emerald-600',
  COMPANY_WEBSITE: 'text-cyan-600',
  REFERRAL: 'text-amber-600',
  OTHER: 'text-slate-500',
};

export const JOB_SOURCE_BADGE_STYLES: Record<JobSource, string> = {
  LINKEDIN: 'bg-blue-50 text-[#0a66c2]',
  INDEED: 'bg-indigo-50 text-indigo-700',
  JOBSTREET: 'bg-sky-50 text-sky-700',
  GLASSDOOR: 'bg-emerald-50 text-emerald-700',
  COMPANY_WEBSITE: 'bg-cyan-50 text-cyan-700',
  REFERRAL: 'bg-amber-50 text-amber-700',
  OTHER: 'bg-slate-100 text-slate-700',
};

export default function JobSourceIcon({
  source,
  className,
}: {
  source: JobSource;
  className?: string;
}) {
  const Icon = JOB_SOURCE_ICONS[source];
  return (
    <Icon
      className={cn(
        'h-4 w-4',
        JOB_SOURCE_ICON_STYLES[source],
        className
      )}
    />
  );
}
