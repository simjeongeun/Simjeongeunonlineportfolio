const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
};

// Skip files above this size limit (Cloudinary free tier caps around 10 MB).
const SKIP_RESIZE_BELOW = 512 * 1024; // images under 512 KB are small enough
const TARGET_MAX_DIMENSION = 2400; // longest side in pixels after resize
const JPEG_QUALITY = 0.85;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

async function downscaleIfLarge(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file;
  if (file.size < SKIP_RESIZE_BELOW) return file;

  try {
    const bitmap = await withTimeout(createImageBitmap(file), 10000, 'Image decode');
    const longest = Math.max(bitmap.width, bitmap.height);
    if (longest <= TARGET_MAX_DIMENSION) {
      bitmap.close?.();
      return file;
    }
    const scale = TARGET_MAX_DIMENSION / longest;
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();

    const outputType =
      file.type === 'image/png' || file.type === 'image/webp' ? file.type : 'image/jpeg';
    const blob: Blob | null = await withTimeout(
      new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, outputType, JPEG_QUALITY)
      ),
      10000,
      'Image encode'
    );
    if (!blob) return file;
    if (blob.size >= file.size) return file; // skip if resize didn't help
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.' + outputType.split('/')[1], {
      type: outputType,
      lastModified: Date.now(),
    });
  } catch (err) {
    console.warn('[cloudinary-upload] downscale skipped:', err);
    return file;
  }
}

const UPLOAD_TIMEOUT_MS = 60_000;

export async function uploadToCloudinary(
  file: File,
  opts: { folder?: string } = {}
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    const missing = [
      !CLOUD_NAME && 'VITE_CLOUDINARY_CLOUD_NAME',
      !UPLOAD_PRESET && 'VITE_CLOUDINARY_UPLOAD_PRESET',
    ]
      .filter(Boolean)
      .join(', ');
    throw new Error(
      `Cloudinary 환경변수 누락: ${missing}. Vercel/로컬 .env.local에 설정 후 재배포하세요.`
    );
  }

  const prepared = await downscaleIfLarge(file);

  const body = new FormData();
  body.append('file', prepared);
  body.append('upload_preset', UPLOAD_PRESET);
  if (opts.folder) body.append('folder', opts.folder);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPLOAD_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(
        `업로드 시간 초과 (${UPLOAD_TIMEOUT_MS / 1000}s). 네트워크 상태와 Cloudinary 프리셋을 확인하세요.`
      );
    }
    throw new Error(
      '네트워크 오류: ' + (err instanceof Error ? err.message : String(err))
    );
  }
  clearTimeout(timer);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let hint = '';
    if (res.status === 400 && /preset/i.test(text)) {
      hint =
        ' — 힌트: Cloudinary Console → Settings → Upload → 프리셋을 "Unsigned"로 설정했는지 확인하세요.';
    } else if (res.status === 401 || res.status === 403) {
      hint = ' — 힌트: 프리셋 권한/이름이 맞는지 확인하세요.';
    }
    throw new Error(`Cloudinary 업로드 실패 (${res.status}): ${text || res.statusText}${hint}`);
  }

  const json = await res.json();
  return {
    secureUrl: json.secure_url as string,
    publicId: json.public_id as string,
    width: json.width as number,
    height: json.height as number,
    format: json.format as string,
    bytes: json.bytes as number,
  };
}
