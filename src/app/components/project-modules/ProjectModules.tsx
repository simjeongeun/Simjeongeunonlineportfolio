import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { useAuth } from '../../lib/auth';
import {
  useProjectModules,
  MODULE_LABELS,
  type ModuleType,
  type ProjectModule,
} from '../../lib/project-modules';
import { ModuleRenderer } from './ModuleRenderer';
import { SortableModule } from './SortableModule';

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
  const { modules, addModule, removeModule, reorderModules, changeModuleType } =
    useProjectModules(projectId);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIdx = modules.findIndex((m) => m.id === active.id);
    const newIdx = modules.findIndex((m) => m.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    try {
      await reorderModules(oldIdx, newIdx);
    } catch (err) {
      alert('순서 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDragCancel = () => setActiveId(null);

  const activeModule: ProjectModule | null = activeId
    ? modules.find((m) => m.id === activeId) ?? null
    : null;

  const renderedList = (
    <div className="space-y-16">
      {modules.map((module, index) => {
        const moduleContent = <ModuleRenderer projectId={projectId} module={module} />;
        if (!isAdmin) {
          return (
            <div key={module.id} className="relative">
              {moduleContent}
            </div>
          );
        }
        return (
          <SortableModule
            key={module.id}
            module={module}
            index={index}
            total={modules.length}
            onMoveUp={() => handleMove(index, -1)}
            onMoveDown={() => handleMove(index, 1)}
            onRemove={() => handleRemove(module.id)}
            onChangeType={(t) =>
              changeModuleType(module.id, t).catch((err) =>
                alert('타입 변경 실패: ' + (err instanceof Error ? err.message : String(err)))
              )
            }
          >
            {moduleContent}
          </SortableModule>
        );
      })}
    </div>
  );

  return (
    <div className="mt-24">
      {isAdmin ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={modules.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            {renderedList}
          </SortableContext>
          <DragOverlay dropAnimation={null}>
            {activeModule ? (
              <div className="opacity-90 shadow-2xl bg-white rounded border border-[#E5E5E5] p-4 pointer-events-none">
                <p
                  className="text-[#0057FF] mb-2"
                  style={{
                    fontFamily: 'Inter, Pretendard, sans-serif',
                    fontWeight: 500,
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  이동 중
                </p>
                <p
                  className="text-[#1A1A1A]"
                  style={{
                    fontFamily: 'Inter, Pretendard, sans-serif',
                    fontWeight: 500,
                    fontSize: '14px',
                  }}
                >
                  {MODULE_LABELS[activeModule.type]}
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        renderedList
      )}

      {isAdmin && (
        <div className="mt-16 pt-8 border-t border-dashed border-[#DDDDDD]">
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
            모듈 추가 · 드래그해서 순서 변경
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

