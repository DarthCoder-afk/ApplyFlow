import AppSidebar from '@/src/components/dashboard/app-sidebar';
import AuthGuard from '@/src/components/auth/auth-guard';
import DashboardHeader from '@/src/components/dashboard/dashboard-header';
import { SidebarProvider } from '@/src/components/dashboard/sidebar-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex h-dvh w-full overflow-hidden bg-slate-50 text-slate-900">
          <AppSidebar />
          <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <main className="min-h-0 flex-1 overflow-y-auto p-6 md:p-8">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
