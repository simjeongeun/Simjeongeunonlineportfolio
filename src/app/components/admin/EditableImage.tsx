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

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      <img
        src={current}
        alt={alt}
        className={className}
        style={{
          ...style,
          outline: '1px dashed rgba(0, 87, 255, 0.4)',
          outlineOffset: '2px',
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
          padding: '6px 12px',
          background: '#0057FF',
          color: 'white',
          border: 'none',
          borderRadius: 999,
          fontSize: 12,
          cursor: uploading ? 'wait' : 'pointer',
          opacity: uploading ? 0.7 : 1,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          fontFamily: 'Inter, Pretendard, sans-serif',
          fontWeight: 500,
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
