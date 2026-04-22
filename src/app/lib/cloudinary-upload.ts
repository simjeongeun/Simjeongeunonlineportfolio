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

async function downscaleIfLarge(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') return file;
  if (file.size < SKIP_RESIZE_BELOW) return file;

  try {
    const bitmap = await createImageBitmap(file);
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
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, outputType, JPEG_QUALITY)
    );
    if (!blob) return file;
    if (blob.size >= file.size) return file; // skip if resize didn't help
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.' + outputType.split('/')[1], {
      type: outputType,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

export async function uploadToCloudinary(
  file: File,
  opts: { folder?: string } = {}
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary upload is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  const prepared = await downscaleIfLarge(file);

  const body = new FormData();
  body.append('file', prepared);
  body.append('upload_preset', UPLOAD_PRESET);
  if (opts.folder) body.append('folder', opts.folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Cloudinary upload failed (${res.status}): ${text}`);
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
