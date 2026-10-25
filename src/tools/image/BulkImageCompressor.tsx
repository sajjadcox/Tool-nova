import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { 
  Upload, 
  Download, 
  Trash2, 
  RefreshCw, 
  Sliders, 
  CheckCircle2, 
  FileImage, 
  Archive, 
  Zap, 
  Filter, 
  AlertCircle,
  Clock,
  Layers,
  ArrowDown
} from 'lucide-react';
import { 
  compressSingleImage, 
  formatBytes, 
  CompressionOptions 
} from './compressionEngine';

interface ProcessedItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  percentSaved: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  blob?: Blob;
  previewUrl?: string;
  error?: string;
}

export const BulkImageCompressor: React.FC<{ initialTargetKB?: number }> = ({ initialTargetKB }) => {
  const [items, setItems] = useState<ProcessedItem[]>([]);
  const [quality, setQuality] = useState<number>(0.75);
  const [format, setFormat] = useState<'auto' | 'image/jpeg' | 'image/webp' | 'image/png'>('image/webp');
  const [maxDimension, setMaxDimension] = useState<number>(1920);
  const [targetSizeKB, setTargetSizeKB] = useState<number>(initialTargetKB || 0);
  const [compressionPreset, setCompressionPreset] = useState<'balanced' | 'extreme' | 'target' | 'custom'>(
    initialTargetKB ? 'target' : 'balanced'
  );
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply preset configurations
  const handlePresetChange = (preset: 'balanced' | 'extreme' | 'target' | 'custom') => {
    setCompressionPreset(preset);
    if (preset === 'extreme') {
      setQuality(0.55);
      setMaxDimension(1280);
      setFormat('image/webp');
      setTargetSizeKB(0);
    } else if (preset === 'balanced') {
      setQuality(0.75);
      setMaxDimension(1920);
      setFormat('image/webp');
      setTargetSizeKB(0);
    } else if (preset === 'target') {
      setTargetSizeKB(targetSizeKB || 100);
      setFormat('image/jpeg');
    }
  };

  const handleFilesAdded = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;

    const newItems: ProcessedItem[] = validFiles.map((file, idx) => ({
      id: `${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
      name: file.name,
      originalSize: file.size,
      compressedSize: 0,
      percentSaved: 0,
      status: 'pending'
    }));

    setItems(prev => [...prev, ...newItems]);
    // Auto start batch compression
    processQueue(validFiles, newItems);
  };

  const processQueue = async (files: File[], queuedItems: ProcessedItem[]) => {
    setIsProcessing(true);
    const total = queuedItems.length;
    setProgress({ current: 0, total });

    const options: CompressionOptions = {
      quality,
      format,
      maxDimension,
      targetSizeKB: compressionPreset === 'target' ? targetSizeKB : 0
    };

    // Process in chunks of 4 parallel workers so UI never freezes
    const CHUNK_SIZE = 4;
    let completed = 0;

    for (let i = 0; i < files.length; i += CHUNK_SIZE) {
      const chunkFiles = files.slice(i, i + CHUNK_SIZE);
      const chunkItems = queuedItems.slice(i, i + CHUNK_SIZE);

      await Promise.all(
        chunkFiles.map(async (file, cIdx) => {
          const item = chunkItems[cIdx];
          try {
            // Update item to processing
            setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'processing' } : it));
            const result = await compressSingleImage(file, options);

            setItems(prev => prev.map(it => {
              if (it.id === item.id) {
                return {
                  ...it,
                  status: 'done',
                  compressedSize: result.compressedSize,
                  percentSaved: result.percentSaved,
                  blob: result.blob,
                  previewUrl: result.dataUrl
                };
              }
              return it;
            }));
          } catch (err: any) {
            setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'error', error: err?.message || 'Compression error' } : it));
          } finally {
            completed++;
            setProgress({ current: completed, total });
          }
        })
      );
    }

    setIsProcessing(false);
  };

  const recompressAll = () => {
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
      handleFilesAdded(fileInputRef.current.files);
    }
  };

  const downloadAllAsZip = async () => {
    const readyItems = items.filter(it => it.status === 'done' && it.blob);
    if (readyItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      readyItems.forEach((it) => {
        let ext = '.webp';
        if (format === 'image/jpeg') ext = '.jpg';
        if (format === 'image/png') ext = '.png';
        const baseName = it.name.substring(0, it.name.lastIndexOf('.')) || it.name;
        zip.file(`${baseName}-compressed${ext}`, it.blob!);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `bulk-compressed-images-${readyItems.length}-files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('ZIP creation failed:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const downloadSingle = (item: ProcessedItem) => {
    if (!item.blob) return;
    let ext = '.webp';
    if (format === 'image/jpeg') ext = '.jpg';
    if (format === 'image/png') ext = '.png';
    const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    const url = URL.createObjectURL(item.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-compressed${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    items.forEach(it => {
      if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
    });
    setItems([]);
    setProgress({ current: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Cumulative Metrics
  const totalOriginalBytes = items.reduce((acc, it) => acc + it.originalSize, 0);
  const doneItems = items.filter(it => it.status === 'done');
  const totalCompressedBytes = doneItems.reduce((acc, it) => acc + it.compressedSize, 0);
  const totalBytesSaved = Math.max(0, doneItems.reduce((acc, it) => acc + (it.originalSize - it.compressedSize), 0));
  const overallPercentSaved = totalOriginalBytes > 0 && doneItems.length > 0 
    ? Math.round((totalBytesSaved / doneItems.reduce((acc, it) => acc + it.originalSize, 0)) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-indigo-500/10 border border-teal-500/20 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Unlimited Batch Processor • Up to 1,000+ Images</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Bulk Image Compressor & Optimizer
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Compress hundreds or thousands of JPG, PNG, and WebP images simultaneously in your browser. Zero server uploads, maximum privacy, instant ZIP download.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {doneItems.length > 0 && (
              <button
                type="button"
                onClick={downloadAllAsZip}
                disabled={isZipping || isProcessing}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                {isZipping ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4" />}
                <span>Download All as ZIP ({doneItems.length})</span>
              </button>
            )}
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 dark:bg-slate-800 dark:hover:bg-rose-950/40 dark:text-slate-400 dark:hover:text-rose-400 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Control Presets & Settings */}
      <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Compression Strategy</span>
          </span>
          <span className="text-xs text-slate-500">
            {items.length} files queued
          </span>
        </div>

        {/* Strategy Presets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handlePresetChange('balanced')}
            className={`p-3 rounded-xl border text-left transition-all ${
              compressionPreset === 'balanced'
                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-xs">Recommended</p>
            <p className="text-[11px] text-slate-500">60-75% reduction, crisp visuals</p>
          </button>

          <button
            type="button"
            onClick={() => handlePresetChange('extreme')}
            className={`p-3 rounded-xl border text-left transition-all ${
              compressionPreset === 'extreme'
                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-xs">Maximum (80-90%)</p>
            <p className="text-[11px] text-slate-500">Fastest web loading, high drop</p>
          </button>

          <button
            type="button"
            onClick={() => handlePresetChange('target')}
            className={`p-3 rounded-xl border text-left transition-all ${
              compressionPreset === 'target'
                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-xs">Target File Size</p>
            <p className="text-[11px] text-slate-500">Hit exact KB limit (&lt;100KB)</p>
          </button>

          <button
            type="button"
            onClick={() => handlePresetChange('custom')}
            className={`p-3 rounded-xl border text-left transition-all ${
              compressionPreset === 'custom'
                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-xs">Custom Controls</p>
            <p className="text-[11px] text-slate-500">Manual quality & resolution</p>
          </button>
        </div>

        {/* Detailed Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {compressionPreset === 'target' ? (
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Maximum Target Size per Image:</span>
                <span className="text-teal-600 font-bold">{targetSizeKB || 100} KB</span>
              </label>
              <div className="flex items-center gap-2">
                {[50, 100, 200, 500].map(kb => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => setTargetSizeKB(kb)}
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
                  max="5000"
                  value={targetSizeKB}
                  onChange={(e) => setTargetSizeKB(Math.max(10, parseInt(e.target.value) || 100))}
                  className="w-24 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs text-right font-mono"
                  placeholder="Custom KB"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex justify-between">
                <span>Quality Slider:</span>
                <span className="text-teal-600 font-bold">{Math.round(quality * 100)}%</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="0.95"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Output Format:
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value="image/webp">WebP (Best 70-85% compression)</option>
              <option value="image/jpeg">JPEG (Standard photo compatibility)</option>
              <option value="auto">Auto (Match input format)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Max Dimension:
            </label>
            <select
              value={maxDimension}
              onChange={(e) => setMaxDimension(parseInt(e.target.value, 10))}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <option value={0}>Original Resolution (No downscale)</option>
              <option value={2560}>2560px (2K QHD)</option>
              <option value={1920}>1920px (Full HD Recommended)</option>
              <option value={1280}>1280px (HD Web Banner)</option>
              <option value={800}>800px (Thumbnails & Mobile)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drag & Drop Upload Zone for 1000+ images */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.files) handleFilesAdded(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-teal-500/40 hover:border-teal-500 rounded-3xl p-8 sm:p-12 text-center bg-teal-50/20 dark:bg-teal-950/10 cursor-pointer transition-all hover:scale-[1.005]"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) handleFilesAdded(e.target.files);
          }}
          className="hidden"
        />
        <div className="max-w-md mx-auto space-y-3 pointer-events-none">
          <div className="w-14 h-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-teal-500/30">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Click or Drag & Drop Multiple Images Here
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Supports 1 to 1,000+ files (JPG, PNG, WebP, BMP, GIF). Unlimited total file size. Processed 100% locally on your device.
          </p>
        </div>
      </div>

      {/* Progress Bar during Batch processing */}
      {isProcessing && (
        <div className="bg-white dark:bg-[#131C31] border border-teal-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Compressing in background ({progress.current} / {progress.total})</span>
            </span>
            <span>{Math.round((progress.current / Math.max(1, progress.total)) * 100)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-200"
              style={{ width: `${(progress.current / Math.max(1, progress.total)) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Summary Metrics Bar */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Files</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{items.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Original Size</p>
            <p className="text-xl font-black text-slate-700 dark:text-slate-300">{formatBytes(totalOriginalBytes)}</p>
          </div>
          <div className="p-4 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Compressed Size</p>
            <p className="text-xl font-black text-teal-600 dark:text-teal-400">{formatBytes(totalCompressedBytes)}</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase">Total Saved</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {formatBytes(totalBytesSaved)} ({overallPercentSaved}%)
            </p>
          </div>
        </div>
      )}

      {/* Processed Items Table / List */}
      {items.length > 0 && (
        <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Batch Files Queue ({doneItems.length} of {items.length} Ready)
            </h4>
            {doneItems.length > 0 && (
              <button
                type="button"
                onClick={downloadAllAsZip}
                disabled={isZipping}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download All as ZIP</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[500px] overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  {item.previewUrl ? (
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <FileImage className="w-5 h-5" />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>{formatBytes(item.originalSize)}</span>
                      {item.status === 'done' && (
                        <>
                          <span>&rarr;</span>
                          <span className="font-bold text-teal-600 dark:text-teal-400">
                            {formatBytes(item.compressedSize)}
                          </span>
                          <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded text-[10px]">
                            -{item.percentSaved}%
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-teal-600">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span className="hidden sm:inline">Compressing</span>
                    </span>
                  )}
                  {item.status === 'done' && (
                    <button
                      type="button"
                      onClick={() => downloadSingle(item)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-600 dark:bg-slate-800 dark:hover:bg-teal-950/50 dark:text-slate-300 dark:hover:text-teal-300 transition-colors"
                      title="Download this compressed image"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {item.status === 'error' && (
                    <span className="text-rose-500 text-[11px] flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Failed</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
