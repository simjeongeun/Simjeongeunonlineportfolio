import { useState, useEffect } from 'react';
import { Menu, X, Plus, GripVertical } from 'lucide-react';
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
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditableText } from './admin/EditableText';
import { useAuth } from '../lib/auth';
import { useNav, type NavItem } from '../lib/nav';

interface NavigationProps {
  activeSection?: string;
}

type NavItemButtonProps = {
  item: NavItem;
  activeSection: string;
  isAdmin: boolean;
  onScroll: (id: string) => void;
  onRemove: (id: string, label: string, e: React.MouseEvent) => void;
  size?: 'desktop' | 'mobile';
};

function NavItemButton({
  item,
  activeSection,
  isAdmin,
  onScroll,
  onRemove,
  size = 'desktop',
}: NavItemButtonProps) {
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
    cursor: isAdmin ? 'grab' : 'pointer',
    touchAction: isAdmin ? 'none' : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group/item flex items-center gap-1.5"
      {...attributes}
      {...listeners}
    >
      {isAdmin && (
        <span
          className="text-[#BBBBBB] group-hover/item:text-[#0057FF] transition-colors duration-200"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          aria-hidden
          title="드래그로 순서 변경"
        >
          <GripVertical size={size === 'mobile' ? 16 : 14} />
        </span>
      )}
      <button
        onClick={() => onScroll(item.id)}
        className="relative group"
      >
        <EditableText
          contentKey={`nav.${item.id}.label`}
          defaultValue={item.label}
          as="span"
          className="transition-colors duration-200 group-hover:text-[#0057FF]"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 500,
            fontSize: size === 'mobile' ? '16px' : '15px',
            color: activeSection === item.id ? '#0057FF' : '#1A1A1A',
          }}
        />
        {activeSection === item.id && size === 'desktop' && (
          <span
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#0057FF',
            }}
          />
        )}
      </button>
      {isAdmin && (
        <button
          type="button"
          onClick={(e) => onRemove(item.id, item.label, e)}
          onPointerDown={(e) => e.stopPropagation()}
          className="opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 p-1 text-[#CCCCCC] hover:text-[#D00]"
          aria-label={`${item.label} 삭제`}
        >
          <X size={size === 'mobile' ? 14 : 12} />
        </button>
      )}
    </div>
  );
}

export function Navigation({ activeSection = 'work' }: NavigationProps) {
  const [, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin } = useAuth();
  const { items: menuItems, addItem, removeItem, reorderItems } = useNav();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const handleAdd = async () => {
    const label = window.prompt('새 메뉴 이름을 입력하세요', 'New Section');
    if (label === null) return;
    try {
      await addItem(label);
    } catch (err) {
      alert('메뉴 추가 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleRemove = async (id: string, label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`"${label}" 메뉴를 삭제할까요?`)) return;
    try {
      await removeItem(id);
    } catch (err) {
      alert('메뉴 삭제 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = menuItems.findIndex((i) => i.id === active.id);
    const newIdx = menuItems.findIndex((i) => i.id === over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    try {
      await reorderItems(oldIdx, newIdx);
    } catch (err) {
      alert('순서 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const desktopItems = (
    <SortableContext items={menuItems.map((i) => i.id)} strategy={horizontalListSortingStrategy}>
      {menuItems.map((item) => (
        <NavItemButton
          key={item.id}
          item={item}
          activeSection={activeSection}
          isAdmin={isAdmin}
          onScroll={scrollToSection}
          onRemove={handleRemove}
          size="desktop"
        />
      ))}
    </SortableContext>
  );

  const mobileItems = (
    <SortableContext items={menuItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
      {menuItems.map((item) => (
        <NavItemButton
          key={item.id}
          item={item}
          activeSection={activeSection}
          isAdmin={isAdmin}
          onScroll={scrollToSection}
          onRemove={handleRemove}
          size="mobile"
        />
      ))}
    </SortableContext>
  );

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        height: '80px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid #EEEEEE',
      }}
    >
      <div className="h-full flex items-center justify-between px-6 sm:px-10 md:px-16 lg:px-[120px]">
        <div />

        <div className="hidden md:flex items-center gap-10 lg:gap-12">
          {isAdmin ? (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              {desktopItems}
            </DndContext>
          ) : (
            menuItems.map((item) => (
              <NavItemButton
                key={item.id}
                item={item}
                activeSection={activeSection}
                isAdmin={false}
                onScroll={scrollToSection}
                onRemove={handleRemove}
                size="desktop"
              />
            ))
          )}
          {isAdmin && (
            <button
              type="button"
              onClick={handleAdd}
              className="flex items-center gap-1 px-3 py-1 text-[#999999] border border-dashed border-[#DDDDDD] rounded-full hover:text-[#0057FF] hover:border-[#0057FF] transition-colors duration-200"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 400,
                fontSize: '12px',
                letterSpacing: '0.03em',
              }}
              aria-label="메뉴 추가"
            >
              <Plus size={12} />
              <span>추가</span>
            </button>
          )}
        </div>

        <button
          className="md:hidden text-[#1A1A1A] p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[80px] left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#EEEEEE]">
          <div className="flex flex-col items-center py-6 gap-6">
            {isAdmin ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                {mobileItems}
              </DndContext>
            ) : (
              menuItems.map((item) => (
                <NavItemButton
                  key={item.id}
                  item={item}
                  activeSection={activeSection}
                  isAdmin={false}
                  onScroll={scrollToSection}
                  onRemove={handleRemove}
                  size="mobile"
                />
              ))
            )}
            {isAdmin && (
              <button
                type="button"
                onClick={handleAdd}
                className="flex items-center gap-1 px-3 py-1 text-[#999999] border border-dashed border-[#DDDDDD] rounded-full hover:text-[#0057FF] hover:border-[#0057FF] transition-colors duration-200"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 400,
                  fontSize: '13px',
                }}
              >
                <Plus size={14} />
                <span>메뉴 추가</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
