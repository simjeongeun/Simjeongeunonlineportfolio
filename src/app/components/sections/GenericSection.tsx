import { motion } from 'motion/react';
import { EditableText } from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';
import type { NavItem } from '../../lib/nav';

export function GenericSection({ item }: { item: NavItem }) {
  return (
    <section
      id={item.id}
      className="relative w-full bg-white px-6 sm:px-10 md:px-16 lg:px-32 py-16 lg:py-24 border-t border-[#EEEEEE]"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <EditableText
            contentKey={`section.${item.id}.heading`}
            defaultValue={item.label}
            as="h2"
            className="text-[#1A1A1A] block"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              fontSize: '48px',
              letterSpacing: '0.1em',
            }}
          />
        </motion.div>

        <motion.div
          className="space-y-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <EditableText
            contentKey={`section.${item.id}.body`}
            defaultValue={`${item.label} 섹션의 내용을 이곳에 작성하세요.`}
            as="div"
            multiline
            className="text-[#1A1A1A] leading-relaxed"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              fontSize: '18px',
              lineHeight: '1.8',
              letterSpacing: '0.01em',
              whiteSpace: 'pre-line',
            }}
          />

          <EditableImage
            contentKey={`section.${item.id}.image`}
            defaultSrc=""
            alt={`${item.label} 이미지`}
            className="w-full aspect-[16/9] object-cover rounded"
            folder={`portfolio/sections/${item.id}`}
          />
        </motion.div>
      </div>
    </section>
  );
}
