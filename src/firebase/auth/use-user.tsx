'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '../provider';

/**
 * A React hook that provides the current authenticated user.
 *
 * This hook manages the user's authentication state, returning the user object
 * when logged in and `null` when logged out. It also provides a `loading`
 * state to handle the initial authentication check.
 *
 * @returns An object containing the `user` and a `loading` boolean.
 *
 * @example
 * ```tsx
 * function UserProfile() {
 *   const { user, loading } = useUser();
 *
 *   if (loading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (!user) {
 *     return <div>Please sign in.</div>;
 *   }
 *
 *   return <div>Welcome, {user.displayName}!</div>;
 * }
 * ```
 */
export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
}
