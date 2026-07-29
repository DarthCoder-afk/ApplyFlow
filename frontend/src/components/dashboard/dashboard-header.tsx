'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { getCurrentUser } from '@/lib/api/dashboard';
import { logout } from '@/lib/api/auth';
import { useSidebar } from '@/src/components/navigation/sidebar-context';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

const PAGE_META: Record<string, { title: string; icon: LucideIcon }> = {
  '/dashboard': { title: 'Dashboard', icon: LayoutDashboard },
  '/jobs': { title: 'Jobs', icon: BriefcaseBusiness },
  '/applications': { title: 'Applications', icon: FileText },
  '/calendar': { title: 'Calendar', icon: CalendarDays },
  '/settings': { title: 'Settings', icon: Settings },
};

function getPageMeta(pathname: string) {
  const route = Object.keys(PAGE_META).find(
    (candidate) => pathname === candidate || pathname.startsWith(`${candidate}/`)
  );
  return route ? PAGE_META[route] : { title: 'ApplyFlow', icon: Sparkles };
}

export default function DashboardHeader() {
  const { open } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
  });
  const pageMeta = getPageMeta(pathname);
  const PageIcon = pageMeta.icon;

  const initials =
    user?.name
      ?.split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    'U';

  async function handleLogout() {
    try {
      await logout();
    } finally {
      router.push('/login');
    }
  }

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="flex min-h-[72px] flex-wrap items-center gap-3 px-4 py-3 md:px-6 lg:px-8">
        <button
          type="button"
          onClick={open}
          className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <h1 className="flex min-w-0 items-center gap-2.5 text-xl font-semibold tracking-tight text-slate-950 md:w-52 md:text-2xl">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
            <PageIcon className="h-[18px] w-[18px]" />
          </span>
          {pageMeta.title}
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" className="ml-auto h-auto gap-2 border-0 p-1.5 shadow-none">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                {initials}
              </span>
              <span className="hidden min-w-0 text-left md:block">
                <span className="block max-w-36 truncate text-sm font-medium text-slate-900">
                  {user?.name ?? 'Your account'}
                </span>
                <span className="block max-w-40 truncate text-xs font-normal text-slate-500">
                  {user?.email ?? 'Signed in'}
                </span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onSelect={() => router.push('/settings')}>
              <Settings className="h-4 w-4" />Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="h-4 w-4" />Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
