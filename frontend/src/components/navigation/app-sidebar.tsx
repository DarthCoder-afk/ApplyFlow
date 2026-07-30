'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  BriefcaseBusiness,
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from './sidebar-context';
import { logout } from '@/lib/api/auth';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { href: '/applications', label: 'Applications', icon: FileText },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/profile', label: 'Profile', icon: UserRound },
];

type SidebarContentProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
  onToggleCollapsed?: () => void;
};

function SidebarContent({
  collapsed = false,
  onNavigate,
  onToggleCollapsed,
}: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await logout();
    } finally {
      onNavigate?.();
      router.push('/login');
    }
  }

  return (
    <>
      <div
        className={cn(
          'flex items-center',
          collapsed
            ? 'h-[104px] flex-col justify-center gap-2 px-2'
            : 'h-[73px] justify-between px-5'
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            'inline-flex min-w-0 items-center text-lg font-semibold tracking-tight text-slate-950',
            collapsed ? 'justify-center' : 'gap-2.5'
          )}
          onClick={onNavigate}
          aria-label={collapsed ? 'ApplyFlow dashboard' : undefined}
        >
          <Image
            src="/applyflow-icon.svg"
            alt=""
            width={36}
            height={36}
            className={cn('shrink-0', collapsed ? 'h-8 w-8' : 'h-9 w-9')}
          />
          {!collapsed && <span>ApplyFlow</span>}
        </Link>

        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={cn(
              'hidden shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:grid',
              collapsed ? 'h-8 w-8' : 'h-9 w-9'
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </button>
        )}

        {!collapsed && (
          <button
            type="button"
            onClick={onNavigate}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav
        className={cn(
          'scrollbar-hidden flex flex-1 flex-col gap-1 overflow-y-auto py-5',
          collapsed ? 'px-2' : 'px-3'
        )}
      >
        {!collapsed && (
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Workspace
          </p>
        )}
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              title={collapsed ? label : undefined}
              aria-label={collapsed ? label : undefined}
              className={cn(
                'flex items-center rounded-xl py-2.5 text-sm font-medium transition-colors',
                collapsed ? 'justify-center px-2' : 'gap-3 px-3',
                active
                  ? 'bg-indigo-50 font-semibold text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950'
              )}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      <div className={cn('border-t border-slate-200', collapsed ? 'p-2' : 'p-3')}>
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center rounded-xl py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950',
            collapsed ? 'justify-center px-2' : 'gap-3 px-3'
          )}
          aria-label={collapsed ? 'Sign out' : undefined}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && 'Sign out'}
        </button>
      </div>
    </>
  );
}

export default function AppSidebar() {
  const { isOpen, isCollapsed, close, toggleCollapsed } = useSidebar();

  return (
    <>
      <button
        type="button"
        aria-label="Close menu"
        onClick={close}
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/30 transition-opacity lg:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-60 max-w-[85vw] flex-col bg-white shadow-xl transition-transform duration-300 lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent onNavigate={close} />
      </aside>

      <aside
        className={cn(
          'relative z-40 hidden h-full shrink-0 flex-col overflow-hidden bg-white shadow-[4px_0_18px_rgba(15,23,42,0.07)] transition-[width] duration-300 lg:flex',
          isCollapsed ? 'w-20' : 'w-60'
        )}
      >
        <SidebarContent
          collapsed={isCollapsed}
          onToggleCollapsed={toggleCollapsed}
        />
      </aside>
    </>
  );
}
