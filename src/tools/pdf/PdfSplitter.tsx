import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Scissors, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';

export const PdfSplitter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'range' | 'single'>('range');
  const [fromPage, setFromPage] = useState<number>(1);
  const [toPage, setToPage] = useState<number>(1);
  const [selectedSinglePage, setSelectedSinglePage] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [splitBlob, setSplitBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.name.toLowerCase().endsWith('.pdf') && selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setPageCount(count);
      setFromPage(1);
      setToPage(count > 1 ? 2 : 1);
      setSelectedSinglePage(1);
      setSplitBlob(null);
    } catch {
      setError('Failed to parse PDF document. It may be encrypted or corrupted.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer);
      const newDoc = await PDFDocument.create();

      let pageIndicesToExtract: number[] = [];

      if (splitMode === 'single') {
        const pageIdx = selectedSinglePage - 1;
        if (pageIdx < 0 || pageIdx >= pageCount) {
          throw new Error('Selected page is outside document range.');
        }
        pageIndicesToExtract = [pageIdx];
      } else {
        const start = Math.max(1, fromPage) - 1;
        const end = Math.min(pageCount, toPage) - 1;
        if (start > end) {
          throw new Error('"From page" cannot be greater than "To page".');
        }
        for (let i = start; i <= end; i++) {
          pageIndicesToExtract.push(i);
        }
      }

      const copiedPages = await newDoc.copyPages(srcDoc, pageIndicesToExtract);
      copiedPages.forEach(p => newDoc.addPage(p));

      const pdfBytes = await newDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setSplitBlob(blob);
    } catch (err: any) {
      setError(err?.message || 'Error extracting pages from PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
    setSplitBlob(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept=".pdf,application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Select a PDF document to split"
          hint="Extract individual pages or custom page ranges."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-red-500" />
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">{file.name}</h4>
                  <span className="text-xs text-teal-600 dark:text-teal-400 font-semibold">{pageCount} total pages</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Split Mode Selector */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => { setSplitMode('range'); setSplitBlob(null); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  splitMode === 'range'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 text-slate-700 dark:text-slate-300'
                }`}
              >
                Page Range (e.g. 1 to 5)
              </button>
              <button
                type="button"
                onClick={() => { setSplitMode('single'); setSplitBlob(null); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  splitMode === 'single'
                    ? 'bg-teal-600 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 text-slate-700 dark:text-slate-300'
                }`}
              >
                Single Page Extraction
              </button>
            </div>

            {/* Range controls */}
            {splitMode === 'range' ? (
              <div className="grid grid-cols-2 gap-4 max-w-xs text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">From Page</label>
                  <input
                    type="number"
                    min="1"
                    max={pageCount}
                    value={fromPage}
                    onChange={(e) => { setFromPage(parseInt(e.target.value) || 1); setSplitBlob(null); }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">To Page</label>
                  <input
                    type="number"
                    min="1"
                    max={pageCount}
                    value={toPage}
                    onChange={(e) => { setToPage(parseInt(e.target.value) || 1); setSplitBlob(null); }}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-xs text-xs">
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Select Page Number</label>
                <input
                  type="number"
                  min="1"
                  max={pageCount}
                  value={selectedSinglePage}
                  onChange={(e) => { setSelectedSinglePage(parseInt(e.target.value) || 1); setSplitBlob(null); }}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                />
              </div>
            )}
          </div>

          {isProcessing && <ProgressIndicator statusText="Extracting pages..." />}

          <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
            <button
              type="button"
              onClick={handleSplit}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <Scissors className="w-4 h-4" />
              <span>Extract Selected Pages</span>
            </button>

            {splitBlob && (
              <DownloadButton
                filename={`split-${splitMode === 'single' ? `page-${selectedSinglePage}` : `pages-${fromPage}-to-${toPage}`}.pdf`}
                blob={splitBlob}
                mimeType="application/pdf"
                label="Download Extracted PDF"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
