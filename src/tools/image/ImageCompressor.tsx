import React, { useState } from 'react';
import { 
  Sliders, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  ArrowRight, 
  Target, 
  Zap, 
  FileImage, 
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';
import { 
  compressSingleImage, 
  formatBytes, 
  CompressionOptions, 
  CompressionResult 
} from './compressionEngine';

export const ImageCompressor: React.FC<{ initialTargetKB?: number }> = ({ initialTargetKB }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(0.45);
  const [format, setFormat] = useState<'auto' | 'image/jpeg' | 'image/webp' | 'image/png'>('image/webp');
  const [maxDimension, setMaxDimension] = useState<number>(1280);
  const [targetSizeKB, setTargetSizeKB] = useState<number>(initialTargetKB || 0);
  const [mode, setMode] = useState<'balanced' | 'extreme' | 'target' | 'custom'>(
    initialTargetKB ? 'target' : 'extreme'
  );

  const [compressedResult, setCompressedResult] = useState<CompressionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState<'side-by-side' | 'compressed'>('side-by-side');

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP, GIF, or BMP).');
      return;
    }
    setError(null);
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    runCompression(selectedFile, quality, maxDimension, format, mode === 'target' ? targetSizeKB : 0);
  };

  const runCompression = async (
    sourceFile: File,
    q: number,
    maxDim: number,
    fmt: 'auto' | 'image/jpeg' | 'image/webp' | 'image/png',
    targetKB: number
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const options: CompressionOptions = {
        quality: q,
        format: fmt,
        maxDimension: maxDim,
        targetSizeKB: targetKB > 0 ? targetKB : undefined
      };

      const result = await compressSingleImage(sourceFile, options);
      setCompressedResult(result);
    } catch (err: any) {
      setError(err?.message || 'Failed to compress image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModeChange = (newMode: 'balanced' | 'extreme' | 'target' | 'custom') => {
    setMode(newMode);
    let newQ = quality;
    let newDim = maxDimension;
    let newFmt = format;
    let newTarget = 0;

    if (newMode === 'balanced') {
      newQ = 0.75;
      newDim = 1920;
      newFmt = 'image/webp';
    } else if (newMode === 'extreme') {
      newQ = 0.45;
      newDim = 1280;
      newFmt = 'image/webp';
    } else if (newMode === 'target') {
      newTarget = targetSizeKB || 100;
      newFmt = 'image/jpeg';
      setTargetSizeKB(newTarget);
    }

    setQuality(newQ);
    setMaxDimension(newDim);
    setFormat(newFmt);

    if (file) {
      runCompression(file, newQ, newDim, newFmt, newTarget);
    }
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (file) {
      runCompression(file, newQ, maxDimension, format, 0);
    }
  };

  const handleDimensionChange = (newDim: number) => {
    setMaxDimension(newDim);
    if (file) {
      runCompression(file, quality, newDim, format, mode === 'target' ? targetSizeKB : 0);
    }
  };

  const handleFormatChange = (newFmt: 'auto' | 'image/jpeg' | 'image/webp' | 'image/png') => {
    setFormat(newFmt);
    if (file) {
      runCompression(file, quality, maxDimension, newFmt, mode === 'target' ? targetSizeKB : 0);
    }
  };

  const handleTargetKBChange = (kb: number) => {
    setTargetSizeKB(kb);
    if (file) {
      runCompression(file, quality, maxDimension, format, kb);
    }
  };

  const resetAll = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (compressedResult?.dataUrl) URL.revokeObjectURL(compressedResult.dataUrl);
    setFile(null);
    setPreviewUrl(null);
    setCompressedResult(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {!file ? (
        <div className="space-y-4">
          <FileUpload
            accept="image/*"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            label="Upload Any Image to Compress"
            hint="JPG, PNG, WebP, GIF, or BMP • 100% Private In-Browser • Unlimited File Size"
          />

          {/* Quick Target Presets before uploading */}
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Common Requirements:</span>
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { label: 'Compress to < 50 KB', kb: 50 },
                { label: 'Compress to < 100 KB', kb: 100 },
                { label: 'Compress to < 200 KB', kb: 200 },
                { label: 'Compress to < 500 KB', kb: 500 }
              ].map(preset => (
                <button
                  key={preset.kb}
                  type="button"
                  onClick={() => {
                    setMode('target');
                    setTargetSizeKB(preset.kb);
                  }}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                    mode === 'target' && targetSizeKB === preset.kb
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Strategy Selection Bar */}
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Compression Strategy & Controls</span>
              </span>
              <button
                type="button"
                onClick={resetAll}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors"
              >
                Change Image
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleModeChange('balanced')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'balanced'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <p className="font-bold text-xs">Balanced (Recommended)</p>
                <p className="text-[11px] text-slate-500">60-75% drop, high clarity</p>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('extreme')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'extreme'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <p className="font-bold text-xs">Maximum (80-90%)</p>
                <p className="text-[11px] text-slate-500">Ultra compact web size</p>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('target')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'target'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <p className="font-bold text-xs">Target File Size</p>
                <p className="text-[11px] text-slate-500">Hit exact KB requirement</p>
              </button>

              <button
                type="button"
                onClick={() => handleModeChange('custom')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === 'custom'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <p className="font-bold text-xs">Custom Controls</p>
                <p className="text-[11px] text-slate-500">Fine-tune sliders</p>
              </button>
            </div>

            {/* Sub-controls based on mode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {mode === 'target' ? (
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                    <span>Target Maximum Size:</span>
                    <span className="text-teal-600 font-bold">{targetSizeKB || 100} KB</span>
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[50, 100, 200, 300, 500].map(kb => (
                      <button
                        key={kb}
                        type="button"
                        onClick={() => handleTargetKBChange(kb)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                          targetSizeKB === kb
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        &lt; {kb} KB
                      </button>
                    ))}
                    <input
                      type="number"
                      min="10"
                      max="10000"
                      value={targetSizeKB}
                      onChange={(e) => handleTargetKBChange(Math.max(10, parseInt(e.target.value) || 100))}
                      className="w-24 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                      placeholder="Custom KB"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                    <span>Compression Quality:</span>
                    <span className="text-teal-600 font-bold">{Math.round(quality * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="0.95"
                    step="0.05"
                    value={quality}
                    onChange={(e) => handleQualityChange(parseFloat(e.target.value))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target Format:
                </label>
                <select
                  value={format}
                  onChange={(e) => handleFormatChange(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="image/webp">WebP (Best 75% savings)</option>
                  <option value="image/jpeg">JPEG (Standard photo compatibility)</option>
                  <option value="auto">Auto (Match input)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Max Resolution:
                </label>
                <select
                  value={maxDimension}
                  onChange={(e) => handleDimensionChange(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value={0}>Original Resolution (No downscale)</option>
                  <option value={2560}>2560px (2K QHD)</option>
                  <option value={1920}>1920px (Full HD)</option>
                  <option value={1280}>1280px (HD Web)</option>
                  <option value={800}>800px (Mobile / Passport)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          {compressedResult && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-black text-lg text-emerald-900 dark:text-emerald-200">
                      Reduced by {compressedResult.percentSaved}% ({formatBytes(compressedResult.originalSize - compressedResult.compressedSize)} saved)
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Original: <strong className="font-mono">{formatBytes(compressedResult.originalSize)}</strong> &rarr; Compressed: <strong className="font-mono">{formatBytes(compressedResult.compressedSize)}</strong> • Output dimensions: {compressedResult.width} &times; {compressedResult.height}px
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <DownloadButton
                    blob={compressedResult.blob}
                    filename={`${file.name.substring(0, file.name.lastIndexOf('.')) || file.name}-compressed.${format === 'image/jpeg' ? 'jpg' : 'webp'}`}
                    label={`Download (${formatBytes(compressedResult.compressedSize)})`}
                  />
                  <button
                    type="button"
                    onClick={resetAll}
                    className="p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 hover:bg-white dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-300"
                    title="Upload another image"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Visual Comparison Preview */}
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Visual Quality Inspection
              </h3>
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCompareMode('side-by-side')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    compareMode === 'side-by-side'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Side by Side
                </button>
                <button
                  type="button"
                  onClick={() => setCompareMode('compressed')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    compareMode === 'compressed'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500'
                  }`}
                >
                  Compressed Only
                </button>
              </div>
            </div>

            {compareMode === 'side-by-side' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-500">
                    <span>Original ({file.name})</span>
                    <span>{formatBytes(file.size)}</span>
                  </div>
                  <div className="h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Original"
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                    <span>Compressed Result</span>
                    <span>{compressedResult ? formatBytes(compressedResult.compressedSize) : 'Processing...'}</span>
                  </div>
                  <div className="h-64 sm:h-80 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-teal-500/30 flex items-center justify-center p-2 relative">
                    {isProcessing ? (
                      <div className="flex flex-col items-center gap-2 text-xs text-teal-600">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span>Applying compression...</span>
                      </div>
                    ) : compressedResult?.dataUrl ? (
                      <img
                        src={compressedResult.dataUrl}
                        alt="Compressed"
                        className="max-h-full max-w-full object-contain rounded-lg"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-80 sm:h-96 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-2">
                {compressedResult?.dataUrl && (
                  <img
                    src={compressedResult.dataUrl}
                    alt="Compressed Full Preview"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
