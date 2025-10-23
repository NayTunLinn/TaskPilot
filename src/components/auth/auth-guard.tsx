
'use client';

import { useUser } from '@/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const PUBLIC_PATHS = ['/login', '/signup'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isPublicPath = PUBLIC_PATHS.includes(pathname);
      
      if (!user && !isPublicPath) {
        router.push('/login');
      }
      
      if (user && isPublicPath) {
        router.push('/');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  
  const isPublicPath = PUBLIC_PATHS.includes(pathname);
  if (!user && !isPublicPath) {
    return null; // or a loading spinner
  }
  
  if (user && isPublicPath) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
