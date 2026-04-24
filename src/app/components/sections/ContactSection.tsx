import { motion } from 'motion/react';
import { Mail, Phone } from 'lucide-react';
import { EditableText } from '../admin/EditableText';
import { useContentValue } from '../../lib/content';
import { ContactSocialLinks } from '../ContactSocialLinks';

const DEFAULT_EMAIL = 'simjeongeun@example.com';
const DEFAULT_PHONE = '+82 10-8432-5901';

export function ContactSection() {
  const email = useContentValue('contact.email', DEFAULT_EMAIL);
  const phone = useContentValue('contact.phone', DEFAULT_PHONE);
  const telHref = `tel:${phone.replace(/[^\d+]/g, '')}`;

  return (
    <section
      id="contact"
      className="relative w-full min-h-[60vh] bg-white px-6 sm:px-10 md:px-16 lg:px-32 py-16 lg:py-24"
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
      </div>
    </section>
  );
}
