import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { firebaseConfig } from './config';

export * from './provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';

/**
 * An initialization function that returns an object containing the FirebaseApp,
 * Firestore, and Auth instances.
 *
 * This function is idempotent, meaning it will only initialize the app once,
 * even if called multiple times.
 *
 * @returns An object containing the initialized Firebase service instances.
 */
export function initializeFirebase(): {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
} {
  // Check if the app has already been initialized.
  const apps = getApps();
  const app = apps.length > 0 ? apps[0] : initializeApp(firebaseConfig);

  const firestore = getFirestore(app);
  const auth = getAuth(app);

  return { app, firestore, auth };
}
