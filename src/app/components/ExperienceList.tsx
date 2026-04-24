import { Plus, X } from 'lucide-react';
import { DragHandleDots } from './admin/DragHandleDots';
import { motion } from 'motion/react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '../lib/auth';
import { useExperience, type ExperienceItem } from '../lib/experience';
import { EditableText } from './admin/EditableText';

export function ExperienceList() {
  const { isAdmin } = useAuth();
  const { items, addItem, removeItem, reorderItems } = useExperience();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAdd = async () => {
    try {
      await addItem();
    } catch (err) {
      alert('추가 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('이 항목을 삭제할까요?')) return;
    try {
      await removeItem(id);
    } catch (err) {
      alert('삭제 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = items.findIndex((i) => i.id === active.id);
    const newIdx = items.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    try {
      await reorderItems(oldIdx, newIdx);
    } catch (err) {
      alert('순서 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const renderedItems = items.map((item) => (
    <ExperienceRow
      key={item.id}
      item={item}
      isAdmin={isAdmin}
      onRemove={() => handleRemove(item.id)}
    />
  ));

  return (
    <div className="space-y-4">
      {isAdmin ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            {renderedItems}
          </SortableContext>
        </DndContext>
      ) : (
        renderedItems
      )}
      {isAdmin && (
        <motion.button
          type="button"
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[#DDDDDD] rounded text-[#999999] hover:text-[#0057FF] hover:border-[#0057FF] transition-colors duration-200"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 400,
            fontSize: '13px',
            letterSpacing: '0.03em',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Plus size={14} />
          <span>경력 / 학력 추가</span>
        </motion.button>
      )}
    </div>
  );
}

function ExperienceRow({
  item,
  isAdmin,
  onRemove,
}: {
  item: ExperienceItem;
  isAdmin: boolean;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: !isAdmin });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 30 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/item relative border-l-2 border-[#0057FF] pl-6 py-2 flex items-start gap-3"
      {...attributes}
    >
      {isAdmin && (
        <button
          type="button"
          {...listeners}
          className="flex-shrink-0 mt-1 text-[#888888] hover:text-[#0057FF] transition-colors"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          aria-label="드래그로 순서 변경"
          title="드래그로 순서 변경"
        >
          <DragHandleDots size={18} />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <EditableText
          contentKey={`experience.${item.id}.year`}
          defaultValue={item.year}
          as="p"
          className="text-[#666666] block"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 500,
            fontSize: '14px',
          }}
        />
        <EditableText
          contentKey={`experience.${item.id}.title`}
          defaultValue={item.title}
          as="p"
          className="text-[#1A1A1A] block"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 500,
            fontSize: '16px',
          }}
        />
      </div>
      {isAdmin && (
        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 p-1.5 text-[#999999] hover:text-[#D00]"
          aria-label="삭제"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
