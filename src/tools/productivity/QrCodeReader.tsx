import React, { useState } from 'react';
import jsQR from 'jsqr';
import { Scan, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { CopyButton } from '../../components/common/CopyButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const QrCodeReader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [decodedData, setDecodedData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file containing a QR code.');
      return;
    }
    setError(null);
    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Failed to create image canvas.');
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        setDecodedData(code.data);
      } else {
        setError('No QR code detected in this image. Please ensure the QR code is clearly visible, well-lit, and in focus.');
        setDecodedData(null);
      }
    };

    img.onerror = () => {
      setError('Could not decode image.');
    };

    img.src = url;
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFile(null);
    setPreviewUrl(null);
    setDecodedData(null);
    setError(null);
  };

  const isUrl = decodedData && (decodedData.startsWith('http://') || decodedData.startsWith('https://'));

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Select an image or screenshot of a QR code to read"
          hint="Decoded 100% locally in your browser. Zero uploads."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan Another QR Code</span>
            </button>
          </div>

          {decodedData && (
            <div className="p-6 rounded-3xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
                  Decoded QR Payload
                </span>
                <div className="flex items-center gap-2">
                  <CopyButton textToCopy={decodedData} />
                  {isUrl && (
                    <a
                      href={decodedData}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 text-white hover:bg-teal-700 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Link</span>
                    </a>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800/80 font-mono text-sm text-slate-800 dark:text-slate-200 break-all select-all">
                {decodedData}
              </div>
            </div>
          )}

          {previewUrl && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6">
              <img
                src={previewUrl}
                alt="Uploaded QR Code"
                className="max-h-[360px] w-auto object-contain rounded-xl shadow-sm"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
