import React, { useState } from 'react';
import { SunMedium, RefreshCw } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const ImageGrayscale: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<'grayscale' | 'sepia' | 'high-contrast'>('grayscale');
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
    processFilter(selectedFile, mode);
  };

  const processFilter = (srcFile: File, filterMode: 'grayscale' | 'sepia' | 'high-contrast') => {
    const img = new Image();
    const url = URL.createObjectURL(srcFile);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        if (filterMode === 'grayscale') {
          // Luminance formula
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        } else if (filterMode === 'sepia') {
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        } else if (filterMode === 'high-contrast') {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          const contrast = gray > 128 ? Math.min(255, gray * 1.3) : Math.max(0, gray * 0.7);
          data[i] = contrast;
          data[i + 1] = contrast;
          data[i + 2] = contrast;
        }
      }

      ctx.putImageData(imgData, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          if (resultUrl) URL.revokeObjectURL(resultUrl);
          setResultUrl(URL.createObjectURL(blob));
        }
      }, 'image/png');
    };

    img.src = url;
  };

  const handleModeChange = (m: 'grayscale' | 'sepia' | 'high-contrast') => {
    setMode(m);
    if (file) processFilter(file, m);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Select an image to convert to grayscale"
          hint="Convert photos to monochrome black and white or vintage sepia."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Monochrome Tone:</span>
              {[
                { id: 'grayscale', label: 'Classic Grayscale' },
                { id: 'sepia', label: 'Vintage Sepia' },
                { id: 'high-contrast', label: 'High-Contrast B&W' }
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleModeChange(item.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    mode === item.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setFile(null); setResultUrl(null); }}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600 dark:text-slate-300"
              title="Upload new image"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 capitalize">
              Style: {mode.replace('-', ' ')}
            </span>
            {resultUrl && (
              <DownloadButton
                filename={`monochrome-${file.name.replace(/\.[^/.]+$/, '')}.png`}
                dataUrl={resultUrl}
                label="Download B&W Image"
              />
            )}
          </div>

          {resultUrl && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6">
              <img
                src={resultUrl}
                alt="Grayscale Result"
                className="max-h-[450px] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
