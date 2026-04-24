import { useState } from 'react';
import {
  Plus,
  X,
  Instagram,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Mail,
  Phone,
  type LucideIcon,
} from 'lucide-react';
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
import {
  useSocialLinks,
  SOCIAL_PLATFORM_META,
  type SocialLink,
  type SocialPlatform,
} from '../lib/social-links';

const PLATFORM_ICON: Record<SocialPlatform, LucideIcon> = {
  instagram: Instagram,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  behance: Globe,
  dribbble: Globe,
  youtube: Youtube,
  website: Globe,
  email: Mail,
  phone: Phone,
};

function hrefFor(platform: SocialPlatform, url: string): string {
  if (platform === 'email') return url.startsWith('mailto:') ? url : `mailto:${url}`;
  if (platform === 'phone') return url.startsWith('tel:') ? url : `tel:${url.replace(/[^\d+]/g, '')}`;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function displayValue(platform: SocialPlatform, url: string): string {
  if (platform === 'email') return url.replace(/^mailto:/, '');
  if (platform === 'phone') return url.replace(/^tel:/, '');
  return url.replace(/^https?:\/\//, '');
}

export function ContactSocialLinks() {
  const { isAdmin } = useAuth();
  const { items, addLink, removeLink, reorderLinks } = useSocialLinks();
  const [adding, setAdding] = useState(false);
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const reset = () => {
    setAdding(false);
    setPlatform('instagram');
    setUrl('');
  };

  const submit = async () => {
    if (!url.trim()) return;
    setBusy(true);
    try {
      await addLink(platform, url.trim());
      reset();
    } catch (err) {
      alert('링크 추가 실패: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('이 링크를 삭제할까요?')) return;
    try {
      await removeLink(id);
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
      await reorderLinks(oldIdx, newIdx);
    } catch (err) {
      alert('순서 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const renderedLinks = items.map((item) => (
    <SocialLinkRow
      key={item.id}
      item={item}
      isAdmin={isAdmin}
      onRemove={() => handleRemove(item.id)}
    />
  ));

  return (
    <>
      {isAdmin ? (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">{renderedLinks}</div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="space-y-4">{renderedLinks}</div>
      )}

      {isAdmin &&
        (adding ? (
          <motion.div
            className="flex flex-wrap items-center gap-2 py-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
              className="px-3 py-2 border border-[#DDDDDD] rounded outline-none focus:border-[#0057FF]"
              style={{ fontFamily: 'Inter, Pretendard, sans-serif', fontSize: '14px' }}
            >
              {Object.entries(SOCIAL_PLATFORM_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submit();
                if (e.key === 'Escape') reset();
              }}
              placeholder={SOCIAL_PLATFORM_META[platform].placeholder}
              autoFocus
              className="flex-1 min-w-[240px] px-3 py-2 border border-[#DDDDDD] rounded outline-none focus:border-[#0057FF]"
              style={{ fontFamily: 'Inter, Pretendard, sans-serif', fontSize: '14px' }}
            />
            <button
              type="button"
              onClick={submit}
              disabled={busy || !url.trim()}
              className="px-4 py-2 bg-[#0057FF] text-white rounded-full disabled:opacity-50 transition-opacity"
              style={{ fontFamily: 'Inter, Pretendard, sans-serif', fontSize: '13px', fontWeight: 500 }}
            >
              {busy ? '추가 중…' : '추가'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 text-[#666666] rounded-full hover:bg-[#F5F5F5] transition-colors"
              style={{ fontFamily: 'Inter, Pretendard, sans-serif', fontSize: '13px' }}
            >
              취소
            </button>
          </motion.div>
        ) : (
          <motion.button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 px-4 py-2 text-[#999999] border border-dashed border-[#DDDDDD] rounded-full hover:text-[#0057FF] hover:border-[#0057FF] transition-colors duration-200 self-start"
            style={{ fontFamily: 'Inter, Pretendard, sans-serif', fontWeight: 400, fontSize: '13px' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Plus size={14} />
            <span>SNS / 링크 추가</span>
          </motion.button>
        ))}
    </>
  );
}

function SocialLinkRow({
  item,
  isAdmin,
  onRemove,
}: {
  item: SocialLink;
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

  const Icon = PLATFORM_ICON[item.platform] ?? Globe;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group/link flex items-center gap-4"
      {...attributes}
    >
      {isAdmin && (
        <button
          type="button"
          {...listeners}
          className="flex-shrink-0 text-[#888888] hover:text-[#0057FF] transition-colors"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          aria-label="드래그로 순서 변경"
          title="드래그로 순서 변경"
        >
          <DragHandleDots size={18} />
        </button>
      )}
      <Icon size={24} className="text-[#0057FF] flex-shrink-0" />
      <a
        href={hrefFor(item.platform, item.url)}
        target={item.platform === 'email' || item.platform === 'phone' ? undefined : '_blank'}
        rel={item.platform === 'email' || item.platform === 'phone' ? undefined : 'noopener noreferrer'}
        className="text-[#1A1A1A] hover:text-[#0057FF] transition-colors duration-200 truncate"
        style={{
          fontFamily: 'Inter, Pretendard, sans-serif',
          fontWeight: 400,
          fontSize: '18px',
        }}
      >
        {displayValue(item.platform, item.url)}
      </a>
      {isAdmin && (
        <button
          type="button"
          onClick={onRemove}
          className="opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 p-1.5 text-[#999999] hover:text-[#D00]"
          aria-label="링크 삭제"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
