import AppSidebar from '@/src/components/dashboard/app-sidebar';
import AuthGuard from '@/src/components/auth/auth-guard';
import DashboardHeader from '@/src/components/dashboard/dashboard-header';
import { SidebarProvider } from '@/src/components/dashboard/sidebar-context';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-dvh w-full bg-[#f8f9fa] text-[#212529]">
          <AppSidebar />
          <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
            <DashboardHeader />
            <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
