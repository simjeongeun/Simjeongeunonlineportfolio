import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

function missingKeys(): string[] {
  return Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);
}

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

function ensureApp(): FirebaseApp | null {
  if (app) return app;
  const missing = missingKeys();
  if (missing.length > 0) {
    if (import.meta.env.DEV) {
      console.warn(
        `[firebase] Missing env vars: ${missing.join(', ')}. ` +
          'Copy .env.example to .env.local and fill in Firebase config.'
      );
    }
    return null;
  }
  app = getApps()[0] ?? initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (authInstance) return authInstance;
  const a = ensureApp();
  if (!a) return null;
  authInstance = getAuth(a);
  return authInstance;
}

export function getDb(): Firestore | null {
  if (dbInstance) return dbInstance;
  const a = ensureApp();
  if (!a) return null;
  dbInstance = getFirestore(a);
  return dbInstance;
}

export const isFirebaseConfigured = (): boolean => missingKeys().length === 0;
