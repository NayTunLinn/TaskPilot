
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-provider';
import { TaskProvider } from '@/contexts/TaskProvider';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { AuthGuard } from '@/components/auth/auth-guard';
import { usePathname } from 'next/navigation';

function MainContent({ children }: { children: React.ReactNode }) {
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

// Metadata can't be exported from a client component.
// We can keep it in a separate server component or move it here if the whole file becomes client component.
// For now, let's remove it from here to solve the immediate error. We can re-add it properly later if needed.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>TaskPilot</title>
        <meta name="description" content="Organize, assign, and monitor tasks with TaskPilot." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <TaskProvider>
                <AuthGuard>
                    <MainContent>{children}</MainContent>
                </AuthGuard>
            </TaskProvider>
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
