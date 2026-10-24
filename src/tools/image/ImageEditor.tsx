import React, { useState } from 'react';
import { Sliders, RefreshCw } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const ImageEditor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [blur, setBlur] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    applyFilters(selectedFile, 100, 100, 100, 0, 0);
  };

  const applyFilters = (
    srcFile: File,
    b: number,
    c: number,
    s: number,
    bl: number,
    inv: number
  ) => {
    const img = new Image();
    const url = URL.createObjectURL(srcFile);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.filter = `brightness(${b}%) contrast(${c}%) saturate(${s}%) blur(${bl}px) invert(${inv}%)`;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          if (resultUrl) URL.revokeObjectURL(resultUrl);
          setResultUrl(URL.createObjectURL(blob));
        }
      }, 'image/png');
    };

    img.src = url;
  };

  const updateFilter = (
    param: 'brightness' | 'contrast' | 'saturation' | 'blur' | 'invert',
    val: number
  ) => {
    let nb = brightness, nc = contrast, ns = saturation, nbl = blur, ninv = invert;
    if (param === 'brightness') { nb = val; setBrightness(val); }
    if (param === 'contrast') { nc = val; setContrast(val); }
    if (param === 'saturation') { ns = val; setSaturation(val); }
    if (param === 'blur') { nbl = val; setBlur(val); }
    if (param === 'invert') { ninv = val; setInvert(val); }
    if (file) applyFilters(file, nb, nc, ns, nbl, ninv);
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setInvert(0);
    if (file) applyFilters(file, 100, 100, 100, 0, 0);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          label="Select an image to tune"
          hint="Live adjustment of brightness, contrast, saturation, blur, and color inversion."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Visual Tune Parameters
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                >
                  Reset Sliders
                </button>
                <button
                  type="button"
                  onClick={() => { setFile(null); setResultUrl(null); }}
                  className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Brightness</span>
                  <span className="font-mono">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => updateFilter('brightness', parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Contrast</span>
                  <span className="font-mono">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => updateFilter('contrast', parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Saturation</span>
                  <span className="font-mono">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => updateFilter('saturation', parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Blur</span>
                  <span className="font-mono">{blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={blur}
                  onChange={(e) => updateFilter('blur', parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  <span>Invert Colors</span>
                  <span className="font-mono">{invert}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={invert}
                  onChange={(e) => updateFilter('invert', parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-300">
              Live filtered output
            </span>
            {resultUrl && (
              <DownloadButton
                filename={`edited-${file.name.replace(/\.[^/.]+$/, '')}.png`}
                dataUrl={resultUrl}
                label="Download Edited Image"
              />
            )}
          </div>

          {resultUrl && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 flex items-center justify-center p-6">
              <img
                src={resultUrl}
                alt="Edited Preview"
                className="max-h-[450px] w-auto object-contain rounded-xl shadow-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
