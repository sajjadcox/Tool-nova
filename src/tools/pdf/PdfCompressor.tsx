import React, { useState } from 'react';
import { 
  Minimize2, 
  Download, 
  RefreshCw, 
  FileText, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck,
  Zap,
  Target,
  Layers,
  ArrowRight
} from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';
import { compressPdfFile, PdfCompressionOptions } from './pdfCompressionEngine';
import { formatBytes } from '../image/compressionEngine';

export const PdfCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionMode, setCompressionMode] = useState<'extreme' | 'balanced' | 'light'>('extreme');
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true);
  const [flattenForms, setFlattenForms] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setError(null);
    setFile(selected);
    setCompressedBlob(null);
    setCompressedSize(0);
    runCompression(selected, compressionMode, removeMetadata, flattenForms);
  };

  const runCompression = async (
    targetFile: File,
    mode: 'extreme' | 'balanced' | 'light',
    stripMeta: boolean,
    flatForms: boolean
  ) => {
    setIsProcessing(true);
    setError(null);

    try {
      const options: PdfCompressionOptions = {
        mode,
        removeMetadata: stripMeta,
        flattenForms: flatForms
      };

      const result = await compressPdfFile(targetFile, options);
      setCompressedBlob(result.blob);
      setCompressedSize(result.compressedSize);
      setPageCount(result.pageCount);
    } catch (err: any) {
      setError('Failed to compress this PDF. The document might be password-protected or encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleModeChange = (newMode: 'extreme' | 'balanced' | 'light') => {
    setCompressionMode(newMode);
    if (file) {
      runCompression(file, newMode, removeMetadata, flattenForms);
    }
  };

  const resetAll = () => {
    setFile(null);
    setCompressedBlob(null);
    setCompressedSize(0);
    setError(null);
  };

  const savedBytes = file && compressedSize > 0 ? Math.max(0, file.size - compressedSize) : 0;
  const reductionPercent = file && compressedSize > 0
    ? Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {!file ? (
        <div className="space-y-4">
          <FileUpload
            accept=".pdf,application/pdf"
            multiple={false}
            onFilesSelected={handleFilesSelected}
            label="Upload PDF to Compress"
            hint="Drag & drop any PDF document • Zero server upload • 100% Client-Side Privacy"
          />

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Stream Compaction</span>
              </span>
              <p className="text-slate-500">Clusters FlateDecode objects to minimize cross-reference overhead.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Zero Server Upload</span>
              </span>
              <p className="text-slate-500">Processing happens entirely inside your browser memory for confidential documents.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>Clean Page Extraction</span>
              </span>
              <p className="text-slate-500">Drops unreferenced orphan dictionaries and embedded XML packets.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Card & Controls */}
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                    {file.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Original Size: <span className="font-mono font-semibold">{formatBytes(file.size)}</span>
                    {pageCount > 0 && <span> • {pageCount} pages</span>}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={resetAll}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 self-start sm:self-auto"
              >
                Change PDF
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Compression Preset</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleModeChange('extreme')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    compressionMode === 'extreme'
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs">Extreme Compaction</p>
                  <p className="text-[11px] text-slate-500">Max reduction for email & uploads</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('balanced')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    compressionMode === 'balanced'
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs">Recommended Balanced</p>
                  <p className="text-[11px] text-slate-500">FlateDecode stream optimization</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('light')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    compressionMode === 'light'
                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-xs">Light Stream Optimizer</p>
                  <p className="text-[11px] text-slate-500">Preserves identical structure</p>
                </button>
              </div>

              <div className="flex items-center gap-6 pt-2 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeMetadata}
                    onChange={(e) => {
                      setRemoveMetadata(e.target.checked);
                      if (file) runCompression(file, compressionMode, e.target.checked, flattenForms);
                    }}
                    className="accent-teal-600 rounded"
                  />
                  <span>Strip metadata & author packets</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={flattenForms}
                    onChange={(e) => {
                      setFlattenForms(e.target.checked);
                      if (file) runCompression(file, compressionMode, removeMetadata, e.target.checked);
                    }}
                    className="accent-teal-600 rounded"
                  />
                  <span>Flatten form annotations</span>
                </label>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          {isProcessing && (
            <div className="p-8 text-center bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
              <RefreshCw className="w-8 h-8 text-teal-600 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                Compressing PDF document...
              </p>
              <p className="text-xs text-slate-500">
                Optimizing object streams and eliminating redundant data.
              </p>
            </div>
          )}

          {/* Result Card */}
          {!isProcessing && compressedBlob && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-black text-lg text-emerald-900 dark:text-emerald-200">
                      {reductionPercent > 0
                        ? `Reduced by ${reductionPercent}% (${formatBytes(savedBytes)} saved)`
                        : 'PDF Successfully Optimized'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Original: <strong className="font-mono">{formatBytes(file.size)}</strong> &rarr; Optimized: <strong className="font-mono">{formatBytes(compressedSize)}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <DownloadButton
                    blob={compressedBlob}
                    filename={`${file.name.replace(/\.pdf$/i, '')}-compressed.pdf`}
                    label={`Download (${formatBytes(compressedSize)})`}
                  />
                  <button
                    type="button"
                    onClick={resetAll}
                    className="p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800 hover:bg-white dark:hover:bg-slate-800 text-emerald-700 dark:text-emerald-300"
                    title="Compress another PDF"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
