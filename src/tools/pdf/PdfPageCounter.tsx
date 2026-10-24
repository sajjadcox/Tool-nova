import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileSearch, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const PdfPageCounter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
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

    try {
      const buffer = await selectedFile.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setPageCount(doc.getPageCount());
      setTitle(doc.getTitle() || 'Untitled');
      setAuthor(doc.getAuthor() || 'Unknown Author');
    } catch {
      setError('Failed to inspect PDF document.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(null);
    setTitle(null);
    setAuthor(null);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept=".pdf,application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Select a PDF to count pages"
          hint="Instantly count pages without uploading the file to any server."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Count Another PDF</span>
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-teal-600 text-white flex items-center justify-center mx-auto shadow-md">
              <FileSearch className="w-8 h-8" />
            </div>

            <div>
              <span className="text-4xl md:text-5xl font-extrabold text-teal-700 dark:text-teal-300 font-mono">
                {pageCount}
              </span>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                Total {pageCount === 1 ? 'Page' : 'Pages'} in Document
              </p>
            </div>

            <div className="pt-4 border-t border-teal-200/60 dark:border-teal-900/60 max-w-sm mx-auto text-xs text-slate-500 space-y-1">
              <p className="truncate"><strong>File:</strong> {file.name}</p>
              <p><strong>Size:</strong> {(file.size / 1024).toFixed(1)} KB</p>
              {title && <p className="truncate"><strong>Title:</strong> {title}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
