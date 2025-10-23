'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { users } from '@/lib/data';


// This is a mock implementation of useUser since auth has been removed.
// It returns a mock user.
export function useUser() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching a user
    const mockUser = {
        uid: 'user-1',
        displayName: users[0].name,
        email: users[0].email,
        photoURL: users[0].avatarUrl,
    }
    setUser(mockUser);
    setLoading(false);
  }, []);

  return { user, loading };
}
