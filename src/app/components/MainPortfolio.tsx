import { Fragment, useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { InteractiveArtwork } from './InteractiveArtwork';
import { motion } from 'motion/react';
import { Settings, UserCog } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useNav } from '../lib/nav';
import { EditableText } from './admin/EditableText';
import { AdminLoginModal } from './admin/AdminLoginModal';
import { AccountManagerModal } from './admin/AccountManagerModal';
import { WorkSection } from './sections/WorkSection';
import { AboutSection } from './sections/AboutSection';
import { ContactSection } from './sections/ContactSection';
import { GenericSection } from './sections/GenericSection';

export function MainPortfolio() {
  const [activeSection, setActiveSection] = useState('work');
  const [loginOpen, setLoginOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { isAdmin, signOut } = useAuth();
  const { items: navItems } = useNav();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navItems]);

  const renderSection = (id: string) => {
    switch (id) {
      case 'work':
        return <WorkSection />;
      case 'about':
        return <AboutSection />;
      case 'contact':
        return <ContactSection />;
      default: {
        const item = navItems.find((n) => n.id === id);
        if (!item) return null;
        return <GenericSection item={item} />;
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-white">
      <Navigation activeSection={activeSection} />

      {/* Hero Section */}
      <section className="relative w-full h-screen bg-white overflow-hidden">
        <InteractiveArtwork />

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

      {/* Sections rendered in nav order */}
      {navItems.map((item) => (
        <Fragment key={item.id}>{renderSection(item.id)}</Fragment>
      ))}

      {/* Footer + admin controls */}
      <footer className="relative w-full bg-white px-6 sm:px-10 md:px-16 lg:px-32 pb-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="pt-8 border-t border-[#EEEEEE]"
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
                    onClick={() => {
                      void signOut();
                    }}
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
      </footer>

      <AdminLoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <AccountManagerModal open={accountOpen} onClose={() => setAccountOpen(false)} />
    </div>
  );
}
