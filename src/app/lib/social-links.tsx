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

export type SocialPlatform =
  | 'instagram'
  | 'github'
  | 'linkedin'
  | 'twitter'
  | 'behance'
  | 'dribbble'
  | 'youtube'
  | 'website'
  | 'email'
  | 'phone';

export type SocialLink = {
  id: string;
  platform: SocialPlatform;
  url: string;
};

export const SOCIAL_PLATFORM_META: Record<SocialPlatform, { label: string; placeholder: string }> = {
  instagram: { label: 'Instagram', placeholder: 'https://instagram.com/username' },
  github: { label: 'GitHub', placeholder: 'https://github.com/username' },
  linkedin: { label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
  twitter: { label: 'Twitter / X', placeholder: 'https://twitter.com/username' },
  behance: { label: 'Behance', placeholder: 'https://behance.net/username' },
  dribbble: { label: 'Dribbble', placeholder: 'https://dribbble.com/username' },
  youtube: { label: 'YouTube', placeholder: 'https://youtube.com/@username' },
  website: { label: 'Website', placeholder: 'https://example.com' },
  email: { label: 'Email', placeholder: 'you@example.com' },
  phone: { label: 'Phone', placeholder: '+82 10-0000-0000' },
};

export const DEFAULT_SOCIAL_LINKS: SocialLink[] = [];

type SocialLinksContextValue = {
  items: SocialLink[];
  ready: boolean;
  addLink: (platform: SocialPlatform, url: string) => Promise<SocialLink>;
  removeLink: (id: string) => Promise<void>;
  updateLink: (id: string, patch: Partial<SocialLink>) => Promise<void>;
  reorderLinks: (fromIdx: number, toIdx: number) => Promise<void>;
};

const SocialLinksContext = createContext<SocialLinksContextValue | undefined>(undefined);

const COLLECTION = 'content';
const DOC_ID = 'social-links';

function makeId(): string {
  return `sl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

export function SocialLinksProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SocialLink[]>(DEFAULT_SOCIAL_LINKS);
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
          const data = snap.data() as { items?: SocialLink[] };
          if (Array.isArray(data.items)) {
            setItems(data.items);
            setSeeded(true);
          }
        }
        setReady(true);
      },
      (err) => {
        if (import.meta.env.DEV) console.warn('[social-links] snapshot error', err);
        setReady(true);
      }
    );
    return unsubscribe;
  }, []);

  const writeRemote = async (next: SocialLink[]) => {
    const db = getDb();
    if (!db) throw new Error('Firestore is not configured.');
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, { items: next, __updatedAt: serverTimestamp() }, { merge: true });
  };

  const value = useMemo<SocialLinksContextValue>(() => {
    const current = () => (seeded ? items : [...DEFAULT_SOCIAL_LINKS]);
    return {
      items,
      ready,
      addLink: async (platform, url) => {
        const created: SocialLink = { id: makeId(), platform, url };
        const next = [...current(), created];
        setItems(next);
        setSeeded(true);
        await writeRemote(next);
        return created;
      },
      removeLink: async (id) => {
        const next = current().filter((i) => i.id !== id);
        setItems(next);
        setSeeded(true);
        await writeRemote(next);
      },
      updateLink: async (id, patch) => {
        const next = current().map((i) => (i.id === id ? { ...i, ...patch } : i));
        setItems(next);
        setSeeded(true);
        await writeRemote(next);
      },
      reorderLinks: async (fromIdx, toIdx) => {
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

  return <SocialLinksContext.Provider value={value}>{children}</SocialLinksContext.Provider>;
}

export function useSocialLinks(): SocialLinksContextValue {
  const ctx = useContext(SocialLinksContext);
  if (!ctx) {
    return {
      items: DEFAULT_SOCIAL_LINKS,
      ready: true,
      addLink: async () => {
        throw new Error('SocialLinksProvider not mounted');
      },
      removeLink: async () => {
        throw new Error('SocialLinksProvider not mounted');
      },
      updateLink: async () => {
        throw new Error('SocialLinksProvider not mounted');
      },
      reorderLinks: async () => {
        throw new Error('SocialLinksProvider not mounted');
      },
    };
  }
  return ctx;
}
