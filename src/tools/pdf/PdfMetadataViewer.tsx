import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileCheck2, RefreshCw } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const PdfMetadataViewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<{
    pageCount: number;
    title: string;
    author: string;
    subject: string;
    creator: string;
    producer: string;
    creationDate: string;
    modDate: string;
    fileSize: number;
  } | null>(null);
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

      setMeta({
        pageCount: doc.getPageCount(),
        title: doc.getTitle() || 'Not specified',
        author: doc.getAuthor() || 'Not specified',
        subject: doc.getSubject() || 'Not specified',
        creator: doc.getCreator() || 'Not specified',
        producer: doc.getProducer() || 'Not specified',
        creationDate: doc.getCreationDate() ? doc.getCreationDate()!.toLocaleString() : 'Not recorded',
        modDate: doc.getModificationDate() ? doc.getModificationDate()!.toLocaleString() : 'Not recorded',
        fileSize: selectedFile.size
      });
    } catch {
      setError('Failed to extract PDF metadata. The document might be corrupted or encrypted.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setMeta(null);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept=".pdf,application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Select a PDF to inspect metadata"
          hint="Inspect author, producer, creation date, and document properties."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Inspect Another PDF</span>
            </button>
          </div>

          {meta && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Document Title</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {meta.title}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Author</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {meta.author}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Page Count</span>
                <span className="text-sm font-bold text-teal-600 dark:text-teal-400 font-mono">
                  {meta.pageCount} pages
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Producer Application</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {meta.producer}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Created Date</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
                  {meta.creationDate}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">File Size</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {(meta.fileSize / 1024).toFixed(1)} KB
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
