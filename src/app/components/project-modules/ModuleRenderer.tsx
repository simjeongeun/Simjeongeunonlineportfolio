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

    case 'image-text-2':
    case 'image-text-3': {
      const count = module.type === 'image-text-2' ? 2 : 3;
      return (
        <motion.div
          className={`grid grid-cols-1 md:grid-cols-${count} gap-8 md:gap-10`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
            <div key={n} className="flex flex-col">
              <div className="mb-6">
                <EditableImage
                  contentKey={k(`image-${n}`)}
                  defaultSrc=""
                  alt=""
                  className="w-full aspect-[1/0.85] object-cover"
                  folder={folder}
                />
              </div>
              <EditableText
                contentKey={k(`title-${n}`)}
                defaultValue={`항목 ${n}`}
                as="h3"
                className="text-[#1A1A1A] mb-3 block"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  letterSpacing: '0.01em',
                }}
              />
              <EditableText
                contentKey={k(`body-${n}`)}
                defaultValue="설명을 입력하세요."
                as="p"
                multiline
                className="text-[#666666]"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 300,
                  fontSize: '13px',
                  lineHeight: '1.8',
                  whiteSpace: 'pre-line',
                }}
              />
            </div>
          ))}
        </motion.div>
      );
    }

    case 'eyebrow-title':
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <EditableText
            contentKey={k('eyebrow')}
            defaultValue="Core Concept"
            as="p"
            className="text-[#5bc0cc] mb-4 block"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 500,
              fontSize: '12px',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          />
          <EditableText
            contentKey={k('title')}
            defaultValue="큰 제목을 입력하세요"
            as="h3"
            className="text-[#1A1A1A] block"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 600,
              fontSize: '32px',
              lineHeight: '1.3',
              letterSpacing: '-0.01em',
            }}
          />
        </motion.div>
      );

    case 'numbered-list-3':
      return (
        <motion.div
          className="flex flex-col divide-y divide-[#E0E0E0]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="grid grid-cols-[120px_1fr] gap-4 py-6 first:pt-0 last:pb-0"
            >
              <div className="flex flex-col justify-center pl-6">
                <EditableText
                  contentKey={k(`number-${n}`)}
                  defaultValue={`0${n}`}
                  as="span"
                  className="text-[#5bc0cc] mb-2 block"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    fontSize: '11px',
                    letterSpacing: '0.1em',
                  }}
                />
                <EditableText
                  contentKey={k(`label-${n}`)}
                  defaultValue={`항목 ${n}`}
                  as="h3"
                  className="text-[#1A1A1A] block"
                  style={{
                    fontFamily: 'Inter, Pretendard, sans-serif',
                    fontWeight: 600,
                    fontSize: '15px',
                    letterSpacing: '0.01em',
                  }}
                />
              </div>
              <div className="flex items-center">
                <EditableText
                  contentKey={k(`desc-${n}`)}
                  defaultValue="설명을 입력하세요."
                  as="p"
                  multiline
                  className="text-[#666666]"
                  style={{
                    fontFamily: 'Inter, Pretendard, sans-serif',
                    fontWeight: 300,
                    fontSize: '13px',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-line',
                  }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      );

    case 'image-mosaic-3':
      return (
        <motion.div
          className="grid grid-cols-12 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="col-span-12 md:col-span-7 overflow-hidden">
            <EditableImage
              contentKey={k('image-1')}
              defaultSrc=""
              alt=""
              className="w-full h-full object-cover aspect-[16/10]"
              folder={folder}
            />
          </div>
          <div className="col-span-12 md:col-span-5 overflow-hidden">
            <EditableImage
              contentKey={k('image-2')}
              defaultSrc=""
              alt=""
              className="w-full h-full object-cover aspect-[16/10]"
              folder={folder}
            />
          </div>
          <div className="col-span-12 overflow-hidden">
            <EditableImage
              contentKey={k('image-3')}
              defaultSrc=""
              alt=""
              className="w-full object-cover aspect-[21/9]"
              folder={folder}
            />
          </div>
        </motion.div>
      );

    case 'text-image-split':
      return (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="flex flex-col">
            <EditableText
              contentKey={k('title')}
              defaultValue="소제목"
              as="h3"
              className="text-[#1A1A1A] mb-4 block"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
              }}
            />
            <EditableText
              contentKey={k('body')}
              defaultValue="여기에 설명을 입력하세요. 이 블록은 왼쪽에 텍스트, 오른쪽에 이미지가 배치됩니다."
              as="div"
              multiline
              className="text-[#666666]"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 300,
                fontSize: '15px',
                lineHeight: '1.9',
                letterSpacing: '0.01em',
                whiteSpace: 'pre-line',
              }}
            />
          </div>
          <EditableImage
            contentKey={k('image')}
            defaultSrc=""
            alt=""
            className="w-full aspect-[4/3] object-cover"
            folder={folder}
          />
        </motion.div>
      );

    default:
      return null;
  }
}
