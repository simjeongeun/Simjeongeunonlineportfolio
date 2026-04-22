import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Check, Upload, Trash2, Move, RotateCcw } from 'lucide-react';
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

const ASPECT_PRESETS: { label: string; value: string | undefined }[] = [
  { label: 'Auto', value: undefined },
  { label: '1:1', value: '1 / 1' },
  { label: '4:3', value: '4 / 3' },
  { label: '3:2', value: '3 / 2' },
  { label: '16:9', value: '16 / 9' },
  { label: '21:9', value: '21 / 9' },
  { label: '3:4', value: '3 / 4' },
  { label: '9:16', value: '9 / 16' },
];

const DEFAULT_POSITION = '50% 50%';

function normalizeAspect(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const colonOrSlash = trimmed.match(/^(\d+(?:\.\d+)?)\s*[:\/\s]\s*(\d+(?:\.\d+)?)$/);
  if (colonOrSlash) {
    const a = parseFloat(colonOrSlash[1]);
    const b = parseFloat(colonOrSlash[2]);
    if (a > 0 && b > 0) return `${a} / ${b}`;
  }
  const single = parseFloat(trimmed);
  if (!isNaN(single) && single > 0) return `${single} / 1`;
  return null;
}

function parsePosition(value: string): { x: number; y: number } {
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 2) return { x: 50, y: 50 };
  const x = parseFloat(parts[0]);
  const y = parseFloat(parts[1]);
  return {
    x: isNaN(x) ? 50 : Math.max(0, Math.min(100, x)),
    y: isNaN(y) ? 50 : Math.max(0, Math.min(100, y)),
  };
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
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
  const storedPosition = get(`${contentKey}.position`, DEFAULT_POSITION);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [customError, setCustomError] = useState<string | null>(null);
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const [livePosition, setLivePosition] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    setDims(null);
    setCustomError(null);
  }, [current]);

  useEffect(() => {
    setLivePosition(null);
  }, [storedPosition]);

  useEffect(() => {
    if (!dragging) return;
    const img = imgRef.current;
    const wrapper = wrapperRef.current;
    if (!img || !wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const start = parsePosition(storedPosition);
    const startPointer = { x: 0, y: 0, set: false };
    let lastPos = { ...start };

    const onMove = (e: PointerEvent) => {
      if (!startPointer.set) {
        startPointer.x = e.clientX;
        startPointer.y = e.clientY;
        startPointer.set = true;
        return;
      }
      const dxPct = ((e.clientX - startPointer.x) / rect.width) * 100;
      const dyPct = ((e.clientY - startPointer.y) / rect.height) * 100;
      // Dragging right should reveal more of the left side of the image;
      // object-position X increases as we subtract drag X.
      lastPos = {
        x: clamp(start.x - dxPct, 0, 100),
        y: clamp(start.y - dyPct, 0, 100),
      };
      setLivePosition(`${lastPos.x.toFixed(1)}% ${lastPos.y.toFixed(1)}%`);
    };

    const onUp = async () => {
      setDragging(false);
      const finalPos = `${lastPos.x.toFixed(1)}% ${lastPos.y.toFixed(1)}%`;
      if (finalPos !== storedPosition) {
        try {
          await set(`${contentKey}.position`, finalPos);
        } catch (err) {
          console.error('[EditableImage] position save failed', err);
        }
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp, { once: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging, storedPosition, contentKey, set]);

  const handleImgLoad = () => {
    const img = imgRef.current;
    if (img) setDims({ w: img.naturalWidth, h: img.naturalHeight });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isAdmin || !current) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    setDragging(true);
  };

  const pickFile = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, { folder });
      await set(contentKey, result.secureUrl);
      setDims({ w: result.width, h: result.height });
    } catch (err) {
      console.error('[EditableImage] upload failed', err);
      alert('이미지 업로드 실패: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async () => {
    if (!confirm('이미지를 제거할까요? (Cloudinary 원본은 남아있고 이 자리에서만 치워집니다.)')) return;
    try {
      await set(contentKey, '');
      await set(`${contentKey}.aspect`, '');
      await set(`${contentKey}.position`, '');
    } catch (err) {
      alert('이미지 제거 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const pickAspect = async (value: string | undefined) => {
    try {
      await set(`${contentKey}.aspect`, value ?? '');
      setCustomInput('');
      setCustomError(null);
    } catch (err) {
      alert('비율 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const applyCustomAspect = async () => {
    const normalized = normalizeAspect(customInput);
    if (!normalized) {
      setCustomError('비율 형식을 확인해주세요 (예: 16:9, 4/3, 1.77)');
      return;
    }
    setCustomError(null);
    try {
      await set(`${contentKey}.aspect`, normalized);
    } catch (err) {
      alert('비율 변경 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const resetPosition = async () => {
    try {
      await set(`${contentKey}.position`, '');
    } catch (err) {
      alert('위치 초기화 실패: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const hasImage = current.length > 0;
  const aspectOverride = storedAspect.length > 0 ? storedAspect : undefined;
  const matchingPreset = ASPECT_PRESETS.find((p) => (p.value ?? '') === (aspectOverride ?? ''));
  const isCustom = !!aspectOverride && !matchingPreset;
  const effectivePosition = livePosition ?? storedPosition;
  const isRepositioned = storedPosition !== DEFAULT_POSITION && storedPosition !== '';

  const wrapperStyle: CSSProperties = {
    ...style,
    position: 'relative',
    overflow: 'hidden',
    ...(aspectOverride ? { aspectRatio: aspectOverride } : {}),
  };

  const fillStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: effectivePosition,
    display: 'block',
  };

  if (!isAdmin) {
    if (!hasImage) return null;
    return (
      <div className={className} style={wrapperStyle}>
        <img src={current} alt={alt} style={fillStyle} />
      </div>
    );
  }

  const adminWrapperStyle: CSSProperties = {
    ...wrapperStyle,
    outline: '1px dashed rgba(0, 87, 255, 0.4)',
    outlineOffset: '2px',
  };

  return (
    <div className="w-full">
      <div ref={wrapperRef} className={className} style={adminWrapperStyle}>
        {hasImage ? (
          <img
            ref={imgRef}
            src={current}
            alt={alt}
            onLoad={handleImgLoad}
            onPointerDown={handlePointerDown}
            draggable={false}
            style={{
              ...fillStyle,
              cursor: dragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              touchAction: 'none',
            }}
          />
        ) : (
          <div
            style={{
              ...fillStyle,
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
            이미지 없음 — 아래 "업로드" 버튼을 누르세요
          </div>
        )}
        {hasImage && (
          <div
            className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full pointer-events-none"
            style={{
              background: dragging ? 'rgba(0,87,255,0.9)' : 'rgba(0,0,0,0.55)',
              color: 'white',
              fontFamily: 'Inter, Pretendard, sans-serif',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.03em',
              transition: 'background 120ms',
            }}
          >
            <Move size={12} />
            <span>{dragging ? '위치 조정 중…' : '드래그로 위치 조정'}</span>
          </div>
        )}
      </div>

      <div
        className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 rounded-md bg-[#F9FBFF] border border-[#E5ECF5]"
        style={{ fontFamily: 'Inter, Pretendard, sans-serif', fontSize: 11 }}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="text-[#0057FF]"
          style={{
            fontWeight: 500,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          비율
        </span>

        <div className="flex flex-wrap gap-1">
          {ASPECT_PRESETS.map((p) => {
            const active = (p.value ?? '') === (aspectOverride ?? '') && !isCustom;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => pickAspect(p.value)}
                className={`px-2 py-0.5 rounded-full border transition-colors ${
                  active
                    ? 'bg-[#0057FF] text-white border-[#0057FF]'
                    : 'bg-white text-[#1A1A1A] border-[#DDD] hover:border-[#0057FF] hover:text-[#0057FF]'
                }`}
                style={{ fontSize: 11, fontWeight: active ? 500 : 400 }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        <span className="w-px h-4 bg-[#DCE4EE]" />

        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="16:9"
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value);
              setCustomError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyCustomAspect();
            }}
            className="w-16 px-2 py-0.5 border border-[#DDD] rounded text-[#1A1A1A] outline-none focus:border-[#0057FF]"
            style={{ fontSize: 11 }}
          />
          <button
            type="button"
            onClick={applyCustomAspect}
            className="px-2 py-0.5 rounded border border-[#DDD] text-[#1A1A1A] hover:border-[#0057FF] hover:text-[#0057FF] transition-colors"
            style={{ fontSize: 11 }}
          >
            적용
          </button>
          {isCustom && (
            <span className="text-[#0057FF] ml-1" style={{ fontSize: 11 }}>
              <Check size={12} className="inline-block mr-0.5" />
              {aspectOverride}
            </span>
          )}
        </div>
        {customError && (
          <span className="text-[#D00]" style={{ fontSize: 11 }}>
            {customError}
          </span>
        )}

        <span className="w-px h-4 bg-[#DCE4EE]" />

        <span className="text-[#666]">
          원본 크기: {dims ? `${dims.w} × ${dims.h} px` : hasImage ? '…' : '없음'}
        </span>

        {hasImage && isRepositioned && (
          <>
            <span className="w-px h-4 bg-[#DCE4EE]" />
            <button
              type="button"
              onClick={resetPosition}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#DDD] text-[#1A1A1A] hover:border-[#0057FF] hover:text-[#0057FF] transition-colors"
              style={{ fontSize: 11 }}
              title="이미지 위치를 중앙으로 초기화"
            >
              <RotateCcw size={11} />
              <span>위치 중앙으로</span>
            </button>
          </>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            onClick={pickFile}
            disabled={uploading}
            className="flex items-center gap-1 px-3 py-1 rounded-full text-white transition-colors"
            style={{
              background: '#0057FF',
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
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[#999] hover:text-[#D00] hover:bg-[#FFF0F0] transition-colors"
              title="이미지 제거"
              style={{ fontSize: 11 }}
            >
              <Trash2 size={12} />
              <span>삭제</span>
            </button>
          )}
        </div>
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
