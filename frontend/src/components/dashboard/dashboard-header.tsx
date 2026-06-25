'use client';

import { Menu } from 'lucide-react';
import { useSidebar } from '@/src/components/dashboard/sidebar-context';

export default function DashboardHeader() {
  const { open } = useSidebar();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
      <button
        type="button"
        onClick={open}
        className="rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-50"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <span className="text-lg font-semibold">
        Job{' '}
        <span className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
          Tracker
        </span>
      </span>
    </header>
  );
}
