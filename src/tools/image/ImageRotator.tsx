import React, { useState } from 'react';
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, RefreshCw } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const ImageRotator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    renderTransform(selectedFile, 0, false, false);
  };

  const renderTransform = (srcFile: File, deg: number, fh: boolean, fv: boolean) => {
    const img = new Image();
    const url = URL.createObjectURL(srcFile);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isSideways = deg === 90 || deg === 270;
      canvas.width = isSideways ? img.naturalHeight : img.naturalWidth;
      canvas.height = isSideways ? img.naturalWidth : img.naturalHeight;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((deg * Math.PI) / 180);
      ctx.scale(fh ? -1 : 1, fv ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (blob) {
          if (resultUrl) URL.revokeObjectURL(resultUrl);
          setResultUrl(URL.createObjectURL(blob));
        }
      }, 'image/png');
    };

    img.src = url;
  };

  const rotateClockwise = () => {
    const next = (rotation + 90) % 360;
    setRotation(next);
    if (file) renderTransform(file, next, flipH, flipV);
  };

  const rotateCounterClockwise = () => {
    const next = (rotation - 90 + 360) % 360;
    setRotation(next);
    if (file) renderTransform(file, next, flipH, flipV);
  };

  const toggleFlipH = () => {
    const next = !flipH;
    setFlipH(next);
    if (file) renderTransform(file, rotation, next, flipV);
  };

  const toggleFlipV = () => {
    const next = !flipV;
    setFlipV(next);
    if (file) renderTransform(file, rotation, flipH, next);
  };

  const handleReset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setResultUrl(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Select an image to rotate or flip"
          hint="Lossless rotation and mirroring right in your browser."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={rotateClockwise}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Rotate 90° CW</span>
              </button>

              <button
                type="button"
                onClick={rotateCounterClockwise}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Rotate 90° CCW</span>
              </button>

              <button
                type="button"
                onClick={toggleFlipH}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  flipH
                    ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FlipHorizontal className="w-4 h-4" />
                <span>Flip Horizontal</span>
              </button>

              <button
                type="button"
                onClick={toggleFlipV}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                  flipV
                    ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FlipVertical className="w-4 h-4" />
                <span>Flip Vertical</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300"
              title="Upload new image"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">
              Current Rotation: {rotation}° • Flip H: {flipH ? 'Yes' : 'No'} • Flip V: {flipV ? 'Yes' : 'No'}
            </span>

            {resultUrl && (
              <DownloadButton
                filename={`transformed-${file.name.replace(/\.[^/.]+$/, '')}.png`}
                dataUrl={resultUrl}
                label="Download Transformed Image"
              />
            )}
          </div>

          {resultUrl && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6">
              <img
                src={resultUrl}
                alt="Transformed Preview"
                className="max-h-[450px] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
