import type { ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, ChevronUp, ChevronDown, X } from 'lucide-react';
import { MODULE_LABELS, type ProjectModule } from '../../lib/project-modules';

type SortableModuleProps = {
  module: ProjectModule;
  index: number;
  total: number;
  isOverlay?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  children: ReactNode;
};

export function SortableModule({
  module,
  index,
  total,
  isOverlay = false,
  onMoveUp,
  onMoveDown,
  onRemove,
  children,
}: SortableModuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 30 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group/module"
      {...attributes}
    >
      {/* Drop indicator above when another item is over this one */}
      {isOver && !isDragging && (
        <div
          className="absolute -top-3 left-0 right-0 flex items-center gap-2 pointer-events-none"
          aria-hidden
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#0057FF]" />
          <span className="flex-1 h-px bg-[#0057FF]" />
          <span className="w-1.5 h-1.5 rounded-full bg-[#0057FF]" />
        </div>
      )}

      {children}

      {!isOverlay && (
        <div
          className="absolute -top-3 right-0 flex items-center gap-1 bg-white border border-[#E5E5E5] rounded-full px-2 py-1 shadow-sm opacity-0 group-hover/module:opacity-100 transition-opacity duration-200"
          style={{ zIndex: 40 }}
        >
          <button
            type="button"
            {...listeners}
            className="p-1 text-[#999999] hover:text-[#0057FF] cursor-grab active:cursor-grabbing transition-colors"
            aria-label="드래그로 이동"
            title="드래그로 이동"
          >
            <GripVertical size={14} />
          </button>
          <span className="w-px h-3 bg-[#EEEEEE] mx-1" />
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1 text-[#999999] hover:text-[#0057FF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="위로"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
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
            onClick={onRemove}
            className="p-1 text-[#999999] hover:text-[#D00] transition-colors ml-1"
            aria-label="삭제"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
