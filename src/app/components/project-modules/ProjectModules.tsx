import { ChevronUp, ChevronDown, X, Plus } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import {
  useProjectModules,
  MODULE_LABELS,
  type ModuleType,
} from '../../lib/project-modules';
import { ModuleRenderer } from './ModuleRenderer';

type ProjectModulesProps = {
  projectId: string;
};

const PALETTE: ModuleType[] = [
  'heading',
  'eyebrow-title',
  'text',
  'image',
  'full-image',
  'image-grid-2',
  'image-grid-3',
  'image-mosaic-3',
  'image-text-2',
  'image-text-3',
  'image-details-3',
  'text-image-split',
  'numbered-list-3',
];

export function ProjectModules({ projectId }: ProjectModulesProps) {
  const { isAdmin } = useAuth();
  const { modules, addModule, removeModule, reorderModules } = useProjectModules(projectId);

  if (!isAdmin && modules.length === 0) return null;

  const handleAdd = async (type: ModuleType) => {
    try {
      await addModule(type);
    } catch (err) {
      alert('모듈 추가 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('이 모듈을 삭제할까요?')) return;
    try {
      await removeModule(id);
    } catch (err) {
      alert('삭제 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleMove = async (fromIdx: number, direction: -1 | 1) => {
    try {
      await reorderModules(fromIdx, fromIdx + direction);
    } catch (err) {
      alert('순서 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="mt-24 space-y-16">
      {modules.map((module, index) => (
        <div key={module.id} className="relative group/module">
          <ModuleRenderer projectId={projectId} module={module} />
          {isAdmin && (
            <div
              className="absolute -top-3 right-0 flex items-center gap-1 bg-white border border-[#E5E5E5] rounded-full px-2 py-1 shadow-sm opacity-0 group-hover/module:opacity-100 transition-opacity duration-200"
              style={{ zIndex: 40 }}
            >
              <button
                type="button"
                onClick={() => handleMove(index, -1)}
                disabled={index === 0}
                className="p-1 text-[#999999] hover:text-[#0057FF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="위로"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, 1)}
                disabled={index === modules.length - 1}
                className="p-1 text-[#999999] hover:text-[#0057FF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="아래로"
              >
                <ChevronDown size={14} />
              </button>
              <span className="w-px h-3 bg-[#EEEEEE] mx-1" />
              <span
                className="text-[#999999]"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.03em',
                }}
              >
                {MODULE_LABELS[module.type]}
              </span>
              <button
                type="button"
                onClick={() => handleRemove(module.id)}
                className="p-1 text-[#999999] hover:text-[#D00] transition-colors ml-1"
                aria-label="삭제"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      ))}

      {isAdmin && (
        <div className="pt-8 border-t border-dashed border-[#DDDDDD]">
          <p
            className="text-[#999999] mb-4"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            모듈 추가
          </p>
          <div className="flex flex-wrap gap-2">
            {PALETTE.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleAdd(type)}
                className="flex items-center gap-1.5 px-4 py-2 text-[#1A1A1A] border border-[#DDDDDD] rounded-full hover:border-[#0057FF] hover:text-[#0057FF] transition-colors duration-200"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 400,
                  fontSize: '13px',
                  letterSpacing: '0.02em',
                }}
              >
                <Plus size={14} />
                <span>{MODULE_LABELS[type]}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
