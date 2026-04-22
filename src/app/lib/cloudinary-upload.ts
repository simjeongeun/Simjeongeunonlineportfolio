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

export async function uploadToCloudinary(
  file: File,
  opts: { folder?: string } = {}
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary upload is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.'
    );
  }

  const body = new FormData();
  body.append('file', file);
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
