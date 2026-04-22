import { useState } from 'react';
import {
  Plus,
  X,
  Instagram,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Mail,
  Phone,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../lib/auth';
import {
  useSocialLinks,
  SOCIAL_PLATFORM_META,
  type SocialPlatform,
} from '../lib/social-links';

const PLATFORM_ICON: Record<SocialPlatform, LucideIcon> = {
  instagram: Instagram,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  behance: Globe,
  dribbble: Globe,
  youtube: Youtube,
  website: Globe,
  email: Mail,
  phone: Phone,
};

function hrefFor(platform: SocialPlatform, url: string): string {
  if (platform === 'email') return url.startsWith('mailto:') ? url : `mailto:${url}`;
  if (platform === 'phone') return url.startsWith('tel:') ? url : `tel:${url.replace(/[^\d+]/g, '')}`;
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function displayValue(platform: SocialPlatform, url: string): string {
  if (platform === 'email') return url.replace(/^mailto:/, '');
  if (platform === 'phone') return url.replace(/^tel:/, '');
  return url.replace(/^https?:\/\//, '');
}

export function ContactSocialLinks() {
  const { isAdmin } = useAuth();
  const { items, addLink, removeLink } = useSocialLinks();
  const [adding, setAdding] = useState(false);
  const [platform, setPlatform] = useState<SocialPlatform>('instagram');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setAdding(false);
    setPlatform('instagram');
    setUrl('');
  };

  const submit = async () => {
    if (!url.trim()) return;
    setBusy(true);
    try {
      await addLink(platform, url.trim());
      reset();
    } catch (err) {
      alert('링크 추가 실패: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('이 링크를 삭제할까요?')) return;
    try {
      await removeLink(id);
    } catch (err) {
      alert('삭제 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <>
      {items.map((item) => {
        const Icon = PLATFORM_ICON[item.platform] ?? Globe;
        return (
          <div key={item.id} className="group/link flex items-center gap-4">
            <Icon size={24} className="text-[#0057FF] flex-shrink-0" />
            <a
              href={hrefFor(item.platform, item.url)}
              target={item.platform === 'email' || item.platform === 'phone' ? undefined : '_blank'}
              rel={item.platform === 'email' || item.platform === 'phone' ? undefined : 'noopener noreferrer'}
              className="text-[#1A1A1A] hover:text-[#0057FF] transition-colors duration-200 truncate"
              style={{
                fontFamily: 'Inter, Pretendard, sans-serif',
                fontWeight: 400,
                fontSize: '18px',
              }}
            >
              {displayValue(item.platform, item.url)}
            </a>
            {isAdmin && (
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="opacity-0 group-hover/link:opacity-100 transition-opacity duration-200 p-1.5 text-[#999999] hover:text-[#D00]"
                aria-label="링크 삭제"
              >
                <X size={16} />
              </button>
            )}
          </div>
        );
      })}

      {isAdmin && (adding ? (
        <motion.div
          className="flex flex-wrap items-center gap-2 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as SocialPlatform)}
            className="px-3 py-2 border border-[#DDDDDD] rounded outline-none focus:border-[#0057FF]"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontSize: '14px',
            }}
          >
            {Object.entries(SOCIAL_PLATFORM_META).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
              if (e.key === 'Escape') reset();
            }}
            placeholder={SOCIAL_PLATFORM_META[platform].placeholder}
            autoFocus
            className="flex-1 min-w-[240px] px-3 py-2 border border-[#DDDDDD] rounded outline-none focus:border-[#0057FF]"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontSize: '14px',
            }}
          />
          <button
            type="button"
            onClick={submit}
            disabled={busy || !url.trim()}
            className="px-4 py-2 bg-[#0057FF] text-white rounded-full disabled:opacity-50 transition-opacity"
            style={{ fontFamily: 'Inter, Pretendard, sans-serif', fontSize: '13px', fontWeight: 500 }}
          >
            {busy ? '추가 중…' : '추가'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2 text-[#666666] rounded-full hover:bg-[#F5F5F5] transition-colors"
            style={{ fontFamily: 'Inter, Pretendard, sans-serif', fontSize: '13px' }}
          >
            취소
          </button>
        </motion.div>
      ) : (
        <motion.button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2 text-[#999999] border border-dashed border-[#DDDDDD] rounded-full hover:text-[#0057FF] hover:border-[#0057FF] transition-colors duration-200 self-start"
          style={{
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontWeight: 400,
            fontSize: '13px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Plus size={14} />
          <span>SNS / 링크 추가</span>
        </motion.button>
      ))}
    </>
  );
}
