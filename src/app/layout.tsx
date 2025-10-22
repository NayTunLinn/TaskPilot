import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-provider';
import { TaskProvider } from '@/contexts/TaskProvider';

export const metadata: Metadata = {
  title: 'TaskPilot',
  description: 'Organize, assign, and monitor tasks with TaskPilot.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <TaskProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex flex-1 flex-col">
                <AppHeader />
                <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
              </div>
            </div>
          </SidebarProvider>
        </TaskProvider>
        <Toaster />
      </body>
    </html>
  );
}
