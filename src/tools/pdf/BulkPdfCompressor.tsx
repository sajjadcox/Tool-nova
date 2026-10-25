import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  RefreshCw, 
  Sliders, 
  CheckCircle2, 
  Archive, 
  Zap, 
  AlertCircle,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { compressPdfFile, PdfCompressionOptions } from './pdfCompressionEngine';
import { formatBytes } from '../image/compressionEngine';

interface PdfItem {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  percentSaved: number;
  pageCount: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  blob?: Blob;
  error?: string;
}

export const BulkPdfCompressor: React.FC = () => {
  const [items, setItems] = useState<PdfItem[]>([]);
  const [mode, setMode] = useState<'extreme' | 'balanced' | 'light'>('extreme');
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true);
  const [flattenForms, setFlattenForms] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesAdded = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(
      f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (validFiles.length === 0) return;

    const newItems: PdfItem[] = validFiles.map((f, i) => ({
      id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      name: f.name,
      originalSize: f.size,
      compressedSize: 0,
      percentSaved: 0,
      pageCount: 0,
      status: 'pending'
    }));

    setItems(prev => [...prev, ...newItems]);
    processQueue(validFiles, newItems);
  };

  const processQueue = async (files: File[], queuedItems: PdfItem[]) => {
    setIsProcessing(true);
    const total = queuedItems.length;
    setProgress({ current: 0, total });

    const options: PdfCompressionOptions = {
      mode,
      removeMetadata,
      flattenForms
    };

    let completed = 0;
    // Process sequentially or in pairs of 2 to keep memory optimal for large multi-page PDFs
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const item = queuedItems[i];
      try {
        setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'processing' } : it));
        const res = await compressPdfFile(file, options);

        setItems(prev => prev.map(it => {
          if (it.id === item.id) {
            return {
              ...it,
              status: 'done',
              compressedSize: res.compressedSize,
              percentSaved: res.percentSaved,
              pageCount: res.pageCount,
              blob: res.blob
            };
          }
          return it;
        }));
      } catch (err: any) {
        setItems(prev => prev.map(it => it.id === item.id ? { ...it, status: 'error', error: err?.message || 'Compression failed' } : it));
      } finally {
        completed++;
        setProgress({ current: completed, total });
      }
    }

    setIsProcessing(false);
  };

  const downloadAllAsZip = async () => {
    const readyItems = items.filter(it => it.status === 'done' && it.blob);
    if (readyItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      readyItems.forEach(it => {
        const baseName = it.name.replace(/\.pdf$/i, '');
        zip.file(`${baseName}-compressed.pdf`, it.blob!);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `bulk-compressed-pdfs-${readyItems.length}-files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('ZIP packaging failed:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const downloadSingle = (item: PdfItem) => {
    if (!item.blob) return;
    const baseName = item.name.replace(/\.pdf$/i, '');
    const url = URL.createObjectURL(item.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}-compressed.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setItems([]);
    setProgress({ current: 0, total: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Metrics
  const totalOriginalBytes = items.reduce((acc, it) => acc + it.originalSize, 0);
  const doneItems = items.filter(it => it.status === 'done');
  const totalCompressedBytes = doneItems.reduce((acc, it) => acc + it.compressedSize, 0);
  const totalBytesSaved = Math.max(0, doneItems.reduce((acc, it) => acc + (it.originalSize - it.compressedSize), 0));
  const overallPercentSaved = doneItems.length > 0 
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
              <span>Unlimited Batch PDF Compaction • 100% In-Browser</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Bulk PDF Compressor
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Compress multiple PDF documents together without server uploads. Strips redundant streams, compresses font dictionaries, and flattens forms for smaller file sizes.
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

      {/* Control Presets */}
      <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Compression Strategy</span>
          </span>
          <span className="text-xs text-slate-500">{items.length} PDFs in queue</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setMode('extreme')}
            className={`p-3 rounded-xl border text-left transition-all ${
              mode === 'extreme'
                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-xs">Extreme Compaction</p>
            <p className="text-[11px] text-slate-500">Deep stream clustering & clean pass</p>
          </button>

          <button
            type="button"
            onClick={() => setMode('balanced')}
            className={`p-3 rounded-xl border text-left transition-all ${
              mode === 'balanced'
                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-xs">Recommended Balanced</p>
            <p className="text-[11px] text-slate-500">Standard FlateDecode object streams</p>
          </button>

          <button
            type="button"
            onClick={() => setMode('light')}
            className={`p-3 rounded-xl border text-left transition-all ${
              mode === 'light'
                ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <p className="font-bold text-xs">Light Stream Optimization</p>
            <p className="text-[11px] text-slate-500">Zero modification of page elements</p>
          </button>
        </div>

        <div className="flex items-center gap-6 pt-1 text-xs text-slate-600 dark:text-slate-300 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeMetadata}
              onChange={(e) => setRemoveMetadata(e.target.checked)}
              className="accent-teal-600 rounded"
            />
            <span>Strip document metadata & author tags</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={flattenForms}
              onChange={(e) => setFlattenForms(e.target.checked)}
              className="accent-teal-600 rounded"
            />
            <span>Flatten interactive form fields</span>
          </label>
        </div>
      </div>

      {/* Upload Drop Zone */}
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
          accept=".pdf,application/pdf"
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
            Click or Drag & Drop Multiple PDF Files Here
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select 1, 10, 50, or unlimited PDF files. Safe, client-side, zero cloud upload.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {isProcessing && (
        <div className="bg-white dark:bg-[#131C31] border border-teal-500/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Optimizing PDF streams ({progress.current} / {progress.total})</span>
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

      {/* Metrics Bar */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-semibold text-slate-500 uppercase">Total PDFs</p>
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

      {/* Processed Items List */}
      {items.length > 0 && (
        <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              PDF Batch Queue ({doneItems.length} of {items.length} Ready)
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
                  <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>

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
                          <span>• {item.pageCount} pages</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.status === 'processing' && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-teal-600">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span className="hidden sm:inline">Optimizing</span>
                    </span>
                  )}
                  {item.status === 'done' && (
                    <button
                      type="button"
                      onClick={() => downloadSingle(item)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-600 dark:bg-slate-800 dark:hover:bg-teal-950/50 dark:text-slate-300 dark:hover:text-teal-300 transition-colors"
                      title="Download this compressed PDF"
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
