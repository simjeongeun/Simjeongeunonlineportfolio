import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from './firebase';
import { useAuth } from './auth';

type AdminsContextValue = {
  emails: string[];
  ready: boolean;
  addEmail: (email: string) => Promise<void>;
  removeEmail: (email: string) => Promise<void>;
  isAllowed: (email: string | null | undefined) => boolean;
};

const AdminsContext = createContext<AdminsContextValue | undefined>(undefined);

const COLLECTION = 'content';
const DOC_ID = 'admins';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function AdminsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [emails, setEmails] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [docExists, setDocExists] = useState<boolean>(false);

  useEffect(() => {
    const db = getDb();
    if (!db) {
      setReady(true);
      return;
    }
    const ref = doc(db, COLLECTION, DOC_ID);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        setDocExists(snap.exists());
        if (snap.exists()) {
          const data = snap.data() as { emails?: string[] };
          setEmails(Array.isArray(data.emails) ? data.emails.map(normalizeEmail) : []);
        } else {
          setEmails([]);
        }
        setReady(true);
      },
      (err) => {
        if (import.meta.env.DEV) console.warn('[admins] snapshot error', err);
        setReady(true);
      }
    );
    return unsubscribe;
  }, []);

  // Bootstrap: when a signed-in user visits and no admin list exists yet,
  // seed the list with their own email so they stay in control.
  useEffect(() => {
    if (!ready) return;
    if (!user?.email) return;
    if (docExists) return;
    const db = getDb();
    if (!db) return;
    const ref = doc(db, COLLECTION, DOC_ID);
    const seed = normalizeEmail(user.email);
    setDoc(ref, { emails: [seed], __updatedAt: serverTimestamp() }, { merge: true })
      .then(() => {
        setEmails([seed]);
        setDocExists(true);
      })
      .catch((err) => {
        if (import.meta.env.DEV) console.warn('[admins] bootstrap failed', err);
      });
  }, [ready, user?.email, docExists]);

  const value = useMemo<AdminsContextValue>(() => {
    const writeRemote = async (next: string[]) => {
      const db = getDb();
      if (!db) throw new Error('Firestore is not configured.');
      const ref = doc(db, COLLECTION, DOC_ID);
      await setDoc(
        ref,
        { emails: next, __updatedAt: serverTimestamp() },
        { merge: true }
      );
    };

    return {
      emails,
      ready,
      addEmail: async (email) => {
        const n = normalizeEmail(email);
        if (!n) throw new Error('이메일이 비어있습니다.');
        if (emails.includes(n)) return;
        const next = [...emails, n];
        setEmails(next);
        await writeRemote(next);
      },
      removeEmail: async (email) => {
        const n = normalizeEmail(email);
        const next = emails.filter((e) => e !== n);
        setEmails(next);
        await writeRemote(next);
      },
      isAllowed: (email) => {
        if (!email) return false;
        return emails.includes(normalizeEmail(email));
      },
    };
  }, [emails, ready]);

  return <AdminsContext.Provider value={value}>{children}</AdminsContext.Provider>;
}

export function useAdmins(): AdminsContextValue {
  const ctx = useContext(AdminsContext);
  if (!ctx) {
    return {
      emails: [],
      ready: true,
      addEmail: async () => {
        throw new Error('AdminsProvider not mounted');
      },
      removeEmail: async () => {
        throw new Error('AdminsProvider not mounted');
      },
      isAllowed: () => false,
    };
  }
  return ctx;
}
