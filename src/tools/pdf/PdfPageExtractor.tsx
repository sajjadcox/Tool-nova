import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { CopyCheck, Download, RefreshCw, FileText, CheckCircle2, ShieldCheck } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const PdfPageExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pageRangeInput, setPageRangeInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [extractedBlob, setExtractedBlob] = useState<Blob | null>(null);
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
      const count = doc.getPageCount();
      setFile(selected);
      setTotalPages(count);
      setSelectedPages([1]);
      setPageRangeInput('1');
      setExtractedBlob(null);
    } catch {
      setError('Could not open PDF. It may be password-protected or corrupt.');
    } finally {
      setIsProcessing(false);
    }
  };

  const parseRange = (input: string, max: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map(s => s.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(max, end); i++) {
            pages.add(i);
          }
        }
      } else {
        const page = parseInt(part, 10);
        if (!isNaN(page) && page >= 1 && page <= max) {
          pages.add(page);
        }
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleRangeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPageRangeInput(val);
    const parsed = parseRange(val, totalPages);
    setSelectedPages(parsed);
    setExtractedBlob(null);
  };

  const togglePage = (pageNumber: number) => {
    let next: number[];
    if (selectedPages.includes(pageNumber)) {
      next = selectedPages.filter(p => p !== pageNumber);
    } else {
      next = [...selectedPages, pageNumber].sort((a, b) => a - b);
    }
    setSelectedPages(next);
    setPageRangeInput(next.join(', '));
    setExtractedBlob(null);
  };

  const handleExtract = async () => {
    if (!file || selectedPages.length === 0) {
      setError('Please select at least one page to extract.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      // Convert 1-based page numbers to 0-based indices
      const pageIndices = selectedPages.map(p => p - 1);
      const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);

      copiedPages.forEach(p => newDoc.addPage(p));

      const newPdfBytes = await newDoc.save();
      const blob = new Blob([newPdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setExtractedBlob(blob);
    } catch {
      setError('Failed to extract selected pages. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setTotalPages(0);
    setSelectedPages([]);
    setPageRangeInput('');
    setExtractedBlob(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {!file ? (
        <FileUpload
          accept=".pdf,application/pdf"
          multiple={false}
          maxSizeMB={50}
          onFilesSelected={handleFilesSelected}
          hint="Upload a PDF file to extract specific pages into a brand new document."
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

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Specify Pages or Ranges to Extract (e.g. 1, 3, 5-8):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={pageRangeInput}
                onChange={handleRangeInputChange}
                placeholder="e.g. 1, 2, 4-6"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={() => {
                  setPageRangeInput('');
                  setSelectedPages([]);
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                Clear
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selected: <span className="font-bold text-teal-600 dark:text-teal-400">{selectedPages.length}</span> page{selectedPages.length === 1 ? '' : 's'}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Or Click to Select / Deselect Pages:</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const all = Array.from({ length: totalPages }, (_, i) => i + 1);
                    setSelectedPages(all);
                    setPageRangeInput(all.join(', '));
                  }}
                  className="text-xs text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                >
                  Select All
                </button>
                <span className="text-slate-300 dark:text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPages([]);
                    setPageRangeInput('');
                  }}
                  className="text-xs text-slate-500 hover:underline font-semibold"
                >
                  Deselect All
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900/50">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                const isSelected = selectedPages.includes(pageNum);
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => togglePage(pageNum)}
                    className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-teal-500'
                    }`}
                  >
                    p.{pageNum}
                  </button>
                );
              })}
            </div>
          </div>

          {!extractedBlob ? (
            <button
              type="button"
              onClick={handleExtract}
              disabled={isProcessing || selectedPages.length === 0}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-50"
            >
              <CopyCheck className="w-4 h-4" />
              <span>{isProcessing ? 'Extracting Pages...' : `Extract ${selectedPages.length} Pages`}</span>
            </button>
          ) : (
            <div className="p-5 bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-semibold">
                <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>Extracted {selectedPages.length} Pages Successfully!</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <DownloadButton
                  filename={`extracted_${file.name}`}
                  blob={extractedBlob}
                  label="Download Extracted PDF"
                  className="bg-teal-600 hover:bg-teal-500 text-white"
                />
                <ShareResultButton
                  toolName="PDF Page Extractor"
                  resultSummary={`Extracted ${selectedPages.length} pages from ${file.name} with ToolNova!`}
                />
              </div>
            </div>
          )}

          {isProcessing && <ProgressIndicator progress={60} statusText="Copying pages and building document..." />}

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Private & In-Browser: All page copying runs locally in client memory.</span>
          </div>
        </div>
      )}
    </div>
  );
};
