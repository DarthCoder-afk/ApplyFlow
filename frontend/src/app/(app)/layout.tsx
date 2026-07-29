import AppSidebar from '@/src/components/navigation/app-sidebar';
import AuthGuard from '@/src/components/auth/auth-guard';
import DashboardHeader from '@/src/components/dashboard/dashboard-header';
import { SidebarProvider } from '@/src/components/navigation/sidebar-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex h-dvh w-full overflow-hidden bg-[#F8FAFC] text-slate-900">
          <AppSidebar />
          <div className="flex h-dvh min-w-0 flex-1 flex-col overflow-hidden">
            <DashboardHeader />
            <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-7">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
