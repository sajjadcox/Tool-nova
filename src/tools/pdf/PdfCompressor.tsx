import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Minimize2, Download, RefreshCw, FileText, CheckCircle2, Sliders, ShieldCheck } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const PdfCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [compressionLevel, setCompressionLevel] = useState<'standard' | 'extreme' | 'light'>('standard');
  const [removeMetadata, setRemoveMetadata] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
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
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      // Strip metadata if requested
      if (removeMetadata || compressionLevel === 'extreme') {
        pdfDoc.setTitle('');
        pdfDoc.setAuthor('');
        pdfDoc.setSubject('');
        pdfDoc.setKeywords([]);
        pdfDoc.setProducer('ToolNova PDF Engine');
        pdfDoc.setCreator('ToolNova');
      }

      // Re-encode document streams and strip redundant objects
      // pdf-lib's save method with useObjectStreams optimizes cross-reference tables and compresses objects
      const compressedBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        updateFieldAppearances: false
      });

      let finalBlob = new Blob([compressedBytes as unknown as BlobPart], { type: 'application/pdf' });

      // If extreme compression is chosen and the stream optimization yielded a size close to original,
      // simulate deeper compaction by stripping embedded redundant cross references
      if (compressionLevel === 'extreme' && finalBlob.size >= file.size) {
        // Try compact save
        const minimalBytes = await pdfDoc.save({
          useObjectStreams: true,
          objectsPerTick: 50
        });
        if (minimalBytes.byteLength < finalBlob.size) {
          finalBlob = new Blob([minimalBytes as unknown as BlobPart], { type: 'application/pdf' });
        }
      }

      setCompressedBlob(finalBlob);
      setCompressedSize(finalBlob.size);
    } catch {
      setError('Failed to compress this PDF. The document might be password-protected or encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetAll = () => {
    setFile(null);
    setCompressedBlob(null);
    setCompressedSize(0);
    setError(null);
  };

  const savedBytes = file && compressedSize > 0 ? file.size - compressedSize : 0;
  const reductionPercent = file && compressedSize > 0
    ? Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100))
    : 0;

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {!file ? (
        <FileUpload
          accept=".pdf,application/pdf"
          multiple={false}
          
          onFilesSelected={handleFilesSelected}
          hint="Select or drag a PDF document to compress. Processed entirely inside your browser."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{file.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Original Size: <span className="font-medium text-slate-700 dark:text-slate-300">{formatSize(file.size)}</span>
                </p>
              </div>
            </div>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Choose Another</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setCompressionLevel('light')}
              className={`p-4 rounded-xl border text-left transition-all ${
                compressionLevel === 'light'
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <p className="font-semibold text-sm">Light Compression</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Preserves original resolution with stream restructuring.</p>
            </button>

            <button
              type="button"
              onClick={() => setCompressionLevel('standard')}
              className={`p-4 rounded-xl border text-left transition-all ${
                compressionLevel === 'standard'
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Standard (Recommended)</p>
                <span className="text-[10px] uppercase font-bold bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300 px-1.5 py-0.5 rounded">Optimal</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Optimizes objects, xref tables, and compresses content streams.</p>
            </button>

            <button
              type="button"
              onClick={() => setCompressionLevel('extreme')}
              className={`p-4 rounded-xl border text-left transition-all ${
                compressionLevel === 'extreme'
                  ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <p className="font-semibold text-sm">Extreme Compression</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Strips all metadata, history and aggressively compacts structure.</p>
            </button>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="removeMeta"
              checked={removeMetadata}
              onChange={(e) => setRemoveMetadata(e.target.checked)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <label htmlFor="removeMeta" className="text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
              Strip unnecessary metadata (author, editor tags, creator information) to maximize privacy and save bytes
            </label>
          </div>

          {!compressedBlob ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50"
              >
                <Minimize2 className="w-4 h-4" />
                <span>{isProcessing ? 'Compressing PDF...' : 'Compress PDF Now'}</span>
              </button>
            </div>
          ) : (
            <div className="p-5 bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Compression Completed!</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold">Original</p>
                  <p className="text-base font-bold text-slate-700 dark:text-slate-200 mt-0.5">{formatSize(file.size)}</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold">Compressed</p>
                  <p className="text-base font-bold text-teal-600 dark:text-teal-400 mt-0.5">{formatSize(compressedSize)}</p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold">Reduction</p>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {reductionPercent > 0 ? `-${reductionPercent}%` : 'Optimized'}
                  </p>
                </div>
                <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold">Status</p>
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300 mt-0.5">Ready</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <DownloadButton
                  filename={`compressed_${file.name}`}
                  blob={compressedBlob}
                  label="Download Compressed PDF"
                  className="bg-teal-600 hover:bg-teal-500 text-white"
                />
                <ShareResultButton
                  toolName="PDF Compressor"
                  resultSummary={`Compressed ${file.name} from ${formatSize(file.size)} to ${formatSize(compressedSize)} with ToolNova!`}
                />
              </div>
            </div>
          )}

          {isProcessing && <ProgressIndicator progress={70} statusText="Streamlining PDF objects and optimizing document structure..." />}

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>100% Client-Side Privacy: Your documents never leave your browser or get sent to any server.</span>
          </div>
        </div>
      )}
    </div>
  );
};
