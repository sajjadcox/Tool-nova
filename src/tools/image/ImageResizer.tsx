import React, { useState, useRef } from 'react';
import { Lock, Unlock, RefreshCw, Check, ArrowRight } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const ImageResizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }
    setError(null);
    setFile(selectedFile);

    const img = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);

    img.onload = () => {
      imageRef.current = img;
      setOriginalWidth(img.width);
      setOriginalHeight(img.height);
      setWidth(img.width);
      setHeight(img.height);
      generateResized(img, img.width, img.height, format);
    };

    img.onerror = () => {
      setError('Unable to load image.');
    };

    img.src = objectUrl;
  };

  const generateResized = (
    img: HTMLImageElement,
    targetW: number,
    targetH: number,
    targetFormat: string
  ) => {
    if (targetW <= 0 || targetH <= 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.drawImage(img, 0, 0, targetW, targetH);
    canvas.toBlob((blob) => {
      if (blob) {
        if (resizedUrl) URL.revokeObjectURL(resizedUrl);
        setResizedUrl(URL.createObjectURL(blob));
      }
    }, targetFormat, 0.92);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    let newHeight = height;
    if (lockAspectRatio && originalWidth > 0) {
      newHeight = Math.round((val * originalHeight) / originalWidth);
      setHeight(newHeight);
    }
    if (imageRef.current) {
      generateResized(imageRef.current, val, newHeight, format);
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    let newWidth = width;
    if (lockAspectRatio && originalHeight > 0) {
      newWidth = Math.round((val * originalWidth) / originalHeight);
      setWidth(newWidth);
    }
    if (imageRef.current) {
      generateResized(imageRef.current, newWidth, val, format);
    }
  };

  const handleScalePercent = (percent: number) => {
    const newW = Math.round((originalWidth * percent) / 100);
    const newH = Math.round((originalHeight * percent) / 100);
    setWidth(newW);
    setHeight(newH);
    if (imageRef.current) {
      generateResized(imageRef.current, newW, newH, format);
    }
  };

  const handleFormatChange = (fmt: 'image/png' | 'image/jpeg' | 'image/webp') => {
    setFormat(fmt);
    if (imageRef.current) {
      generateResized(imageRef.current, width, height, fmt);
    }
  };

  const handleReset = () => {
    if (resizedUrl) URL.revokeObjectURL(resizedUrl);
    setFile(null);
    setResizedUrl(null);
    setWidth(0);
    setHeight(0);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Select an image to resize"
          hint="Resize by pixels or scale percentage in real-time."
        />
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Width (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={width || ''}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Height (px)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={height || ''}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Target Format
                </label>
                <select
                  value={format}
                  onChange={(e) => handleFormatChange(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
                >
                  <option value="image/png">PNG (Lossless)</option>
                  <option value="image/jpeg">JPG (Standard)</option>
                  <option value="image/webp">WebP (Optimized)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    lockAspectRatio
                      ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/40 dark:border-teal-800 dark:text-teal-300'
                      : 'bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700'
                  }`}
                >
                  {lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{lockAspectRatio ? 'Locked' : 'Unlocked'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                  title="Upload different image"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scale quick buttons */}
            <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-slate-500 font-medium">Quick Presets:</span>
              {[25, 50, 75, 100, 150, 200].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleScalePercent(pct)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  {pct}%
                </button>
              ))}
              <span className="text-slate-400 ml-auto font-mono text-[11px]">
                Original: {originalWidth} × {originalHeight}px
              </span>
            </div>
          </div>

          {/* Action & Preview */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span>Output: {width} × {height}px</span>
              <span className="text-slate-400">•</span>
              <span className="uppercase text-teal-600 dark:text-teal-400 font-bold">
                {format.replace('image/', '')}
              </span>
            </div>

            {resizedUrl && (
              <DownloadButton
                filename={`resized-${width}x${height}-${file.name.replace(/\.[^/.]+$/, '')}.${format.replace('image/', '')}`}
                dataUrl={resizedUrl}
                label="Download Resized Image"
              />
            )}
          </div>

          {resizedUrl && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-4">
              <img
                src={resizedUrl}
                alt="Resized Preview"
                className="max-h-[450px] w-auto object-contain rounded-lg shadow-sm"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
