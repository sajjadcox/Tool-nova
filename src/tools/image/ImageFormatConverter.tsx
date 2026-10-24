import React, { useState } from 'react';
import { ArrowRight, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

interface ImageFormatConverterProps {
  defaultTargetFormat?: 'image/png' | 'image/jpeg' | 'image/webp';
}

export const ImageFormatConverter: React.FC<ImageFormatConverterProps> = ({
  defaultTargetFormat = 'image/png'
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>(defaultTargetFormat);
  const [quality, setQuality] = useState<number>(0.92);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file to convert.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    convert(selectedFile, targetFormat, quality, bgColor);
  };

  const convert = (
    srcFile: File,
    fmt: 'image/png' | 'image/jpeg' | 'image/webp',
    q: number,
    bg: string
  ) => {
    setError(null);
    const img = new Image();
    const objectUrl = URL.createObjectURL(srcFile);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // If converting transparent image to JPG, fill background color
      if (fmt === 'image/jpeg') {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('Conversion failed.');
            return;
          }
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          setConvertedUrl(URL.createObjectURL(blob));
          setConvertedSize(blob.size);
        },
        fmt,
        q
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      setError('Could not decode image.');
    };

    img.src = objectUrl;
  };

  const handleFormatChange = (fmt: 'image/png' | 'image/jpeg' | 'image/webp') => {
    setTargetFormat(fmt);
    if (file) convert(file, fmt, quality, bgColor);
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (file) convert(file, targetFormat, q, bgColor);
  };

  const handleReset = () => {
    if (convertedUrl) URL.revokeObjectURL(convertedUrl);
    setFile(null);
    setConvertedUrl(null);
  };

  const getExtension = (fmt: string) => {
    if (fmt === 'image/png') return 'png';
    if (fmt === 'image/jpeg') return 'jpg';
    return 'webp';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Select an image to convert"
          hint="Convert seamlessly between PNG, JPG, and WebP formats."
        />
      ) : (
        <div className="space-y-6">
          {/* Format Selection Card */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Select Output Format
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { id: 'image/png', label: 'PNG', desc: 'Lossless' },
                    { id: 'image/jpeg', label: 'JPG', desc: 'Standard' },
                    { id: 'image/webp', label: 'WebP', desc: 'Lightweight' }
                  ].map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => handleFormatChange(fmt.id as any)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        targetFormat === fmt.id
                          ? 'bg-teal-600 text-white shadow-sm'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {fmt.label} <span className="font-normal opacity-80 text-[10px]">({fmt.desc})</span>
                    </button>
                  ))}
                </div>
              </div>

              {targetFormat !== 'image/png' && (
                <div className="w-48">
                  <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    <span>Quality</span>
                    <span className="font-mono">{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={quality}
                    onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                    className="w-full accent-teal-600"
                  />
                </div>
              )}

              {targetFormat === 'image/jpeg' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => {
                        setBgColor(e.target.value);
                        convert(file, targetFormat, quality, e.target.value);
                      }}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                    <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{bgColor}</span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300 ml-auto"
                title="Convert another image"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Result Bar */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 text-xs font-medium">
              <div>
                <span className="text-slate-400 block text-[11px]">Input File</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatSize(file.size)}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-slate-400 block text-[11px]">Converted ({getExtension(targetFormat).toUpperCase()})</span>
                <span className="font-bold text-teal-600 dark:text-teal-400">{formatSize(convertedSize)}</span>
              </div>
            </div>

            {convertedUrl && (
              <DownloadButton
                filename={`${file.name.replace(/\.[^/.]+$/, '')}.${getExtension(targetFormat)}`}
                dataUrl={convertedUrl}
                label={`Download ${getExtension(targetFormat).toUpperCase()}`}
              />
            )}
          </div>

          {convertedUrl && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6">
              <img
                src={convertedUrl}
                alt="Converted Preview"
                className="max-h-[420px] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
