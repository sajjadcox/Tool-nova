import React, { useState, useRef, useEffect } from 'react';
import { Crop, RefreshCw, Check } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const ImageCropper: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [cropX, setCropX] = useState<number>(10);
  const [cropY, setCropY] = useState<number>(10);
  const [cropW, setCropW] = useState<number>(80);
  const [cropH, setCropH] = useState<number>(80);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file to crop.');
      return;
    }
    setError(null);
    setFile(selectedFile);

    const img = new Image();
    const url = URL.createObjectURL(selectedFile);
    img.onload = () => {
      imgRef.current = img;
      applyAspectRatio('1:1');
    };
    img.src = url;
  };

  const applyAspectRatio = (ratio: string) => {
    setAspectRatio(ratio);
    if (!imgRef.current) return;

    if (ratio === '1:1') {
      setCropX(15);
      setCropY(15);
      setCropW(70);
      setCropH(70);
      renderCrop(15, 15, 70, 70);
    } else if (ratio === '16:9') {
      setCropX(5);
      setCropY(20);
      setCropW(90);
      setCropH(50.6);
      renderCrop(5, 20, 90, 50.6);
    } else if (ratio === '4:3') {
      setCropX(10);
      setCropY(15);
      setCropW(80);
      setCropH(60);
      renderCrop(10, 15, 80, 60);
    } else if (ratio === '9:16') {
      setCropX(25);
      setCropY(5);
      setCropW(50);
      setCropH(88.8);
      renderCrop(25, 5, 50, 88.8);
    } else {
      // Freeform default
      renderCrop(cropX, cropY, cropW, cropH);
    }
  };

  const renderCrop = (cx: number, cy: number, cw: number, ch: number) => {
    const img = imgRef.current;
    if (!img) return;

    const sourceX = (cx / 100) * img.naturalWidth;
    const sourceY = (cy / 100) * img.naturalHeight;
    const sourceW = Math.max(10, (cw / 100) * img.naturalWidth);
    const sourceH = Math.max(10, (ch / 100) * img.naturalHeight);

    const canvas = document.createElement('canvas');
    canvas.width = sourceW;
    canvas.height = sourceH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);

    canvas.toBlob((blob) => {
      if (blob) {
        if (croppedUrl) URL.revokeObjectURL(croppedUrl);
        setCroppedUrl(URL.createObjectURL(blob));
      }
    }, 'image/png');
  };

  const handleSliderChange = (param: 'x' | 'y' | 'w' | 'h', val: number) => {
    let nx = cropX, ny = cropY, nw = cropW, nh = cropH;
    if (param === 'x') { nx = val; setCropX(val); }
    if (param === 'y') { ny = val; setCropY(val); }
    if (param === 'w') { nw = val; setCropW(val); }
    if (param === 'h') { nh = val; setCropH(val); }
    renderCrop(nx, ny, nw, nh);
  };

  const handleReset = () => {
    if (croppedUrl) URL.revokeObjectURL(croppedUrl);
    setFile(null);
    setCroppedUrl(null);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Choose an image to crop"
          hint="Supports 1:1 avatars, 16:9 banners, 9:16 stories, and custom framing."
        />
      ) : (
        <div className="space-y-6">
          {/* Aspect Ratio Presets */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Aspect Ratio Presets:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {['1:1', '16:9', '4:3', '9:16', 'Freeform'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => applyAspectRatio(ratio)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      aspectRatio === ratio
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {ratio === '1:1' ? '1:1 Square (Avatar)' : ratio === '16:9' ? '16:9 Landscape' : ratio === '9:16' ? '9:16 Reel/Story' : ratio}
                  </button>
                ))}
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

            {/* Framing Sliders */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                <label className="block text-slate-500 mb-1">X Offset: {cropX}%</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={cropX}
                  onChange={(e) => handleSliderChange('x', parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Y Offset: {cropY}%</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={cropY}
                  onChange={(e) => handleSliderChange('y', parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Crop Width: {cropW}%</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={cropW}
                  onChange={(e) => handleSliderChange('w', parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Crop Height: {cropH}%</label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={cropH}
                  onChange={(e) => handleSliderChange('h', parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Action & Preview */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">
              Ratio: {aspectRatio} • Instant in-browser render
            </span>
            {croppedUrl && (
              <DownloadButton
                filename={`cropped-${file.name.replace(/\.[^/.]+$/, '')}.png`}
                dataUrl={croppedUrl}
                label="Download Cropped Image"
              />
            )}
          </div>

          {/* Cropped Output Preview */}
          {croppedUrl && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6">
              <img
                src={croppedUrl}
                alt="Cropped Preview"
                className="max-h-[420px] w-auto object-contain rounded-xl shadow-md border border-slate-200 dark:border-slate-700"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
