import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Layers, FileText, ArrowUp, ArrowDown, Trash2, CheckCircle2 } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number;
}

export const PdfMerger: React.FC = () => {
  const [pdfFiles, setPdfFiles] = useState<PdfFileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    const valid = files.filter(f => f.name.toLowerCase().endsWith('.pdf') || f.type === 'application/pdf');
    if (valid.length === 0) {
      setError('Please select valid PDF documents.');
      return;
    }
    setError(null);
    setIsProcessing(true);

    const items: PdfFileItem[] = [];
    for (const f of valid) {
      try {
        const buffer = await f.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        items.push({
          id: Math.random().toString(36).substring(2),
          file: f,
          pageCount: doc.getPageCount()
        });
      } catch {
        setError(`Failed to read "${f.name}". It may be password-protected or corrupted.`);
      }
    }

    setPdfFiles(prev => [...prev, ...items]);
    setMergedBlob(null);
    setIsProcessing(false);
  };

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
    setMergedBlob(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    setPdfFiles(prev => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return copy;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
    setMergedBlob(null);
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      setError('Please upload at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfFiles) {
        const fileBuffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(srcDoc, srcDoc.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setMergedBlob(blob);
    } catch (err: any) {
      setError(err?.message || 'Error merging PDF files.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPages = pdfFiles.reduce((acc, f) => acc + f.pageCount, 0);

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      <FileUpload
        accept=".pdf,application/pdf"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        label="Select multiple PDF documents to merge"
        hint="Combine PDFs into one document in your exact desired order."
      />

      {pdfFiles.length > 0 && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{pdfFiles.length} files selected • </span>
              <span className="text-teal-600 dark:text-teal-400 font-bold">{totalPages} total pages</span>
            </div>
            <button
              type="button"
              onClick={() => { setPdfFiles([]); setMergedBlob(null); }}
              className="text-xs text-red-500 hover:underline font-medium"
            >
              Clear all
            </button>
          </div>

          {/* List of PDFs */}
          <div className="space-y-2">
            {pdfFiles.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-xs"
              >
                <div className="flex items-center gap-3 truncate pr-2">
                  <div className="w-7 h-7 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {item.file.name}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {(item.file.size / 1024).toFixed(1)} KB • {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveFile(idx, 'up')}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === pdfFiles.length - 1}
                    onClick={() => moveFile(idx, 'down')}
                    className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isProcessing && <ProgressIndicator statusText="Combining PDF streams..." />}

          <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
            <button
              type="button"
              onClick={handleMerge}
              disabled={isProcessing || pdfFiles.length < 2}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <Layers className="w-4 h-4" />
              <span>Merge Documents</span>
            </button>

            {mergedBlob && (
              <DownloadButton
                filename="merged-document.pdf"
                blob={mergedBlob}
                mimeType="application/pdf"
                label="Download Merged PDF"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
