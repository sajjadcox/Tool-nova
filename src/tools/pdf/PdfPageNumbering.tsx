import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Hash, Download, RefreshCw, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const PdfPageNumbering: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [format, setFormat] = useState<string>('page_of_total'); // 'page_of_total' | 'simple' | 'hyphen'
  const [position, setPosition] = useState<string>('bottom-center'); // 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-center'
  const [fontSize, setFontSize] = useState<number>(10);
  const [startFrom, setStartFrom] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [numberedBlob, setNumberedBlob] = useState<Blob | null>(null);
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
      setNumberedBlob(null);
    } catch {
      setError('Could not open PDF document. It may be encrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyNumbering = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const helvetica = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();

      pages.forEach((page, index) => {
        const { width, height } = page.getSize();
        const currentNum = index + startFrom;
        let text = `${currentNum}`;

        if (format === 'page_of_total') {
          text = `Page ${currentNum} of ${totalPages + startFrom - 1}`;
        } else if (format === 'hyphen') {
          text = `- ${currentNum} -`;
        } else if (format === 'slash') {
          text = `${currentNum} / ${totalPages + startFrom - 1}`;
        }

        const textWidth = helvetica.widthOfTextAtSize(text, fontSize);
        const margin = 30;

        let x = width / 2 - textWidth / 2;
        let y = margin;

        if (position === 'bottom-left') {
          x = margin;
          y = margin;
        } else if (position === 'bottom-right') {
          x = width - textWidth - margin;
          y = margin;
        } else if (position === 'bottom-center') {
          x = width / 2 - textWidth / 2;
          y = margin;
        } else if (position === 'top-center') {
          x = width / 2 - textWidth / 2;
          y = height - margin;
        } else if (position === 'top-right') {
          x = width - textWidth - margin;
          y = height - margin;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font: helvetica,
          color: rgb(0.3, 0.3, 0.3)
        });
      });

      const numberedBytes = await doc.save();
      const blob = new Blob([numberedBytes as unknown as BlobPart], { type: 'application/pdf' });
      setNumberedBlob(blob);
    } catch {
      setError('Failed to apply page numbers. Please verify document formatting.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setTotalPages(0);
    setNumberedBlob(null);
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
          hint="Upload any PDF file to stamp clean page numbers across all pages."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{file.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total: {totalPages} pages</p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Numbering Format</label>
              <select
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value);
                  setNumberedBlob(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
              >
                <option value="page_of_total">Page X of Y</option>
                <option value="slash">X / Y</option>
                <option value="simple">X (Number only)</option>
                <option value="hyphen">- X -</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Position</label>
              <select
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value);
                  setNumberedBlob(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
              >
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Font Size (pt)</label>
              <input
                type="number"
                min="8"
                max="24"
                value={fontSize}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  setFontSize(Number(e.target.value) || 10);
                  setNumberedBlob(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Start Number</label>
              <input
                type="number"
                min="1"
                value={startFrom}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  setStartFrom(Number(e.target.value) || 1);
                  setNumberedBlob(null);
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {!numberedBlob ? (
            <button
              type="button"
              onClick={handleApplyNumbering}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50"
            >
              <Hash className="w-4 h-4" />
              <span>{isProcessing ? 'Stamping Numbers...' : 'Add Page Numbers'}</span>
            </button>
          ) : (
            <div className="p-5 bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Page Numbers Added to All {totalPages} Pages!</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <DownloadButton
                  filename={`numbered_${file.name}`}
                  blob={numberedBlob}
                  label="Download Numbered PDF"
                  className="bg-teal-600 hover:bg-teal-500 text-white"
                />
                <ShareResultButton
                  toolName="PDF Page Numbering"
                  resultSummary={`Numbered ${totalPages} pages on ${file.name} with ToolNova!`}
                />
              </div>
            </div>
          )}

          {isProcessing && <ProgressIndicator progress={75} statusText="Embedding font and numbering pages..." />}

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Document processed in browser memory. No data is stored or uploaded.</span>
          </div>
        </div>
      )}
    </div>
  );
};
