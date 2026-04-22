import { Navigation } from './Navigation';
import { InteractiveArtwork } from './InteractiveArtwork';
import { motion } from 'motion/react';
import { ArrowRight, Mail, Phone, Settings, Plus, X, ChevronUp, ChevronDown, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { useContentValue } from '../lib/content';
import { useProjects, type Project } from '../lib/projects';
import { EditableText } from './admin/EditableText';
import { AdminLoginModal } from './admin/AdminLoginModal';
import { AccountManagerModal } from './admin/AccountManagerModal';
import { ExperienceList } from './ExperienceList';
import { ContactSocialLinks } from './ContactSocialLinks';
import { DynamicSections } from './DynamicSections';

const DEFAULT_EMAIL = 'simjeongeun@example.com';
const DEFAULT_PHONE = '+82 10-8432-5901';

export function MainPortfolio() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('work');
  const [loginOpen, setLoginOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { isAdmin, signOut } = useAuth();
  const { projects, addProject, removeProject, reorderProjects } = useProjects();

  const email = useContentValue('contact.email', DEFAULT_EMAIL);
  const phone = useContentValue('contact.phone', DEFAULT_PHONE);
  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  const handleAdd = async () => {
    try {
      const created = await addProject({ title: 'New Project', subtitle: '프로젝트 설명' });
      navigate(created.path);
    } catch (err) {
      alert('추가 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleRemove = async (id: string, title: string) => {
    if (!confirm(`"${title}" 프로젝트를 목록에서 삭제할까요?`)) return;
    try {
      await removeProject(id);
    } catch (err) {
      alert('삭제 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleMove = async (fromIdx: number, direction: -1 | 1) => {
    const toIdx = fromIdx + direction;
    if (toIdx < 0 || toIdx >= projects.length) return;
    try {
      await reorderProjects(fromIdx, toIdx);
    } catch (err) {
      alert('순서 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 lg:mb-20"
        >
          <EditableText
            contentKey="section.work.heading"
            defaultValue="Selected Works"
            as="h2"
            className="text-[#1A1A1A] block"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.1em',
            }}
          />
        </motion.div>

        <motion.div
          className="max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {projects.map((project, index) => (
            <ProjectRowContainer
              key={project.id}
              project={project}
              index={index}
              total={projects.length}
              isAdmin={isAdmin}
              delay={0.1 * index}
              onOpen={() => navigate(project.path)}
              onRemove={() => handleRemove(project.id, project.title)}
              onMoveUp={() => handleMove(index, -1)}
              onMoveDown={() => handleMove(index, 1)}
            />
          ))}
          {isAdmin && (
            <motion.button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-3 py-8 md:py-10 border-b border-dashed border-[#DDDDDD] text-[#999999] hover:text-[#0057FF] hover:border-[#0057FF] transition-colors duration-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                letterSpacing: '0.05em',
              }}
            >
              <Plus size={16} />
              <span>프로젝트 추가</span>
            </motion.button>
          )}
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="relative w-full min-h-screen bg-[#FAFAFA] px-6 sm:px-10 md:px-16 lg:px-32 py-16 lg:py-24">
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

      {/* Contact Section */}
      <section id="contact" className="relative w-full min-h-[60vh] bg-white px-6 sm:px-10 md:px-16 lg:px-32 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <EditableText
              contentKey="section.contact.heading"
              defaultValue="Contact"
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

            <ContactSocialLinks />
          </motion.div>

          {/* Footer */}
          <motion.div
            className="mt-24 pt-8 border-t border-[#EEEEEE]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <EditableText
              contentKey="footer.copyright"
              defaultValue="© 2026 Sim Jeong Eun. All rights reserved."
              as="p"
              className="text-[#999999] text-center block"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 300,
                fontSize: '14px',
              }}
            />

            {/* Admin Button */}
            <div className="flex justify-center mt-4 gap-2">
              {isAdmin ? (
                <>
                  <button
                    onClick={() => setAccountOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-[#1A1A1A] border border-[#DDDDDD] rounded-full hover:border-[#0057FF] hover:text-[#0057FF] transition-all duration-200"
                    style={{
                      fontFamily: 'Inter, Pretendard, sans-serif',
                      fontWeight: 500,
                      fontSize: '12px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <UserCog size={14} />
                    계정 관리
                  </button>
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
                </>
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

      <DynamicSections />

      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <AccountManagerModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}

interface ProjectRowContainerProps {
  project: Project;
  index: number;
  total: number;
  isAdmin: boolean;
  delay: number;
  onOpen: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function ProjectRowContainer({
  project,
  index,
  total,
  isAdmin,
  delay,
  onOpen,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ProjectRowContainerProps) {
  const k = `projects.${project.id}`;
  return (
    <motion.div
      className="group relative cursor-pointer border-b border-[#EEEEEE] py-6 md:py-8 px-2 md:px-6 transition-all duration-300 hover:bg-[#F9F9F9]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      onClick={isAdmin ? undefined : onOpen}
    >
      <div className="flex items-center justify-between gap-4 md:gap-8">
        <div className="flex-1 min-w-0">
          <EditableText
            contentKey={`${k}.category`}
            defaultValue={project.category}
            as="p"
            className="text-[#999999] mb-1 md:mb-2"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 400,
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          />
          <EditableText
            contentKey={`${k}.title`}
            defaultValue={project.title}
            as="h3"
            className="text-[#1A1A1A] mb-1 md:mb-2 text-[16px] md:text-[20px] lg:text-[24px]"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.01em',
            }}
          />
          <EditableText
            contentKey={`${k}.subtitle`}
            defaultValue={project.subtitle}
            as="p"
            className="text-[#666666] text-[12px] md:text-[14px]"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontWeight: 300,
              letterSpacing: '0.02em',
            }}
          />
        </div>

        <div className="flex-shrink-0 flex items-center gap-2 md:gap-3">
          {isAdmin ? (
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={onMoveUp}
                disabled={index === 0}
                className="p-1.5 text-[#999999] hover:text-[#0057FF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="위로 이동"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                onClick={onMoveDown}
                disabled={index === total - 1}
                className="p-1.5 text-[#999999] hover:text-[#0057FF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="아래로 이동"
              >
                <ChevronDown size={16} />
              </button>
              <button
                type="button"
                onClick={onOpen}
                className="px-3 py-1.5 text-[#1A1A1A] border border-[#DDDDDD] rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all duration-200"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 500,
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                }}
              >
                Open
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="p-1.5 text-[#999999] hover:text-[#D00] transition-colors"
                aria-label="삭제"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-3 text-[#1A1A1A] opacity-60 group-hover:opacity-100 transition-opacity duration-300">
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
          )}
        </div>
      </div>
    </motion.div>
  );
}