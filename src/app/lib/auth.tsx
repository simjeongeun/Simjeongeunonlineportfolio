import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth, getMissingFirebaseEnvKeys, isFirebaseConfigured } from './firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: user !== null,
      signIn: async (email, password) => {
        const auth = getFirebaseAuth();
        if (!auth) {
          const missing = getMissingFirebaseEnvKeys();
          throw new Error(
            missing.length > 0
              ? `Firebase env 누락: ${missing.join(', ')}. Vercel에 VITE_FIREBASE_* 추가 후 캐시 없이 Redeploy 필요.`
              : 'Firebase 초기화 실패 (원인 불명, 콘솔 확인)'
          );
        }
        await signInWithEmailAndPassword(auth, email, password);
      },
      signOut: async () => {
        const auth = getFirebaseAuth();
        if (!auth) return;
        await fbSignOut(auth);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Graceful fallback if AuthProvider is missing or Firebase isn't configured.
    return {
      user: null,
      loading: false,
      isAdmin: false,
      signIn: async () => {
        throw new Error('AuthProvider is not mounted.');
      },
      signOut: async () => {},
    };
  }
  return ctx;
}

export { isFirebaseConfigured };
