import React, { useState, useRef } from 'react';
import { Camera, Download, RefreshCw, CheckCircle2, Sliders, Scissors } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { formatBytes } from './compressionEngine';

export const PassportPhotoMaker: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [standard, setStandard] = useState<'us' | 'schengen' | 'india' | 'bd'>('us');
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF');
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);

  const standards = {
    us: { label: 'US Passport / Visa (2x2 inch • 600x600 px)', width: 600, height: 600 },
    schengen: { label: 'Schengen / Europe (35x45 mm • 413x531 px)', width: 413, height: 531 },
    bd: { label: 'Bangladesh Passport / NID (40x50 mm • 472x590 px)', width: 472, height: 590 },
    india: { label: 'India Passport / OCI (35x45 mm • 413x531 px)', width: 413, height: 531 },
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const f = files[0];
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
    renderPassportPhoto(f, standard, backgroundColor);
  };

  const renderPassportPhoto = (f: File, std: 'us' | 'schengen' | 'india' | 'bd', bg: string) => {
    const config = standards[std];
    const img = new Image();
    const objectUrl = URL.createObjectURL(f);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      canvas.width = config.width;
      canvas.height = config.height;
      const ctx = canvas.getContext('2d')!;

      // Fill background
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, config.width, config.height);

      // Center & crop face
      const imgRatio = img.width / img.height;
      const targetRatio = config.width / config.height;
      let drawW, drawH, offsetX, offsetY;

      if (imgRatio > targetRatio) {
        drawH = config.height;
        drawW = img.width * (config.height / img.height);
        offsetX = (config.width - drawW) / 2;
        offsetY = 0;
      } else {
        drawW = config.width;
        drawH = img.height * (config.width / img.width);
        offsetX = 0;
        offsetY = (config.height - drawH) / 2;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      canvas.toBlob((blob) => {
        if (blob) {
          if (processedUrl) URL.revokeObjectURL(processedUrl);
          setProcessedBlob(blob);
          setProcessedUrl(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.95);
    };

    img.src = objectUrl;
  };

  const resetAll = () => {
    setFile(null);
    setPreviewUrl(null);
    setProcessedBlob(null);
    setProcessedUrl(null);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileUpload
          accept="image/*"
          multiple={false}
          onFilesSelected={handleFilesSelected}
          label="Upload Portrait Photo for Passport"
          hint="JPG, PNG, or WebP portrait. We crop and format to international passport specifications."
        />
      ) : (
        <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Passport Photo Formatter</span>
            </h3>
            <button
              type="button"
              onClick={resetAll}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600"
            >
              Change Photo
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Select Country / Passport Standard:
              </label>
              <div className="space-y-2">
                {Object.entries(standards).map(([key, item]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setStandard(key as any);
                      renderPassportPhoto(file, key as any, backgroundColor);
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      standard === key
                        ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="pt-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Background Color:
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { label: 'Pure White', color: '#FFFFFF' },
                    { label: 'Off-White', color: '#F8FAFC' },
                    { label: 'Light Blue', color: '#E0F2FE' },
                    { label: 'Light Gray', color: '#F1F5F9' }
                  ].map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => {
                        setBackgroundColor(c.color);
                        renderPassportPhoto(file, standard, c.color);
                      }}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium ${
                        backgroundColor === c.color ? 'border-teal-500 font-bold' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Output */}
            <div className="space-y-3 flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              {processedUrl && (
                <div className="space-y-3 text-center">
                  <div className="inline-block p-2 bg-white shadow-md border rounded-md">
                    <img
                      src={processedUrl}
                      alt="Passport Preview"
                      style={{
                        width: standards[standard].width / 2.5,
                        height: standards[standard].height / 2.5
                      }}
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Resolution: {standards[standard].width} &times; {standards[standard].height} px • 300 DPI Ready
                  </p>
                  {processedBlob && (
                    <DownloadButton
                      blob={processedBlob}
                      filename={`passport-photo-${standard}.jpg`}
                      label={`Download Passport Photo (${formatBytes(processedBlob.size)})`}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
