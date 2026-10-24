import React, { useState } from 'react';
import { Sliders, Download, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.8);
  const [format, setFormat] = useState<string>('auto'); // auto, image/jpeg, image/webp, image/png
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [maxDimension, setMaxDimension] = useState<number>(1920);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }
    setError(null);
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    compressImage(selectedFile, quality, maxDimension, format);
  };

  const compressImage = (sourceFile: File, q: number, maxDim: number, fmt: string) => {
    setIsProcessing(true);
    setError(null);

    const img = new Image();
    const objectUrl = URL.createObjectURL(sourceFile);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // Scale down if larger than maxDimension
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas context could not be initialized.');
        setIsProcessing(false);
        return;
      }

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output MIME type
      let outputType = fmt;
      if (fmt === 'auto') {
        outputType = sourceFile.type === 'image/png' ? 'image/jpeg' : sourceFile.type;
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('Compression failed. Please try again.');
            setIsProcessing(false);
            return;
          }
          if (compressedUrl) {
            URL.revokeObjectURL(compressedUrl);
          }
          const newUrl = URL.createObjectURL(blob);
          setCompressedBlob(blob);
          setCompressedUrl(newUrl);
          setCompressedSize(blob.size);
          setIsProcessing(false);
        },
        outputType,
        q
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError('Failed to load image. The file may be corrupted.');
      setIsProcessing(false);
    };

    img.src = objectUrl;
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file) {
      compressImage(file, newQ, maxDimension, format);
    }
  };

  const handleDimensionChange = (newDim: number) => {
    setMaxDimension(newDim);
    if (file) {
      compressImage(file, quality, newDim, format);
    }
  };

  const handleFormatChange = (newFmt: string) => {
    setFormat(newFmt);
    if (file) {
      compressImage(file, quality, maxDimension, newFmt);
    }
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedUrl) URL.revokeObjectURL(compressedUrl);
    setFile(null);
    setPreviewUrl(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setError(null);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const reductionPercent = file && compressedSize > 0
    ? Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100))
    : 0;

  const targetExt = format === 'image/webp' ? 'webp' : format === 'image/png' ? 'png' : 'jpg';

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="image/png,image/jpeg,image/webp,image/avif"
          onFilesSelected={handleFilesSelected}
          label="Choose an image to compress"
          hint="Zero server uploads. Processed client-side in your browser."
        />
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
            {/* Quality Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Quality</span>
                <span className="text-teal-600 dark:text-teal-400 font-mono">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>Smaller</span>
                <span>Best</span>
              </div>
            </div>

            {/* Max Resolution Limit */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Max Dimension</span>
                <span className="text-teal-600 dark:text-teal-400 font-mono">{maxDimension}px</span>
              </div>
              <select
                value={maxDimension}
                onChange={(e) => handleDimensionChange(parseInt(e.target.value))}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
              >
                <option value={3840}>4K Ultra HD (3840px)</option>
                <option value={1920}>Full HD (1920px)</option>
                <option value={1280}>HD (1280px)</option>
                <option value={800}>Web Standard (800px)</option>
                <option value={500}>Thumbnail (500px)</option>
              </select>
            </div>

            {/* Target Format */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                <span>Target Format</span>
                <span className="text-teal-600 dark:text-teal-400 uppercase font-mono">{targetExt}</span>
              </div>
              <select
                value={format}
                onChange={(e) => handleFormatChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
              >
                <option value="auto">Auto (Smart Optimized)</option>
                <option value="image/jpeg">JPEG (.jpg)</option>
                <option value="image/webp">WebP (.webp)</option>
                <option value="image/png">PNG (.png)</option>
              </select>
            </div>

            {/* Reset / Change file */}
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Original Size</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 font-mono text-sm">{formatSize(file.size)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[11px]">Compressed Size</span>
                <span className="font-bold text-teal-600 dark:text-teal-400 font-mono text-sm">{formatSize(compressedSize)}</span>
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{reductionPercent}% Saved</span>
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <ShareResultButton
                toolName="Image Compressor"
                resultSummary={`Compressed ${file.name} by ${reductionPercent}% (from ${formatSize(file.size)} down to ${formatSize(compressedSize)}).`}
              />

              {compressedUrl && (
                <DownloadButton
                  filename={`compressed-${file.name.replace(/\.[^/.]+$/, '')}.${targetExt}`}
                  dataUrl={compressedUrl}
                  label="Download Compressed"
                />
              )}
            </div>
          </div>

          {isProcessing && <ProgressIndicator statusText="Optimizing image frames..." />}

          {/* Side by side Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Original Preview ({formatSize(file.size)})
              </span>
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-2 min-h-[240px]">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Original Preview"
                    className="max-h-[320px] w-auto object-contain rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                Compressed Result ({formatSize(compressedSize)})
              </span>
              <div className="rounded-2xl border border-teal-200 dark:border-teal-900/60 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-2 min-h-[240px]">
                {compressedUrl && (
                  <img
                    src={compressedUrl}
                    alt="Compressed Preview"
                    className="max-h-[320px] w-auto object-contain rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
