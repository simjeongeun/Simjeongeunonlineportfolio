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

export type ExperienceItem = {
  id: string;
  year: string;
  title: string;
};

export const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'exp-1',
    year: '2023 - 2026',
    title: 'Space Design Projects & Innovations',
  },
];

type ExperienceContextValue = {
  items: ExperienceItem[];
  ready: boolean;
  addItem: () => Promise<ExperienceItem>;
  removeItem: (id: string) => Promise<void>;
  updateItem: (id: string, patch: Partial<ExperienceItem>) => Promise<void>;
  reorderItems: (fromIdx: number, toIdx: number) => Promise<void>;
};

const ExperienceContext = createContext<ExperienceContextValue | undefined>(undefined);

const COLLECTION = 'content';
const DOC_ID = 'experience-list';

function makeId(): string {
  return `exp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ExperienceItem[]>(DEFAULT_EXPERIENCE);
  const [seeded, setSeeded] = useState(false);
  const [ready, setReady] = useState(false);

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
        if (snap.exists()) {
          const data = snap.data() as { items?: ExperienceItem[] };
          if (Array.isArray(data.items)) {
            setItems(data.items);
            setSeeded(true);
          }
        }
        setReady(true);
      },
      (err) => {
        if (import.meta.env.DEV) console.warn('[experience] snapshot error', err);
        setReady(true);
      }
    );
    return unsubscribe;
  }, []);

  const writeRemote = async (next: ExperienceItem[]) => {
    const db = getDb();
    if (!db) throw new Error('Firestore is not configured.');
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, { items: next, __updatedAt: serverTimestamp() }, { merge: true });
  };

  const value = useMemo<ExperienceContextValue>(() => {
    const current = () => (seeded ? items : [...DEFAULT_EXPERIENCE]);
    return {
      items,
      ready,
      addItem: async () => {
        const created: ExperienceItem = {
          id: makeId(),
          year: '2024',
          title: '새 경력 / 학력',
        };
        const next = [...current(), created];
        setItems(next);
        setSeeded(true);
        await writeRemote(next);
        return created;
      },
      removeItem: async (id) => {
        const next = current().filter((i) => i.id !== id);
        setItems(next);
        setSeeded(true);
        await writeRemote(next);
      },
      updateItem: async (id, patch) => {
        const next = current().map((i) => (i.id === id ? { ...i, ...patch } : i));
        setItems(next);
        setSeeded(true);
        await writeRemote(next);
      },
      reorderItems: async (fromIdx, toIdx) => {
        const arr = current();
        if (toIdx < 0 || toIdx >= arr.length) return;
        const next = [...arr];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        setItems(next);
        setSeeded(true);
        await writeRemote(next);
      },
    };
  }, [items, ready, seeded]);

  return <ExperienceContext.Provider value={value}>{children}</ExperienceContext.Provider>;
}

export function useExperience(): ExperienceContextValue {
  const ctx = useContext(ExperienceContext);
  if (!ctx) {
    return {
      items: DEFAULT_EXPERIENCE,
      ready: true,
      addItem: async () => {
        throw new Error('ExperienceProvider not mounted');
      },
      removeItem: async () => {
        throw new Error('ExperienceProvider not mounted');
      },
      updateItem: async () => {
        throw new Error('ExperienceProvider not mounted');
      },
      reorderItems: async () => {
        throw new Error('ExperienceProvider not mounted');
      },
    };
  }
  return ctx;
}
