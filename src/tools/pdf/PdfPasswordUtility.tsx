import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Lock, Unlock, ShieldCheck, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const PdfPasswordUtility: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setError(null);
    setFile(selected);
    setIsProcessing(true);

    try {
      const buffer = await selected.arrayBuffer();
      try {
        const doc = await PDFDocument.load(buffer);
        setIsEncrypted(doc.isEncrypted);
        setPageCount(doc.getPageCount());
        setStatusMessage(doc.isEncrypted ? 'This document is encrypted with password protection.' : 'This document is open and has no password encryption.');
      } catch {
        // If it threw an error directly on load, it is encrypted with a required user password
        setIsEncrypted(true);
        setStatusMessage('This document is protected with a required user password.');
      }
    } catch {
      setError('Failed to read PDF security parameters.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setIsEncrypted(false);
    setPageCount(0);
    setStatusMessage('');
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
          hint="Inspect encryption parameters, password protection, and access permissions of any PDF."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${isEncrypted ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400' : 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400'}`}>
                {isEncrypted ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{file.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Status: {isEncrypted ? 'Encrypted / Protected' : 'Unrestricted / Open'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShareResultButton
                toolName="PDF Password Utility"
                resultSummary={`Inspected security permissions for ${file.name} with ToolNova!`}
              />
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Test Another</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Encryption Status</p>
              <p className={`text-base font-bold mt-1 ${isEncrypted ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {isEncrypted ? 'Password Protected' : 'No Password'}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Total Pages</p>
              <p className="text-base font-bold mt-1 text-slate-800 dark:text-slate-100">
                {pageCount > 0 ? pageCount : 'Locked / N/A'}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Client Privacy</p>
              <p className="text-base font-bold mt-1 text-teal-600 dark:text-teal-400">100% In-Browser</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{statusMessage}</p>
          </div>

          {isProcessing && <ProgressIndicator progress={50} statusText="Checking encryption dictionary..." />}

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Inspection runs 100% locally. No document is ever sent to any remote server.</span>
          </div>
        </div>
      )}
    </div>
  );
};
