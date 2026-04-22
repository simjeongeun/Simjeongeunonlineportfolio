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

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  path: string;
  custom?: boolean;
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'dynamic-modular',
    title: 'Dynamic Modular Bio-Incubation Center',
    subtitle: '다이나믹 모듈러 바이오 인큐베이션 센터',
    category: 'Design Project',
    path: '/projects/dynamic-modular',
  },
  {
    id: 'osulloc',
    title: 'Green Visuals & Experiential Branding at Osulloc',
    subtitle: '오설록의 친환경 비주얼 및 체험형 브랜딩, 소비자 주의력에 대한 시선 추적 연구',
    category: 'Design Project',
    path: '/projects/osulloc',
  },
  {
    id: 'fragments',
    title: 'Fragments of Light, Movements of Emotion',
    subtitle: '빛의 조각과 감정의 흐름 주제의 호텔 리디자인',
    category: 'Design Project',
    path: '/projects/fragments',
  },
  {
    id: 'reframe',
    title: 'RE:FRAME',
    subtitle: '삶의 변화에 맞춰 해체하고 조립하는 반응형 가구',
    category: 'Design Project',
    path: '/projects/reframe',
  },
  {
    id: 'smart-refrigerator',
    title: 'Smart Refrigerator Project',
    subtitle: '학생들의 학교 생활을 위한 스마트 냉장고 디자인 프로젝트',
    category: 'Startup Project',
    path: '/projects/smart-refrigerator',
  },
  {
    id: 'aquaswarm',
    title: 'AquaSwarm',
    subtitle: '모듈형 해양 미세플라스틱 포집 솔루션',
    category: 'Startup Project',
    path: '/projects/aquaswarm',
  },
];

type ProjectsContextValue = {
  projects: Project[];
  ready: boolean;
  addProject: (partial?: Partial<Project>) => Promise<Project>;
  removeProject: (id: string) => Promise<void>;
  reorderProjects: (fromIdx: number, toIdx: number) => Promise<void>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>;
  getProject: (id: string) => Project | undefined;
};

const ProjectsContext = createContext<ProjectsContextValue | undefined>(undefined);

const COLLECTION = 'content';
const DOC_ID = 'projects-list';

function slug(base: string): string {
  const cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 7);
  return cleaned ? `${cleaned}-${suffix}` : `project-${suffix}`;
}

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
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
          const data = snap.data() as { items?: Project[] };
          if (Array.isArray(data.items) && data.items.length > 0) {
            setProjects(data.items);
            setSeeded(true);
          }
        }
        setReady(true);
      },
      (err) => {
        if (import.meta.env.DEV) console.warn('[projects] snapshot error', err);
        setReady(true);
      }
    );
    return unsubscribe;
  }, []);

  const writeRemote = async (items: Project[]) => {
    const db = getDb();
    if (!db) throw new Error('Firestore is not configured.');
    const ref = doc(db, COLLECTION, DOC_ID);
    await setDoc(ref, { items, __updatedAt: serverTimestamp() }, { merge: true });
  };

  const value = useMemo<ProjectsContextValue>(() => {
    const current = () => (seeded ? projects : [...DEFAULT_PROJECTS]);

    return {
      projects,
      ready,
      getProject: (id) => projects.find((p) => p.id === id),
      addProject: async (partial) => {
        const title = partial?.title ?? 'New Project';
        const id = partial?.id ?? slug(title);
        const created: Project = {
          id,
          title,
          subtitle: partial?.subtitle ?? '프로젝트 설명',
          category: partial?.category ?? 'Design Project',
          path: partial?.path ?? `/projects/${id}`,
          custom: true,
        };
        const next = [...current(), created];
        setProjects(next);
        setSeeded(true);
        await writeRemote(next);
        return created;
      },
      removeProject: async (id) => {
        const next = current().filter((p) => p.id !== id);
        setProjects(next);
        setSeeded(true);
        await writeRemote(next);
      },
      reorderProjects: async (fromIdx, toIdx) => {
        const next = [...current()];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        setProjects(next);
        setSeeded(true);
        await writeRemote(next);
      },
      updateProject: async (id, patch) => {
        const next = current().map((p) => (p.id === id ? { ...p, ...patch } : p));
        setProjects(next);
        setSeeded(true);
        await writeRemote(next);
      },
    };
  }, [projects, ready, seeded]);

  return <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>;
}

export function useProjects(): ProjectsContextValue {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    return {
      projects: DEFAULT_PROJECTS,
      ready: true,
      getProject: (id) => DEFAULT_PROJECTS.find((p) => p.id === id),
      addProject: async () => {
        throw new Error('ProjectsProvider not mounted');
      },
      removeProject: async () => {
        throw new Error('ProjectsProvider not mounted');
      },
      reorderProjects: async () => {
        throw new Error('ProjectsProvider not mounted');
      },
      updateProject: async () => {
        throw new Error('ProjectsProvider not mounted');
      },
    };
  }
  return ctx;
}
