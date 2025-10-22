'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseContextValue {
  app: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  app: null,
  firestore: null,
  auth: null,
});

/**
 * A React Provider that makes Firebase service instances available to its
 * children.
 *
 * This provider should be wrapped by a client-side component that handles
 * the initialization of Firebase.
 *
 * @param app - The initialized FirebaseApp instance.
 * @param firestore - The initialized Firestore instance.
 * @param auth - The initialized Auth instance.
 */
export function FirebaseProvider({
  children,
  app,
  firestore,
  auth,
}: {
  children: ReactNode;
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}) {
  return (
    <FirebaseContext.Provider value={{ app, firestore, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
}

/**
 * A hook that returns the full Firebase context, including the FirebaseApp,
 * Firestore, and Auth instances.
 *
 * This hook is useful for advanced cases where you need direct access to the
 * Firebase service instances. For most common scenarios, consider using the
 * more specific hooks like `useFirestore` or `useAuth`.
 *
 * @returns The Firebase context value.
 */
export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
}

/**
 * A hook that returns the initialized FirebaseApp instance.
 * Throws an error if used outside of a `FirebaseProvider`.
 *
 * @returns The FirebaseApp instance, or null if not yet initialized.
 */
export function useFirebaseApp() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebaseApp must be used within a FirebaseProvider');
  }
  return context.app;
}

/**
 * A hook that returns the initialized Firestore instance.
 * Throws an error if used outside of a `FirebaseProvider`.
 *
 * @returns The Firestore instance, or null if not yet initialized.
 */
export function useFirestore() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  return context.firestore;
}

/**
 * A hook that returns the initialized Auth instance.
 * Throws an error if used outside of a `FirebaseProvider`.
 *
 * @returns The Auth instance, or null if not yet initialized.
 */
export function useAuth() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context.auth;
}
