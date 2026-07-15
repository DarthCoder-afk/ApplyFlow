'use client';

import { BriefcaseBusiness, Menu } from 'lucide-react';
import { useSidebar } from '@/src/components/dashboard/sidebar-context';

export default function DashboardHeader() {
  const { open } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-800 bg-slate-950 px-4 py-3 text-white lg:hidden">
      <button
        type="button"
        onClick={open}
        className="rounded-xl border border-white/10 p-2 text-slate-200 hover:bg-white/10"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <span className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight">
        <BriefcaseBusiness className="h-4 w-4 text-cyan-300" />
        Job Tracker
      </span>
    </header>
  );
}
