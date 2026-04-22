import { motion } from 'motion/react';
import { EditableText } from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';
import type { ProjectModule } from '../../lib/project-modules';

type ModuleRendererProps = {
  projectId: string;
  module: ProjectModule;
};

export function ModuleRenderer({ projectId, module }: ModuleRendererProps) {
  const k = (suffix: string) => `projects.${projectId}.modules.${module.id}.${suffix}`;
  const folder = `portfolio/${projectId}/modules/${module.id}`;

  switch (module.type) {
    case 'heading':
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <EditableText
            contentKey={k('title')}
            defaultValue="새 섹션 제목"
            as="h2"
            className="text-[#1A1A1A] mb-6 block"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          />
          <div className="w-full h-px bg-[#E0E0E0] mb-8" />
        </motion.div>
      );

    case 'text':
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <EditableText
            contentKey={k('body')}
            defaultValue="여기에 내용을 작성하세요. 여러 줄을 사용하려면 Shift+Enter를 쓰거나 편집 모드에서 Ctrl+Enter로 저장하세요."
            as="div"
            multiline
            className="text-[#1A1A1A] max-w-3xl"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              fontSize: '16px',
              lineHeight: '1.9',
              letterSpacing: '0.01em',
              whiteSpace: 'pre-line',
            }}
          />
        </motion.div>
      );

    case 'image':
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <EditableImage
            contentKey={k('image')}
            defaultSrc=""
            alt=""
            className="w-full max-w-4xl mx-auto aspect-[4/3] object-cover"
            folder={folder}
          />
          <EditableText
            contentKey={k('caption')}
            defaultValue=""
            as="p"
            className="text-[#999999] mt-4 text-center block"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          />
        </motion.div>
      );

    case 'image-grid-2':
      return (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {[1, 2].map((n) => (
            <div key={n}>
              <EditableImage
                contentKey={k(`image-${n}`)}
                defaultSrc=""
                alt=""
                className="w-full aspect-[4/3] object-cover"
                folder={folder}
              />
              <EditableText
                contentKey={k(`caption-${n}`)}
                defaultValue=""
                as="p"
                className="text-[#999999] mt-3 block"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                }}
              />
            </div>
          ))}
        </motion.div>
      );

    case 'image-grid-3':
      return (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {[1, 2, 3].map((n) => (
            <div key={n}>
              <EditableImage
                contentKey={k(`image-${n}`)}
                defaultSrc=""
                alt=""
                className="w-full aspect-square object-cover"
                folder={folder}
              />
              <EditableText
                contentKey={k(`caption-${n}`)}
                defaultValue=""
                as="p"
                className="text-[#999999] mt-3 block"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 400,
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                }}
              />
            </div>
          ))}
        </motion.div>
      );

    case 'full-image':
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <EditableImage
            contentKey={k('image')}
            defaultSrc=""
            alt=""
            className="w-full aspect-[21/9] object-cover"
            folder={folder}
          />
        </motion.div>
      );

    default:
      return null;
  }
}
