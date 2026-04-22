import { motion } from 'motion/react';
import { ImageIcon, Type } from 'lucide-react';
import { EditableText } from '../admin/EditableText';
import { EditableImage } from '../admin/EditableImage';
import { ExperienceList } from '../ExperienceList';
import { ProjectModules } from '../project-modules/ProjectModules';
import { useAuth } from '../../lib/auth';
import { useContent, useContentValue } from '../../lib/content';

const LAYOUT_KEY = 'about.layout.withImage';

export function AboutSection() {
  const { isAdmin } = useAuth();
  const { set } = useContent();
  const layoutFlag = useContentValue(LAYOUT_KEY, 'off');
  const withImage = layoutFlag === 'on';

  const toggleLayout = async () => {
    try {
      await set(LAYOUT_KEY, withImage ? 'off' : 'on');
    } catch (err) {
      alert('레이아웃 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const nameBioBlock = (
    <div
      className="text-[#1A1A1A] leading-relaxed"
      style={{
        fontFamily: 'Inter, Pretendard, sans-serif',
        fontWeight: 400,
        fontSize: '18px',
        lineHeight: '1.8',
      }}
    >
      <EditableText
        contentKey="about.name"
        defaultValue="심정은 / Sim Jeong Eun"
        as="div"
        className="block"
        style={{ fontWeight: 600, fontSize: '24px', marginBottom: '16px' }}
      />
      <EditableText
        contentKey="about.bio"
        defaultValue="아이디어를 현실로 구현하고, 공간으로 설계해 설득하는 디자이너입니다.\n\n공간디자인과 창업 경험을 바탕으로 기획, 실행, 협업의 전 과정을 다루며 사용자의 경험을 중심으로 한 공간을 만들어갑니다."
        as="div"
        multiline
        style={{ whiteSpace: 'pre-line' }}
      />
    </div>
  );

  return (
    <section
      id="about"
      className="relative w-full min-h-screen bg-[#FAFAFA] px-6 sm:px-10 md:px-16 lg:px-32 py-16 lg:py-24"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="mb-12 flex items-start justify-between gap-4 flex-wrap"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <EditableText
            contentKey="section.about.heading"
            defaultValue="About"
            as="h2"
            className="text-[#1A1A1A] block"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              fontSize: '48px',
              letterSpacing: '0.1em',
            }}
          />
          {isAdmin && (
            <button
              type="button"
              onClick={toggleLayout}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E5] rounded-full hover:border-[#0057FF] hover:text-[#0057FF] transition-colors duration-200 shadow-sm"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 500,
                fontSize: '12px',
                letterSpacing: '0.03em',
                alignSelf: 'center',
              }}
              title="About 이미지 레이아웃 ON/OFF"
            >
              {withImage ? <ImageIcon size={14} /> : <Type size={14} />}
              <span>{withImage ? '이미지 레이아웃' : '기본 레이아웃'}</span>
              <span
                className="inline-block w-8 h-4 rounded-full relative transition-colors"
                style={{ background: withImage ? '#0057FF' : '#CCCCCC' }}
              >
                <span
                  className="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all"
                  style={{ left: withImage ? 18 : 2 }}
                />
              </span>
            </button>
          )}
        </motion.div>

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {withImage ? (
            <div className="grid grid-cols-1 md:grid-cols-[minmax(220px,320px)_1fr] gap-8 md:gap-12 items-start">
              <div className="w-full">
                <EditableImage
                  contentKey="about.image"
                  defaultSrc=""
                  alt="본인 사진"
                  className="w-full aspect-[3/4] object-cover rounded"
                  folder="portfolio/about"
                />
              </div>
              <div>{nameBioBlock}</div>
            </div>
          ) : (
            nameBioBlock
          )}

          <div className="pt-8">
            <EditableText
              contentKey="about.experience.heading"
              defaultValue="Education & Experience"
              as="h3"
              className="text-[#1A1A1A] mb-6 block"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 600,
                fontSize: '24px',
                letterSpacing: '0.02em',
              }}
            />
            <ExperienceList />
          </div>

          <ProjectModules projectId="main-about" />
        </motion.div>
      </div>
    </section>
  );
}
