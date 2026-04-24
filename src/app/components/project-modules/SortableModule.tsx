import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronUp, ChevronDown, X, Check } from 'lucide-react';
import { DragHandleDots } from '../admin/DragHandleDots';
import {
  MODULE_LABELS,
  type ModuleType,
  type ProjectModule,
} from '../../lib/project-modules';

type SortableModuleProps = {
  module: ProjectModule;
  index: number;
  total: number;
  isOverlay?: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  onChangeType: (newType: ModuleType) => void;
  children: ReactNode;
};

const ALL_TYPES = Object.keys(MODULE_LABELS) as ModuleType[];

export function SortableModule({
  module,
  index,
  total,
  isOverlay = false,
  onMoveUp,
  onMoveDown,
  onRemove,
  onChangeType,
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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleDocClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleDocClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 30 : undefined,
  };

  const pickType = (t: ModuleType) => {
    setMenuOpen(false);
    if (t !== module.type) onChangeType(t);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group/module"
      {...attributes}
    >
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
          className="absolute -top-3 right-0 flex items-center gap-1 bg-white border border-[#E5E5E5] rounded-full px-2 py-1 shadow-sm opacity-0 group-hover/module:opacity-100 focus-within:opacity-100 transition-opacity duration-200"
          style={{ zIndex: 40 }}
        >
          <button
            type="button"
            {...listeners}
            className="p-1 text-[#888888] hover:text-[#0057FF] cursor-grab active:cursor-grabbing transition-colors"
            aria-label="드래그로 이동"
            title="드래그로 이동"
          >
            <DragHandleDots size={16} />
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

          {/* Clickable module type label — opens the type swap menu */}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[#0057FF] hover:bg-[#F0F5FF] transition-colors"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontSize: '11px',
                letterSpacing: '0.03em',
                fontWeight: 500,
              }}
              aria-haspopup="listbox"
              aria-expanded={menuOpen}
              title="모듈 타입 변경"
            >
              <span>{MODULE_LABELS[module.type]}</span>
              <ChevronDown size={11} />
            </button>

            {menuOpen && (
              <div
                role="listbox"
                className="absolute top-full right-0 mt-2 bg-white border border-[#E5E5E5] rounded-lg shadow-lg overflow-hidden"
                style={{
                  zIndex: 60,
                  minWidth: 260,
                  maxHeight: 320,
                  overflowY: 'auto',
                }}
              >
                <p
                  className="px-3 py-2 text-[#999999] border-b border-[#F0F0F0] bg-[#FAFAFA]"
                  style={{
                    fontFamily: 'Inter, Pretendard, sans-serif',
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                  }}
                >
                  모듈 타입 변경
                </p>
                {ALL_TYPES.map((t) => {
                  const active = t === module.type;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="option"
                      aria-selected={active}
                      onClick={() => pickType(t)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                        active
                          ? 'bg-[#F0F5FF] text-[#0057FF]'
                          : 'text-[#1A1A1A] hover:bg-[#F9F9F9]'
                      }`}
                      style={{
                        fontFamily: 'Inter, Pretendard, sans-serif',
                        fontSize: '13px',
                        fontWeight: active ? 500 : 400,
                      }}
                    >
                      <span>{MODULE_LABELS[t]}</span>
                      {active && <Check size={14} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

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
