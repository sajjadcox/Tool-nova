/**
 * Advanced Client-Side Image Compression Engine
 * High-performance, zero-API, multi-format compression with target-size binary search.
 */

export interface CompressionOptions {
  quality: number; // 0.05 to 1.0
  format: 'auto' | 'image/jpeg' | 'image/webp' | 'image/png';
  maxDimension?: number; // e.g. 1920, 1280, 800, or 0 (original)
  targetSizeKB?: number; // Target max size in KB (e.g. 50, 100, 200)
}

export interface CompressionResult {
  blob: Blob;
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  percentSaved: number;
  width: number;
  height: number;
  format: string;
}

/**
 * Loads an image file into an HTMLImageElement
 */
export function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to decode image file. File may be corrupted.'));
    };
    img.src = url;
  });
}

/**
 * Calculates optimal scaled dimensions respecting aspect ratio
 */
export function calculateDimensions(
  origWidth: number,
  origHeight: number,
  maxDim: number
): { width: number; height: number } {
  if (!maxDim || maxDim <= 0 || (origWidth <= maxDim && origHeight <= maxDim)) {
    return { width: origWidth, height: origHeight };
  }
  if (origWidth > origHeight) {
    return {
      width: maxDim,
      height: Math.max(1, Math.round((origHeight * maxDim) / origWidth))
    };
  } else {
    return {
      width: Math.max(1, Math.round((origWidth * maxDim) / origHeight)),
      height: maxDim
    };
  }
}

/**
 * Compresses an image using Canvas 2D with bicubic smoothing and format optimization
 */
export async function compressSingleImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  const img = await loadImage(file);
  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  // Determine target output format
  let targetFormat = options.format;
  if (targetFormat === 'auto') {
    // WebP delivers 60-80% smaller size while keeping transparency & high quality
    if (file.type === 'image/png') {
      targetFormat = 'image/webp';
    } else if (file.type === 'image/webp') {
      targetFormat = 'image/webp';
    } else {
      targetFormat = 'image/jpeg';
    }
  }

  // If user requested target size in KB (e.g., compress to 100KB, 50KB)
  if (options.targetSizeKB && options.targetSizeKB > 0) {
    return await compressToTargetSize(file, img, options.targetSizeKB, targetFormat);
  }

  const { width, height } = calculateDimensions(
    origWidth,
    origHeight,
    options.maxDimension || 0
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: targetFormat !== 'image/jpeg' });
  if (!ctx) throw new Error('Could not create 2D canvas context.');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // White background for JPEG if source had transparency
  if (targetFormat === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas export failed'));
      },
      targetFormat,
      options.quality
    );
  });

  const percentSaved = Math.max(
    0,
    Math.round(((file.size - blob.size) / file.size) * 100)
  );

  return {
    blob,
    dataUrl: URL.createObjectURL(blob),
    originalSize: file.size,
    compressedSize: blob.size,
    percentSaved,
    width,
    height,
    format: targetFormat
  };
}

/**
 * Binary search algorithm to hit exact target KB (e.g. compress to 100KB / 50KB)
 */
async function compressToTargetSize(
  originalFile: File,
  img: HTMLImageElement,
  targetKB: number,
  preferredFormat: string
): Promise<CompressionResult> {
  const targetBytes = targetKB * 1024;
  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  let minQ = 0.05;
  let maxQ = 0.95;
  let bestBlob: Blob | null = null;
  let bestWidth = origWidth;
  let bestHeight = origHeight;

  // 1. Try quality iteration at native resolution
  for (let step = 0; step < 6; step++) {
    const testQ = (minQ + maxQ) / 2;
    const canvas = document.createElement('canvas');
    canvas.width = origWidth;
    canvas.height = origHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) break;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    if (preferredFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, origWidth, origHeight);
    }
    ctx.drawImage(img, 0, 0, origWidth, origHeight);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, preferredFormat, testQ)
    );

    if (blob) {
      bestBlob = blob;
      if (blob.size <= targetBytes) {
        // We are under target, can try slightly higher quality
        minQ = testQ;
      } else {
        // Too large, decrease quality
        maxQ = testQ;
      }
    }
  }

  // 2. If still larger than target, scale down dimensions
  if (!bestBlob || bestBlob.size > targetBytes) {
    let scale = 0.9;
    while (scale >= 0.2) {
      const curW = Math.max(100, Math.round(origWidth * scale));
      const curH = Math.max(100, Math.round(origHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = curW;
      canvas.height = curH;
      const ctx = canvas.getContext('2d');
      if (!ctx) break;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if (preferredFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, curW, curH);
      }
      ctx.drawImage(img, 0, 0, curW, curH);

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, preferredFormat, 0.65)
      );

      if (blob) {
        bestBlob = blob;
        bestWidth = curW;
        bestHeight = curH;
        if (blob.size <= targetBytes) {
          break; // Satisfied
        }
      }
      scale -= 0.15;
    }
  }

  const finalBlob = bestBlob || (await (async () => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(800, origWidth);
    canvas.height = Math.round((origHeight * Math.min(800, origWidth)) / origWidth);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), preferredFormat, 0.4));
  })());

  const percentSaved = Math.max(
    0,
    Math.round(((originalFile.size - finalBlob.size) / originalFile.size) * 100)
  );

  return {
    blob: finalBlob,
    dataUrl: URL.createObjectURL(finalBlob),
    originalSize: originalFile.size,
    compressedSize: finalBlob.size,
    percentSaved,
    width: bestWidth,
    height: bestHeight,
    format: preferredFormat
  };
}

/**
 * Format bytes to readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
