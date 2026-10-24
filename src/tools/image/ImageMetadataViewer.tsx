import React, { useState } from 'react';
import { Info, Image, HardDrive, Maximize, Calendar, RefreshCw } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const ImageMetadataViewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<{
    name: string;
    size: number;
    type: string;
    lastModified: string;
    width: number;
    height: number;
    aspectRatio: string;
    megapixels: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file to inspect.');
      return;
    }
    setError(null);
    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    const img = new window.Image();
    img.onload = () => {
      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(img.naturalWidth, img.naturalHeight);
      const ratio = `${img.naturalWidth / divisor}:${img.naturalHeight / divisor}`;
      const mp = ((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(2);

      setMeta({
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
        lastModified: new Date(selectedFile.lastModified).toLocaleString(),
        width: img.naturalWidth,
        height: img.naturalHeight,
        aspectRatio: ratio,
        megapixels: mp
      });
    };

    img.onerror = () => {
      setError('Could not decode image metadata.');
    };

    img.src = url;
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setMeta(null);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Select an image to inspect metadata"
          hint="Inspect intrinsic resolution, megapixel density, aspect ratio, MIME type, and bytes."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Inspect Another</span>
            </button>
          </div>

          {meta && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Dimensions</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {meta.width} × {meta.height} px
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium block">
                  {meta.megapixels} Megapixels
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Aspect Ratio</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {meta.aspectRatio}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {(meta.width / meta.height).toFixed(2)} decimal
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">File Size</span>
                <span className="text-base font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {(meta.size / 1024).toFixed(1)} KB
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {meta.size.toLocaleString()} Bytes
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">MIME Type</span>
                <span className="text-base font-bold text-teal-600 dark:text-teal-400 font-mono truncate block">
                  {meta.type}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  {meta.lastModified}
                </span>
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6">
              <img
                src={previewUrl}
                alt="Inspected File"
                className="max-h-[400px] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
