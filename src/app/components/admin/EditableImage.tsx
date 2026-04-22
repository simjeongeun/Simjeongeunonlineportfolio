import { useRef, useState, type CSSProperties } from 'react';
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
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

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

  if (!isAdmin) {
    return <img src={current} alt={alt} className={className} style={style} />;
  }

  const objectFit = extractObjectFit(className);
  const objectPosition = extractObjectPosition(className);

  return (
    <div
      className={className}
      style={{
        ...style,
        position: 'relative',
        outline: '1px dashed rgba(0, 87, 255, 0.4)',
        outlineOffset: '2px',
      }}
    >
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
      <button
        type="button"
        onClick={pickFile}
        disabled={uploading}
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          zIndex: 50,
          padding: '6px 12px',
          background: '#0057FF',
          color: 'white',
          border: 'none',
          borderRadius: 999,
          fontSize: 12,
          cursor: uploading ? 'wait' : 'pointer',
          opacity: uploading ? 0.7 : 1,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
          fontFamily: 'Inter, Pretendard, sans-serif',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        {uploading ? '업로드 중…' : '이미지 변경'}
      </button>
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
