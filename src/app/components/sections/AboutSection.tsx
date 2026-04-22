import { motion } from 'motion/react';
import { EditableText } from '../admin/EditableText';
import { ExperienceList } from '../ExperienceList';

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full min-h-screen bg-[#FAFAFA] px-6 sm:px-10 md:px-16 lg:px-32 py-16 lg:py-24"
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
        </motion.div>

        <motion.div
          className="space-y-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
