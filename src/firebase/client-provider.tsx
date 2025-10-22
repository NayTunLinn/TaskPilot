'use client';

import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

// Initialize Firebase on the client
const { app, firestore, auth } = initializeFirebase();

/**
 * A client-side provider that initializes Firebase and wraps the main
 * FirebaseProvider. This ensures that Firebase is initialized only once.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider app={app} firestore={firestore} auth={auth}>
      {children}
    </FirebaseProvider>
  );
}
