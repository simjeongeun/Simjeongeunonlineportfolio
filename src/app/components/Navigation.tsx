import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  activeSection?: string;
}

export function Navigation({ activeSection = 'work' }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  };

  const menuItems = [
    { label: 'Work', id: 'work' },
    { label: 'About', id: 'about' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        height: '80px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderBottom: '1px solid #EEEEEE',
      }}
    >
      <div 
        className="h-full flex items-center justify-between px-6 sm:px-10 md:px-16 lg:px-[120px]"
      >
        {/* Left Side - Name */}
        <div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="relative group"
            >
              <span 
                className="transition-colors duration-200 group-hover:text-[#0057FF]"
                style={{
                  fontFamily: 'Inter, Pretendard, sans-serif',
                  fontWeight: 500,
                  fontSize: '15px',
                  color: activeSection === item.id ? '#0057FF' : '#1A1A1A',
                }}
              >
                {item.label}
              </span>
              {activeSection === item.id && (
                <span 
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#0057FF',
                  }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#1A1A1A] p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute top-[80px] left-0 right-0 bg-white/95 backdrop-blur-md border-b border-[#EEEEEE]"
        >
          <div className="flex flex-col items-center py-6 gap-6">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="relative"
              >
                <span
                  className="transition-colors duration-200"
                  style={{
                    fontFamily: 'Inter, Pretendard, sans-serif',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: activeSection === item.id ? '#0057FF' : '#1A1A1A',
                  }}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}