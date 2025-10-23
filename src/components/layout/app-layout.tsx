
'use client';

import { usePathname } from 'next/navigation';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider } from './sidebar-provider';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
