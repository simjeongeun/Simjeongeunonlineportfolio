import { motion } from 'motion/react';
import { ArrowLeft, ImagePlus, Type } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ReactNode } from 'react';
import { EditableText } from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';
import { useContent, useContentValue } from '../../lib/content';
import { useAuth } from '../../lib/auth';
import { ProjectModules } from '../project-modules/ProjectModules';

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
  const { isAdmin } = useAuth();
  const { set } = useContent();
  const k = (field: string) => `projects.${projectId}.${field}`;

  const defaultLayout = heroImage ? 'hero' : 'plain';
  const layoutStyle = useContentValue(k('layout.style'), defaultLayout);
  const useHeroLayout = layoutStyle === 'hero';

  const toggleLayout = async () => {
    try {
      await set(k('layout.style'), useHeroLayout ? 'plain' : 'hero');
    } catch (err) {
      alert('레이아웃 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

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

      {/* Admin: Layout toggle */}
      {isAdmin && (
        <div className="fixed top-4 right-4 md:top-12 md:right-12 z-50">
          <button
            type="button"
            onClick={toggleLayout}
            className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-white/90 backdrop-blur-sm border border-[#E5E5E5] rounded-full hover:border-[#0057FF] hover:text-[#0057FF] transition-colors duration-200 shadow-sm"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 500,
              fontSize: '12px',
              letterSpacing: '0.03em',
            }}
            title="히어로 이미지 스타일 ON/OFF"
          >
            {useHeroLayout ? <ImagePlus size={14} /> : <Type size={14} />}
            <span>{useHeroLayout ? '히어로 스타일' : '기본 스타일'}</span>
            <span
              className="inline-block w-8 h-4 rounded-full relative transition-colors"
              style={{ background: useHeroLayout ? '#0057FF' : '#CCCCCC' }}
            >
              <span
                className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                style={{ left: useHeroLayout ? 18 : 2 }}
              />
            </span>
          </button>
        </div>
      )}

      {/* Hero Image + Title (shown when hero layout selected) */}
      {useHeroLayout && (
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

          {!useHeroLayout && (
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

        <ProjectModules projectId={projectId} />
      </div>
    </motion.div>
  );
}
