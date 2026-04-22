import { Plus, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/auth';
import { useExperience } from '../lib/experience';
import { EditableText } from './admin/EditableText';

export function ExperienceList() {
  const { isAdmin } = useAuth();
  const { items, addItem, removeItem } = useExperience();

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

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="group/item relative border-l-2 border-[#0057FF] pl-6 py-2">
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
          {isAdmin && (
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="absolute top-1/2 right-0 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200 p-1.5 text-[#999999] hover:text-[#D00]"
              aria-label="삭제"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}
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
