import { useEffect, useMemo, useState } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { getDb } from './firebase';

export type ModuleType =
  | 'heading'
  | 'text'
  | 'image'
  | 'image-grid-2'
  | 'image-grid-3'
  | 'full-image'
  | 'image-text-2'
  | 'image-text-3'
  | 'text-image-split'
  | 'eyebrow-title'
  | 'numbered-list-3'
  | 'image-mosaic-3'
  | 'image-details-3';

export type ProjectModule = {
  id: string;
  type: ModuleType;
};

export const MODULE_LABELS: Record<ModuleType, string> = {
  heading: '제목',
  text: '텍스트',
  image: '이미지',
  'image-grid-2': '이미지 2열',
  'image-grid-3': '이미지 3열',
  'full-image': '전체 폭 이미지',
  'image-text-2': '이미지+설명 2열',
  'image-text-3': '이미지+설명 3열',
  'text-image-split': '텍스트 + 이미지 (좌우 분할)',
  'eyebrow-title': '라벨 + 큰 제목',
  'numbered-list-3': '숫자 리스트 3개 (01/02/03)',
  'image-mosaic-3': '이미지 모자이크 (7+5 / 전체)',
  'image-details-3': '이미지 카드 3열 (라벨 + 큰 제목 + 항목 리스트)',
};

export type UseProjectModulesResult = {
  modules: ProjectModule[];
  ready: boolean;
  addModule: (type: ModuleType) => Promise<ProjectModule>;
  removeModule: (id: string) => Promise<void>;
  reorderModules: (fromIdx: number, toIdx: number) => Promise<void>;
};

const COLLECTION = 'content';

function makeId(): string {
  return `m-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function useProjectModules(projectId: string): UseProjectModulesResult {
  const [modules, setModules] = useState<ProjectModule[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const db = getDb();
    if (!db) {
      setReady(true);
      return;
    }
    const ref = doc(db, COLLECTION, `project-modules-${projectId}`);
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as { modules?: ProjectModule[] };
          setModules(Array.isArray(data.modules) ? data.modules : []);
        } else {
          setModules([]);
        }
        setReady(true);
      },
      (err) => {
        if (import.meta.env.DEV) console.warn('[project-modules] snapshot error', err);
        setReady(true);
      }
    );
    return unsubscribe;
  }, [projectId]);

  return useMemo<UseProjectModulesResult>(() => {
    const writeRemote = async (next: ProjectModule[]) => {
      const db = getDb();
      if (!db) throw new Error('Firestore is not configured.');
      const ref = doc(db, COLLECTION, `project-modules-${projectId}`);
      await setDoc(ref, { modules: next, __updatedAt: serverTimestamp() }, { merge: true });
    };

    return {
      modules,
      ready,
      addModule: async (type) => {
        const created: ProjectModule = { id: makeId(), type };
        const next = [...modules, created];
        setModules(next);
        await writeRemote(next);
        return created;
      },
      removeModule: async (id) => {
        const next = modules.filter((m) => m.id !== id);
        setModules(next);
        await writeRemote(next);
      },
      reorderModules: async (fromIdx, toIdx) => {
        if (toIdx < 0 || toIdx >= modules.length) return;
        const next = [...modules];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(toIdx, 0, moved);
        setModules(next);
        await writeRemote(next);
      },
    };
  }, [modules, ready, projectId]);
}
