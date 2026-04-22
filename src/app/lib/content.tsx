import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  doc,
  onSnapshot,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { getDb } from './firebase';

type ContentMap = Record<string, string>;

type ContentContextValue = {
  content: ContentMap;
  ready: boolean;
  get: (key: string, fallback: string) => string;
  set: (key: string, value: string) => Promise<void>;
  setMany: (updates: ContentMap) => Promise<void>;
};

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

const COLLECTION = 'content';
const DOC_ID = 'site';

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<ContentMap>({});
  const [ready, setReady] = useState(false);
  const pendingRef = useRef<ContentMap>({});

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
        const data = snap.exists() ? (snap.data() as ContentMap) : {};
        setContent(data);
        setReady(true);
      },
      (err) => {
        if (import.meta.env.DEV) console.warn('[content] snapshot error', err);
        setReady(true);
      }
    );
    return unsubscribe;
  }, []);

  const value = useMemo<ContentContextValue>(() => {
    const writeRemote = async (updates: ContentMap) => {
      const db = getDb();
      if (!db) throw new Error('Firestore is not configured.');
      const ref = doc(db, COLLECTION, DOC_ID);
      await setDoc(
        ref,
        { ...updates, __updatedAt: serverTimestamp() },
        { merge: true }
      );
    };

    return {
      content,
      ready,
      get: (key, fallback) => {
        const v = content[key];
        return typeof v === 'string' && v.length > 0 ? v : fallback;
      },
      set: async (key, v) => {
        pendingRef.current[key] = v;
        setContent((prev) => ({ ...prev, [key]: v }));
        await writeRemote({ [key]: v });
      },
      setMany: async (updates) => {
        setContent((prev) => ({ ...prev, ...updates }));
        await writeRemote(updates);
      },
    };
  }, [content, ready]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    return {
      content: {},
      ready: true,
      get: (_key, fallback) => fallback,
      set: async () => {
        throw new Error('ContentProvider is not mounted.');
      },
      setMany: async () => {
        throw new Error('ContentProvider is not mounted.');
      },
    };
  }
  return ctx;
}

export function useContentValue(key: string, fallback: string): string {
  const { get } = useContent();
  return get(key, fallback);
}
