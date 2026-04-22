import { Navigation } from './Navigation';
import { InteractiveArtwork } from './InteractiveArtwork';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Phone, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useContentValue } from '../lib/content';
import { EditableText } from './admin/EditableText';
import { AdminLoginModal } from './admin/AdminLoginModal';

const DEFAULT_EMAIL = 'simjeongeun@example.com';
const DEFAULT_PHONE = '+82 10-8432-5901';

export function MainPortfolio() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('work');
  const [loginOpen, setLoginOpen] = useState(false);
  const { isAdmin, signOut } = useAuth();

  const email = useContentValue('contact.email', DEFAULT_EMAIL);
  const phone = useContentValue('contact.phone', DEFAULT_PHONE);
  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  const projects = [
    {
      title: 'Dynamic Modular Bio-Incubation Center',
      subtitle: '다이나믹 모듈러 바이오 인큐베이션 센터',
      category: 'Design Project',
      path: '/projects/dynamic-modular',
    },
    {
      title: 'Green Visuals & Experiential Branding at Osulloc',
      subtitle: '오설록의 친환경 비주얼 및 체험형 브랜딩, 소비자 주의력에 대한 시선 추적 연구',
      category: 'Design Project',
      path: '/projects/osulloc',
    },
    {
      title: 'Fragments of Light, Movements of Emotion',
      subtitle: '빛의 조각과 감정의 흐름 주제의 호텔 리디자인',
      category: 'Design Project',
      path: '/projects/fragments',
    },
    {
      title: 'RE:FRAME',
      subtitle: '삶의 변화에 맞춰 해체하고 조립하는 반응형 가구',
      category: 'Design Project',
      path: '/projects/reframe',
    },
    {
      title: 'Smart Refrigerator Project',
      subtitle: '학생들의 학교 생활을 위한 스마트 냉장고 디자인 프로젝트',
      category: 'Startup Project',
      path: '/projects/smart-refrigerator',
    },
    {
      title: 'AquaSwarm',
      subtitle: '모듈형 해양 미세플라스틱 포집 솔루션',
      category: 'Startup Project',
      path: '/projects/aquaswarm',
    },
  ];

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['work', 'about', 'contact'];
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-white">
      {/* Navigation Bar */}
      <Navigation activeSection={activeSection} />

      {/* Hero Section - Cover with 3D Glass Sphere */}
      <section className="relative w-full h-screen bg-white overflow-hidden">
        {/* Interactive Particle Artwork */}
        <InteractiveArtwork />

        {/* Portfolio Text - Left Aligned */}
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 left-6 sm:left-10 md:left-16 lg:left-32 z-10"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p 
            className="text-[#1A1A1A] text-left"
            style={{ 
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 800,
              letterSpacing: '0.08em',
            }}
          >
            <EditableText
              contentKey="hero.title"
              defaultValue="PORTFOLIO"
              as="span"
              className="block text-[48px] sm:text-[64px] md:text-[80px] lg:text-[112px]"
            />
          </p>
        </motion.div>

        {/* Name - Bottom Right */}
        <motion.div 
          className="absolute right-6 sm:right-10 md:right-16 bottom-12 z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <EditableText
            contentKey="hero.name"
            defaultValue="SIM JEONG EUN"
            as="h1"
            className="text-[#1A1A1A] whitespace-nowrap"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              fontSize: '24px',
              letterSpacing: '0.2em',
              lineHeight: 1,
            }}
          />
        </motion.div>
      </section>

      {/* Work Section - Projects Gallery */}
      <section id="work" className="relative w-full min-h-screen bg-white px-6 sm:px-10 md:px-16 lg:px-32 py-16 lg:py-24">
        <motion.h2
          className="text-[#1A1A1A] mb-12 lg:mb-20"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 300,
            letterSpacing: '0.1em',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Selected Works
        </motion.h2>

        <motion.div
          className="max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {projects.map((project, index) => (
            <ProjectRow
              key={index}
              title={project.title}
              subtitle={project.subtitle}
              category={project.category}
              delay={0.1 * index}
              onClick={() => navigate(project.path)}
            />
          ))}
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="relative w-full min-h-screen bg-[#FAFAFA] px-6 sm:px-10 md:px-16 lg:px-32 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-[#1A1A1A] mb-12"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              fontSize: '48px',
              letterSpacing: '0.1em',
            }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            About
          </motion.h2>

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
              <h3
                className="text-[#1A1A1A] mb-6"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 600,
                  fontSize: '24px',
                  letterSpacing: '0.02em',
                }}
              >
                Education & Experience
              </h3>
              
              <div className="space-y-4">
                <div className="border-l-2 border-[#0057FF] pl-6 py-2">
                  <EditableText
                    contentKey="about.experience.year"
                    defaultValue="2023 - 2026"
                    as="p"
                    className="text-[#666666]"
                    style={{
                      fontFamily: 'Inter, Pretendard, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                    }}
                  />
                  <EditableText
                    contentKey="about.experience.title"
                    defaultValue="Space Design Projects & Innovations"
                    as="p"
                    className="text-[#1A1A1A]"
                    style={{
                      fontFamily: 'Inter, Pretendard, sans-serif',
                      fontWeight: 500,
                      fontSize: '16px',
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative w-full min-h-[60vh] bg-white px-6 sm:px-10 md:px-16 lg:px-32 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-[#1A1A1A] mb-12"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              fontSize: '48px',
              letterSpacing: '0.1em',
            }}
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Contact
          </motion.h2>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4">
              <Mail size={24} className="text-[#0057FF]" />
              <a
                href={`mailto:${email}`}
                className="text-[#1A1A1A] hover:text-[#0057FF] transition-colors duration-200"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 400,
                  fontSize: '18px',
                }}
              >
                <EditableText
                  contentKey="contact.email"
                  defaultValue={DEFAULT_EMAIL}
                  as="span"
                />
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Phone size={24} className="text-[#0057FF]" />
              <a
                href={telHref}
                className="text-[#1A1A1A] hover:text-[#0057FF] transition-colors duration-200"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 400,
                  fontSize: '18px',
                }}
              >
                <EditableText
                  contentKey="contact.phone"
                  defaultValue={DEFAULT_PHONE}
                  as="span"
                />
              </a>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-24 pt-8 border-t border-[#EEEEEE]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <p
              className="text-[#999999] text-center"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 300,
                fontSize: '14px',
              }}
            >
              © 2026 Sim Jeong Eun. All rights reserved.
            </p>

            {/* Admin Button */}
            <div className="flex justify-center mt-4">
              {isAdmin ? (
                <button
                  onClick={() => { void signOut(); }}
                  className="flex items-center gap-2 px-4 py-2 text-[#0057FF] border border-[#0057FF] rounded-full hover:bg-[#0057FF] hover:text-white transition-all duration-200"
                  style={{
                    fontFamily: 'Inter, Pretendard, sans-serif',
                    fontWeight: 500,
                    fontSize: '12px',
                    letterSpacing: '0.05em',
                  }}
                >
                  <Settings size={14} />
                  관리자 모드 해제
                </button>
              ) : (
                <button
                  onClick={() => setLoginOpen(true)}
                  className="text-[#CCCCCC] hover:text-[#999999] transition-colors duration-200"
                  style={{
                    fontFamily: 'Inter, Pretendard, sans-serif',
                    fontWeight: 300,
                    fontSize: '12px',
                  }}
                  aria-label="관리자 로그인"
                >
                  <Settings size={14} />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

interface ProjectRowProps {
  title: string;
  subtitle: string;
  category: string;
  delay: number;
  onClick: () => void;
}

function ProjectRow({ title, subtitle, category, delay, onClick }: ProjectRowProps) {
  return (
    <motion.div
      className="group cursor-pointer border-b border-[#EEEEEE] py-6 md:py-8 px-2 md:px-6 transition-all duration-300 hover:bg-[#F9F9F9]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4 md:gap-8">
        {/* Left: Project Info */}
        <div className="flex-1 min-w-0">
          {/* Category */}
          <p
            className="text-[#999999] mb-1 md:mb-2"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {category}
          </p>

          {/* Title */}
          <h3
            className="text-[#1A1A1A] mb-1 md:mb-2 text-[16px] md:text-[20px] lg:text-[24px]"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.01em',
            }}
          >
            {title}
          </h3>

          {/* Subtitle */}
          <p
            className="text-[#666666] text-[12px] md:text-[14px]"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.02em',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Right: View Project Button */}
        <div className="flex-shrink-0 flex items-center gap-2 md:gap-3 text-[#1A1A1A] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 500,
              fontSize: '14px',
              letterSpacing: '0.05em',
            }}
          >
            View Project
          </span>
          <ArrowRight 
            className="transition-transform duration-300 group-hover:translate-x-1" 
            size={20} 
          />
        </div>
      </div>
    </motion.div>
  );
}