import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ReactNode } from 'react';
import { EditableText } from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';
import { useContentValue } from '../../lib/content';

interface ProjectDetailTemplateProps {
  projectId: string;
  title: string;
  subtitle: string;
  category: string;
  year?: string;
  location?: string;
  area?: string;
  description?: string;
  heroImage?: string;
  children?: ReactNode;
}

export function ProjectDetailTemplate({
  projectId,
  title,
  subtitle,
  category,
  description,
  heroImage,
  children,
}: ProjectDetailTemplateProps) {
  const navigate = useNavigate();
  const k = (field: string) => `projects.${projectId}.${field}`;
  const effectiveHero = useContentValue(k('hero.image'), heroImage ?? '');

  return (
    <motion.div
      className="relative w-full min-h-screen bg-white"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {/* Back Button */}
      <div className="fixed top-4 left-4 md:top-12 md:left-12 z-50">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-white/80 backdrop-blur-sm border border-[#EEEEEE] rounded-full hover:bg-[#F9F9F9] transition-all duration-300 cursor-pointer"
        >
          <ArrowLeft
            className="transition-transform duration-300 group-hover:-translate-x-1"
            size={18}
          />
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              letterSpacing: '0.05em',
            }}
          >
            Back to List
          </span>
        </button>
      </div>

      {/* Hero Image + Title */}
      {effectiveHero && (
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <div className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden relative">
            <EditableImage
              contentKey={k('hero.image')}
              defaultSrc={heroImage ?? ''}
              alt={title}
              className="w-full h-full object-cover"
              folder={`portfolio/${projectId}`}
            />
            <div className="absolute bottom-6 left-4 pointer-events-none">
              <EditableText
                contentKey={k('title')}
                defaultValue={title}
                as="h1"
                className="text-white text-[22px] sm:text-[28px] md:text-[36px] lg:text-[42px] text-left pointer-events-auto"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="px-6 sm:px-10 md:px-16 lg:px-32 py-16 md:py-24">
        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <EditableText
            contentKey={k('category')}
            defaultValue={category}
            as="p"
            className="text-[#999999] mb-4"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          />

          {!effectiveHero && (
            <EditableText
              contentKey={k('title')}
              defaultValue={title}
              as="h1"
              className="text-[#1A1A1A] mb-4 text-[28px] sm:text-[36px] md:text-[48px] lg:text-[56px]"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.01em',
              }}
            />
          )}

          <EditableText
            contentKey={k('subtitle')}
            defaultValue={subtitle}
            as="p"
            className="text-[#666666] mb-12 text-[16px] md:text-[20px]"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.02em',
            }}
          />

          <div className="mt-12 max-w-3xl">
            <EditableText
              contentKey={k('description')}
              defaultValue={description ?? ''}
              as="div"
              multiline
              className="text-[#1A1A1A] leading-relaxed"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 300,
                fontSize: '18px',
                letterSpacing: '0.01em',
                lineHeight: '1.8',
                whiteSpace: 'pre-line',
              }}
            />
          </div>
        </motion.div>

        {/* Custom Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
