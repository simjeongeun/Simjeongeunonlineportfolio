import { ProjectDetailTemplate } from './ProjectDetailTemplate';
import { motion } from 'motion/react';
import { useEffect } from 'react';

const SectionTitle = ({ children }: { children: string }) => (
  <motion.h2
    className="text-[#1A1A1A] mb-6"
    style={{
      fontFamily: 'Inter, Pretendard, sans-serif',
      fontWeight: 600,
      fontSize: '13px',
      letterSpacing: '0.15em',
      textTransform: 'uppercase' as const,
    }}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.h2>
);

const Placeholder = ({ ratio = '4/3', className = '' }: { ratio?: string; className?: string }) => (
  <div className={`bg-[#F5F5F5] ${className}`} style={{ aspectRatio: ratio }} />
);

export function FragmentsProject() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <ProjectDetailTemplate
      projectId="fragments"
      title="Fragments of Light, Movements of Emotion"
      subtitle="빛의 조각과 감정의 흐름 주제의 호텔 리디자인"
      category="Design Project"
      year="2024"
      description="A hotel redesign project centered on the theme of light fragments and emotional flows, creating immersive spatial experiences that evoke feelings through carefully orchestrated lighting and material choices."
    >
      {/* Background & Target */}
      <section className="mb-32">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-0 lg:gap-16">
          <div className="lg:col-span-4 flex flex-col">
            <SectionTitle>Background</SectionTitle>
            <div className="w-full h-px bg-[#E0E0E0] mb-10" />
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <Placeholder ratio="1/1" className="max-w-[240px] mx-auto mb-8" />
              <div className="space-y-3">
                <div className="h-3 bg-[#F0F0F0] rounded w-full" />
                <div className="h-3 bg-[#F0F0F0] rounded w-5/6" />
                <div className="h-3 bg-[#F0F0F0] rounded w-4/6" />
              </div>
              <div className="w-12 h-px bg-[#5bc0cc] mt-8" />
            </motion.div>
          </div>
          <div className="lg:col-span-6 flex flex-col mt-12 lg:mt-0">
            <SectionTitle>Target</SectionTitle>
            <div className="w-full h-px bg-[#E0E0E0] mb-10" />
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0">
              <motion.div className="flex items-center justify-center border-r border-[#E0E0E0] pr-6" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                <Placeholder ratio="1/1" className="w-full max-w-[220px]" />
              </motion.div>
              <div className="md:col-span-2 flex flex-col divide-y divide-[#E0E0E0]">
                {[1, 2, 3].map((i) => (
                  <motion.div key={i} className="grid grid-cols-[120px_1fr] gap-4 py-6 first:pt-0 last:pb-0" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}>
                    <div className="flex flex-col justify-center pl-6">
                      <span className="text-[#5bc0cc] mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '11px', letterSpacing: '0.1em' }}>0{i}</span>
                      <div className="h-4 bg-[#F0F0F0] rounded w-20" />
                    </div>
                    <div className="flex items-center">
                      <div className="space-y-2 w-full">
                        <div className="h-3 bg-[#F0F0F0] rounded w-full" />
                        <div className="h-3 bg-[#F0F0F0] rounded w-4/5" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Concept */}
      <section className="mb-32">
        <SectionTitle>Concept</SectionTitle>
        <div className="w-full h-px bg-[#E0E0E0] mb-12" />
        <motion.div className="mb-16" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          <p className="text-[#5bc0cc] mb-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '12px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Core Concept</p>
          <div className="h-8 bg-[#F0F0F0] rounded w-72" />
        </motion.div>
        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
          <Placeholder ratio="4/3" />
          <Placeholder ratio="4/3" />
        </motion.div>
      </section>

      {/* Spatial Design */}
      <section className="mb-32">
        <SectionTitle>Spatial Design</SectionTitle>
        <div className="w-full h-px bg-[#E0E0E0] mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <motion.div key={i} className="flex flex-col" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}>
              <Placeholder ratio="1/0.85" className="mb-6" />
              <div className="h-4 bg-[#F0F0F0] rounded w-32 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-[#F0F0F0] rounded w-full" />
                <div className="h-3 bg-[#F0F0F0] rounded w-4/5" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Floor Plans */}
      <section className="mb-32">
        <SectionTitle>Floor Plans</SectionTitle>
        <div className="w-full h-px bg-[#E0E0E0] mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <motion.div key={i} className="flex flex-col" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }}>
              <Placeholder ratio="1/1" className="mb-6" />
              <span className="text-[#5bc0cc] mb-1" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Floor</span>
              <div className="h-6 bg-[#F0F0F0] rounded w-12 mb-4" />
              <div className="w-8 h-px bg-[#E0E0E0] mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-[#F0F0F0] rounded w-32" />
                <div className="h-3 bg-[#F0F0F0] rounded w-28" />
                <div className="h-3 bg-[#F0F0F0] rounded w-36" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3D Renders */}
      <section className="mb-32">
        <SectionTitle>3D Renders</SectionTitle>
        <div className="w-full h-px bg-[#E0E0E0] mb-12" />
        <div className="grid grid-cols-12 gap-4">
          <motion.div className="col-span-12 md:col-span-7 overflow-hidden" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
            <Placeholder ratio="16/10" />
          </motion.div>
          <motion.div className="col-span-12 md:col-span-5 overflow-hidden" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
            <Placeholder ratio="16/10" />
          </motion.div>
          <motion.div className="col-span-12 overflow-hidden" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
            <Placeholder ratio="21/9" />
          </motion.div>
        </div>
      </section>
    </ProjectDetailTemplate>
  );
}
