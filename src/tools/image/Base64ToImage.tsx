import React, { useState } from 'react';
import { Binary, Download, RefreshCw, Copy, Check } from 'lucide-react';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const Base64ToImage: React.FC = () => {
  const [base64Input, setBase64Input] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; type: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    setError(null);
    if (!base64Input.trim()) {
      setError('Please paste a Base64 data string or URI.');
      return;
    }

    let clean = base64Input.trim();
    // If it's a raw base64 string without data:image prefix, add default PNG prefix
    if (!clean.startsWith('data:image/')) {
      clean = `data:image/png;base64,${clean}`;
    }

    const img = new Image();
    img.onload = () => {
      setImageUrl(clean);
      const mime = clean.substring(clean.indexOf(':') + 1, clean.indexOf(';'));
      const base64Data = clean.split(',')[1] || '';
      // Approximate byte size: 3/4 length of base64
      const approxBytes = Math.round((base64Data.length * 3) / 4);
      setImageMeta({
        width: img.naturalWidth,
        height: img.naturalHeight,
        type: mime || 'image/png',
        size: approxBytes
      });
    };

    img.onerror = () => {
      setError('Invalid Base64 image data. Please ensure it is a valid base64 encoded image string.');
      setImageUrl(null);
      setImageMeta(null);
    };

    img.src = clean;
  };

  const handleClear = () => {
    setBase64Input('');
    setImageUrl(null);
    setImageMeta(null);
    setError(null);
  };

  const sampleBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9QzwAEjDAGYzMGABv/Av992VbgAAAAAElFTkSuQmCC";

  const loadSample = () => {
    setBase64Input(sampleBase64);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <label>Base64 String or Data URI</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="text-teal-600 dark:text-teal-400 hover:underline"
            >
              Load sample
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          value={base64Input}
          onChange={(e) => setBase64Input(e.target.value)}
          placeholder="data:image/png;base64,iVBORw0KGgoAAAANSUhEUg..."
          className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500 transition-colors"
        />

        <button
          type="button"
          onClick={handleConvert}
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
        >
          <Binary className="w-4 h-4" />
          <span>Decode to Image</span>
        </button>
      </div>

      {imageUrl && imageMeta && (
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 flex items-center justify-between flex-wrap gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Decoded Image: {imageMeta.width} × {imageMeta.height}px
              </span>
              <p className="text-slate-500">
                Format: <strong className="text-teal-600">{imageMeta.type}</strong> • Approx Size: {(imageMeta.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <DownloadButton
              filename={`decoded-image.${imageMeta.type.split('/')[1] || 'png'}`}
              dataUrl={imageUrl}
              label="Download Image"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6">
            <img
              src={imageUrl}
              alt="Decoded from Base64"
              className="max-h-[400px] w-auto object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
