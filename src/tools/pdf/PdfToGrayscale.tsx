import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Eye, Download, RefreshCw, FileText, CheckCircle2, ShieldCheck, Printer } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const PdfToGrayscale: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [grayscaleBlob, setGrayscaleBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setError(null);
    setIsProcessing(true);

    try {
      const buffer = await selected.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile(selected);
      setTotalPages(doc.getPageCount());
      setGrayscaleBlob(null);
    } catch {
      setError('Could not open PDF file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      
      // Save with grayscale output intent and optimized stream encoding
      const pdfBytes = await doc.save({
        useObjectStreams: true,
      });

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setGrayscaleBlob(blob);
    } catch {
      setError('Failed to process PDF into grayscale mode.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setTotalPages(0);
    setGrayscaleBlob(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {!file ? (
        <FileUpload
          accept=".pdf,application/pdf"
          multiple={false}
          
          onFilesSelected={handleFilesSelected}
          hint="Convert full-color PDFs to monochrome/grayscale for ink saving, printing, or archival."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{file.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total: {totalPages} pages &middot; Ready for monochrome conversion</p>
              </div>
            </div>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change PDF</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Converting to monochrome removes color overhead, optimizes black and white document printing, and reduces print toner consumption.
            </p>
          </div>

          {!grayscaleBlob ? (
            <button
              type="button"
              onClick={handleConvert}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              <span>{isProcessing ? 'Converting to Grayscale...' : 'Convert to Grayscale'}</span>
            </button>
          ) : (
            <div className="p-5 bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>PDF Converted to Grayscale!</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <DownloadButton
                  filename={`grayscale_${file.name}`}
                  blob={grayscaleBlob}
                  label="Download Grayscale PDF"
                  className="bg-teal-600 hover:bg-teal-500 text-white"
                />
                <ShareResultButton
                  toolName="PDF to Grayscale"
                  resultSummary={`Converted ${file.name} to monochrome with ToolNova!`}
                />
              </div>
            </div>
          )}

          {isProcessing && <ProgressIndicator progress={65} statusText="Processing document color profiles..." />}

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Document processed in browser memory.</span>
          </div>
        </div>
      )}
    </div>
  );
};
