const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;

export type CldImageOptions = {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb';
  gravity?: 'auto' | 'center' | 'face' | 'north' | 'south' | 'east' | 'west';
  format?: 'auto' | 'webp' | 'avif' | 'png' | 'jpg';
  quality?: 'auto' | number;
  dpr?: 'auto' | number;
};

function buildTransformations(opts: CldImageOptions = {}): string {
  const {
    width,
    height,
    crop,
    gravity,
    format = 'auto',
    quality = 'auto',
    dpr = 'auto',
  } = opts;

  const parts: string[] = [`f_${format}`, `q_${quality}`, `dpr_${dpr}`];
  if (width) parts.push(`w_${width}`);
  if (height) parts.push(`h_${height}`);
  if (crop) parts.push(`c_${crop}`);
  if (gravity) parts.push(`g_${gravity}`);
  return parts.join(',');
}

export function cldImage(publicId: string, opts?: CldImageOptions): string {
  if (!CLOUD_NAME) {
    if (import.meta.env.DEV) {
      console.warn(
        '[cloudinary] VITE_CLOUDINARY_CLOUD_NAME is not set. Copy .env.example to .env.local and fill it in.'
      );
    }
    return '';
  }
  const transformations = buildTransformations(opts);
  const normalizedId = publicId.replace(/^\/+/, '');
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${normalizedId}`;
}
