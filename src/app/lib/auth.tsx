import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { initializeApp, deleteApp, getApp } from 'firebase/app';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  signOut as fbAuxSignOut,
  type User,
} from 'firebase/auth';
import { getFirebaseAuth, getMissingFirebaseEnvKeys, isFirebaseConfigured } from './firebase';

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  createAdmin: (email: string, password: string) => Promise<string>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function humanizeAuthError(err: unknown): Error {
  if (!(err instanceof Error)) return new Error(String(err));
  const code = (err as { code?: string }).code;
  const map: Record<string, string> = {
    'auth/wrong-password': '현재 비밀번호가 일치하지 않습니다.',
    'auth/invalid-credential': '현재 비밀번호가 일치하지 않습니다.',
    'auth/weak-password': '새 비밀번호는 6자 이상이어야 합니다.',
    'auth/email-already-in-use': '이미 등록된 이메일입니다.',
    'auth/invalid-email': '이메일 형식이 올바르지 않습니다.',
    'auth/requires-recent-login':
      '보안상 최근 로그인이 필요합니다. 로그아웃 후 다시 로그인해주세요.',
    'auth/operation-not-allowed':
      'Email/Password 로그인이 Firebase Console에서 비활성화되어 있습니다.',
    'auth/too-many-requests': '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  };
  if (code && map[code]) return new Error(map[code]);
  return new Error(err.message);
}

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
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
          throw humanizeAuthError(err);
        }
      },
      signOut: async () => {
        const auth = getFirebaseAuth();
        if (!auth) return;
        await fbSignOut(auth);
      },
      changePassword: async (currentPassword, newPassword) => {
        const auth = getFirebaseAuth();
        if (!auth || !auth.currentUser || !auth.currentUser.email) {
          throw new Error('로그인 상태가 아닙니다.');
        }
        try {
          const cred = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
          await reauthenticateWithCredential(auth.currentUser, cred);
          await updatePassword(auth.currentUser, newPassword);
        } catch (err) {
          throw humanizeAuthError(err);
        }
      },
      createAdmin: async (email, password) => {
        const auth = getFirebaseAuth();
        if (!auth) throw new Error('Firebase가 초기화되지 않았습니다.');
        // Use a secondary Firebase app instance so creating the new user
        // does not replace the current admin's session.
        const primaryApp = getApp();
        const SECONDARY_NAME = 'admin-creator';
        const secondaryApp = initializeApp(primaryApp.options, SECONDARY_NAME);
        const secondaryAuth = getAuth(secondaryApp);
        try {
          const result = await createUserWithEmailAndPassword(
            secondaryAuth,
            email.trim(),
            password
          );
          await fbAuxSignOut(secondaryAuth);
          return result.user.uid;
        } catch (err) {
          throw humanizeAuthError(err);
        } finally {
          try {
            await deleteApp(secondaryApp);
          } catch {
            /* ignore cleanup errors */
          }
        }
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      loading: false,
      isAdmin: false,
      signIn: async () => {
        throw new Error('AuthProvider is not mounted.');
      },
      signOut: async () => {},
      changePassword: async () => {
        throw new Error('AuthProvider is not mounted.');
      },
      createAdmin: async () => {
        throw new Error('AuthProvider is not mounted.');
      },
    };
  }
  return ctx;
}

export { isFirebaseConfigured };
