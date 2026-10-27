import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { 
  Archive, 
  Upload, 
  Download, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  FileText, 
  Sliders, 
  Zap, 
  ShieldCheck,
  Layers,
  FileCheck
} from 'lucide-react';
import { formatBytes } from '../image/compressionEngine';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const ZipCompressor: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [zipName, setZipName] = useState<string>('compressed-archive');
  const [compressionLevel, setCompressionLevel] = useState<number>(9); // Level 9 max deflate
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    if (fileArray.length === 0) return;
    setError(null);
    setFiles(prev => [...prev, ...fileArray]);
    setCompressedBlob(null);
    setCompressedSize(0);
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setCompressedBlob(null);
    setCompressedSize(0);
  };

  const clearAll = () => {
    setFiles([]);
    setCompressedBlob(null);
    setCompressedSize(0);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const totalOriginalBytes = files.reduce((acc, f) => acc + f.size, 0);

  const createCompressedZip = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setProgress(10);
    setError(null);

    try {
      const zip = new JSZip();

      files.forEach((f) => {
        zip.file(f.name, f);
      });

      const zipBlob = await zip.generateAsync(
        {
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {
            level: compressionLevel as any
          }
        },
        (metadata) => {
          setProgress(Math.round(metadata.percent));
        }
      );

      setCompressedBlob(zipBlob);
      setCompressedSize(zipBlob.size);
      setIsProcessing(false);
    } catch (err: any) {
      console.error('ZIP creation failed:', err);
      setError(err?.message || 'Failed to generate compressed ZIP archive.');
      setIsProcessing(false);
    }
  };

  const downloadZip = () => {
    if (!compressedBlob) return;
    const url = URL.createObjectURL(compressedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${zipName.trim() || 'archive'}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const percentSaved = totalOriginalBytes > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((totalOriginalBytes - compressedSize) / totalOriginalBytes) * 100))
    : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-indigo-500/10 border border-teal-500/20 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Multi-File Packer • Level 9 DEFLATE Compression</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ZIP File Packer & Archive Compressor
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Bundle and compress documents, photos, audio, and code into an ultra-compact .zip archive. 100% private in-browser compression.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
            </span>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {/* Upload Zone */}
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
            Click or Drag & Drop Multiple Files to Compress into ZIP
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Add any file types: PDFs, images, code, videos, texts, logs. Unlimited files processed locally in memory.
          </p>
        </div>
      </div>

      {/* Selected Files List & Controls */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Queued Files ({files.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Total uncompressed size: <strong>{formatBytes(totalOriginalBytes)}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  + Add More Files
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold text-rose-600"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Archive settings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  ZIP Archive Filename:
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={zipName}
                    onChange={(e) => setZipName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white outline-none focus:border-teal-500"
                  />
                  <span className="ml-2 font-mono text-slate-500">.zip</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  DEFLATE Compression Level: {compressionLevel === 9 ? 'Level 9 (Maximum Drop)' : `Level ${compressionLevel}`}
                </label>
                <div className="flex gap-2">
                  {[9, 6, 1].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCompressionLevel(lvl)}
                      className={`flex-1 py-1.5 rounded-xl border font-bold text-xs ${
                        compressionLevel === lvl
                          ? 'border-teal-500 bg-teal-500/10 text-teal-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {lvl === 9 ? 'Ultra (Level 9)' : lvl === 6 ? 'Normal (Level 6)' : 'Fast (Level 1)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* File List View */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-56 overflow-y-auto pr-1">
              {files.map((f, idx) => (
                <div key={`${f.name}-${idx}`} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-4 h-4 text-teal-500 shrink-0" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
                      {f.name}
                    </span>
                    <span className="text-[11px] text-slate-500 shrink-0">
                      ({formatBytes(f.size)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button / Progress */}
          {!isProcessing && !compressedBlob && (
            <button
              type="button"
              onClick={createCompressedZip}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.01]"
            >
              <Archive className="w-5 h-5 fill-current" />
              <span>Pack & Compress {files.length} Files into ZIP Archive</span>
            </button>
          )}

          {isProcessing && (
            <div className="bg-white dark:bg-[#131C31] border border-teal-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compressing Files using DEFLATE Engine...</span>
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Result Card */}
          {compressedBlob && (
            <div className="bg-white dark:bg-[#131C31] border border-teal-500/30 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>ZIP Archive Created Successfully!</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold border border-emerald-500/20">
                  {percentSaved}% Size Reduction
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Original Total</p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {formatBytes(totalOriginalBytes)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">ZIP Archive Size</p>
                  <p className="text-sm sm:text-base font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                    {formatBytes(compressedSize)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Bytes Saved</p>
                  <p className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatBytes(Math.max(0, totalOriginalBytes - compressedSize))}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={downloadZip}
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {zipName}.zip ({formatBytes(compressedSize)})</span>
                </button>

                <button
                  type="button"
                  onClick={createCompressedZip}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-compress
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
