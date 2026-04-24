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

export type NavItem = {
  id: string;
  label: string;
};

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

type NavContextValue = {
  items: NavItem[];
  ready: boolean;
  addItem: (label?: string) => Promise<NavItem>;
  removeItem: (id: string) => Promise<void>;
  updateItem: (id: string, patch: Partial<NavItem>) => Promise<void>;
  reorderItems: (fromIdx: number, toIdx: number) => Promise<void>;
};

const NavContext = createContext<NavContextValue | undefined>(undefined);

const COLLECTION = 'content';
const DOC_ID = 'nav-items';

function slug(base: string): string {
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 30);
  const suffix = Math.random().toString(36).slice(2, 6);
  return cleaned ? `${cleaned}-${suffix}` : `nav-${suffix}`;
}

export function NavProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<NavItem[]>(DEFAULT_NAV_ITEMS);
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
          const data = snap.data() as { items?: NavItem[] };
          if (Array.isArray(data.items) && data.items.length > 0) {
            setItems(data.items);
            setSeeded(true);
          }
        }
        setReady(true);
      },
      (err) => {
        if (import.meta.env.DEV) console.warn('[nav] snapshot error', err);
        setReady(true);
      }
    );
    return unsubscribe;
  }, []);

  const writeRemote = async (next: NavItem[]) => {
    const db = getDb();
    if (!db) throw new Error('Firestore is not configured.');
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, { items: next, __updatedAt: serverTimestamp() }, { merge: true });
  };

  const value = useMemo<NavContextValue>(() => {
    const current = () => (seeded ? items : [...DEFAULT_NAV_ITEMS]);

    return {
      items,
      ready,
      addItem: async (label) => {
        const finalLabel = label && label.trim().length > 0 ? label.trim() : 'New Section';
        const created: NavItem = { id: slug(finalLabel), label: finalLabel };
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

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): NavContextValue {
  const ctx = useContext(NavContext);
  if (!ctx) {
    return {
      items: DEFAULT_NAV_ITEMS,
      ready: true,
      addItem: async () => {
        throw new Error('NavProvider not mounted');
      },
      removeItem: async () => {
        throw new Error('NavProvider not mounted');
      },
      updateItem: async () => {
        throw new Error('NavProvider not mounted');
      },
      reorderItems: async () => {
        throw new Error('NavProvider not mounted');
      },
    };
  }
  return ctx;
}
