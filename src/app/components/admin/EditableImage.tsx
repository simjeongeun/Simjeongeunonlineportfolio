import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ChevronDown, Check, Upload, Trash2, Ruler } from 'lucide-react';
import { useAuth } from '../../lib/auth';
import { useContent } from '../../lib/content';
import { uploadToCloudinary } from '../../lib/cloudinary-upload';

type EditableImageProps = {
  contentKey: string;
  defaultSrc: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  folder?: string;
};

const ASPECT_OPTIONS: { key: string; label: string; value: string | undefined }[] = [
  { key: 'auto', label: '자동 / 기본', value: undefined },
  { key: '1-1', label: '1:1 (정사각)', value: '1 / 1' },
  { key: '4-3', label: '4:3', value: '4 / 3' },
  { key: '3-2', label: '3:2', value: '3 / 2' },
  { key: '16-9', label: '16:9 (와이드)', value: '16 / 9' },
  { key: '21-9', label: '21:9 (파노라마)', value: '21 / 9' },
  { key: '3-4', label: '3:4 (세로)', value: '3 / 4' },
  { key: '9-16', label: '9:16 (폰 세로)', value: '9 / 16' },
];

function extractObjectFit(className?: string): CSSProperties['objectFit'] {
  if (!className) return undefined;
  const m = className.match(/\bobject-(contain|cover|fill|none|scale-down)\b/);
  return m ? (m[1] as CSSProperties['objectFit']) : undefined;
}

function extractObjectPosition(className?: string): string | undefined {
  if (!className) return undefined;
  const positions = [
    'left-top',
    'right-top',
    'left-bottom',
    'right-bottom',
    'top',
    'bottom',
    'left',
    'right',
    'center',
  ];
  for (const p of positions) {
    const re = new RegExp(`\\bobject-${p}\\b`);
    if (re.test(className)) return p.replace('-', ' ');
  }
  return undefined;
}

export function EditableImage({
  contentKey,
  defaultSrc,
  alt,
  className,
  style,
  folder = 'portfolio/uploads',
}: EditableImageProps) {
  const { isAdmin } = useAuth();
  const { get, set } = useContent();
  const current = get(contentKey, defaultSrc);
  const storedAspect = get(`${contentKey}.aspect`, '');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [aspectMenuOpen, setAspectMenuOpen] = useState(false);
  const aspectMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!aspectMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (aspectMenuRef.current && !aspectMenuRef.current.contains(e.target as Node)) {
        setAspectMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [aspectMenuOpen]);

  const pickFile = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, { folder });
      await set(contentKey, result.secureUrl);
    } catch (err) {
      console.error('[EditableImage] upload failed', err);
      alert('이미지 업로드 실패: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!confirm('이미지를 제거할까요? (Cloudinary에 업로드된 원본은 남아있고 이 자리에서만 치워집니다.)')) return;
    try {
      await set(contentKey, '');
    } catch (err) {
      alert('이미지 제거 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const pickAspect = async (value: string | undefined) => {
    setAspectMenuOpen(false);
    try {
      await set(`${contentKey}.aspect`, value ?? '');
    } catch (err) {
      alert('비율 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const hasImage = current.length > 0;
  const aspectOverride = storedAspect.length > 0 ? storedAspect : undefined;
  const currentAspectKey = ASPECT_OPTIONS.find((o) => (o.value ?? '') === (aspectOverride ?? ''))?.key ?? 'auto';
  const currentAspectLabel =
    ASPECT_OPTIONS.find((o) => o.key === currentAspectKey)?.label ?? '자동 / 기본';

  const mergedStyle: CSSProperties = {
    ...style,
    ...(aspectOverride ? { aspectRatio: aspectOverride } : {}),
  };

  if (!isAdmin) {
    if (!hasImage) return null;
    return <img src={current} alt={alt} className={className} style={mergedStyle} />;
  }

  const objectFit = extractObjectFit(className);
  const objectPosition = extractObjectPosition(className);

  return (
    <div
      className={className}
      style={{
        ...mergedStyle,
        position: 'relative',
        outline: '1px dashed rgba(0, 87, 255, 0.4)',
        outlineOffset: '2px',
      }}
    >
      {hasImage ? (
        <img
          src={current}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit,
            objectPosition,
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            minHeight: 120,
            background:
              'repeating-linear-gradient(45deg, #F5F5F5, #F5F5F5 10px, #FAFAFA 10px, #FAFAFA 20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999999',
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontSize: 13,
            letterSpacing: '0.05em',
          }}
        >
          이미지 없음 — 아래 버튼으로 업로드
        </div>
      )}

      <div
        className="absolute bottom-2 right-2 flex items-center gap-1 bg-white/95 backdrop-blur-sm border border-[#E5E5E5] rounded-full px-1.5 py-1 shadow-md"
        style={{ zIndex: 50 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div ref={aspectMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setAspectMenuOpen((v) => !v)}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[#1A1A1A] hover:bg-[#F0F5FF] hover:text-[#0057FF] transition-colors"
            style={{
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontSize: 11,
              fontWeight: 500,
            }}
            title="이미지 비율"
          >
            <Ruler size={12} />
            <span>{currentAspectLabel}</span>
            <ChevronDown size={11} />
          </button>
          {aspectMenuOpen && (
            <div
              className="absolute bottom-full right-0 mb-2 bg-white border border-[#E5E5E5] rounded-lg shadow-lg overflow-hidden"
              style={{ zIndex: 60, minWidth: 180 }}
              role="listbox"
            >
              {ASPECT_OPTIONS.map((opt) => {
                const active = opt.key === currentAspectKey;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => pickAspect(opt.value)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors ${
                      active
                        ? 'bg-[#F0F5FF] text-[#0057FF]'
                        : 'text-[#1A1A1A] hover:bg-[#F9F9F9]'
                    }`}
                    style={{
                      fontFamily: 'Inter, Pretendard, sans-serif',
                      fontSize: 12,
                      fontWeight: active ? 500 : 400,
                    }}
                  >
                    <span>{opt.label}</span>
                    {active && <Check size={12} />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <span className="w-px h-4 bg-[#EEEEEE]" />

        <button
          type="button"
          onClick={pickFile}
          disabled={uploading}
          className="flex items-center gap-1 px-2 py-1 rounded-full text-white transition-colors"
          style={{
            background: '#0057FF',
            fontFamily: 'Inter, Pretendard, sans-serif',
            fontSize: 11,
            fontWeight: 500,
            cursor: uploading ? 'wait' : 'pointer',
            opacity: uploading ? 0.7 : 1,
          }}
          title="이미지 업로드 / 교체"
        >
          <Upload size={12} />
          <span>{uploading ? '업로드 중…' : hasImage ? '교체' : '업로드'}</span>
        </button>

        {hasImage && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={uploading}
            className="flex items-center px-2 py-1 rounded-full text-[#999999] hover:text-[#D00] hover:bg-[#FFF0F0] transition-colors"
            title="이미지 제거"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: 'none' }}
      />
    </div>
  );
}
