import React, { useState } from 'react';
import { FileCheck, RefreshCw, Copy } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { CopyButton } from '../../components/common/CopyButton';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const FileChecksumCalculator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [sha256, setSha256] = useState<string>('');
  const [sha512, setSha512] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    setError(null);
    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const buffer = await selectedFile.arrayBuffer();

      // SHA-256
      const hashBuffer256 = await crypto.subtle.digest('SHA-256', buffer);
      const hash256 = Array.from(new Uint8Array(hashBuffer256))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      setSha256(hash256);

      // SHA-512
      const hashBuffer512 = await crypto.subtle.digest('SHA-512', buffer);
      const hash512 = Array.from(new Uint8Array(hashBuffer512))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      setSha512(hash512);
    } catch {
      setError('Failed to compute file checksum.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setSha256('');
    setSha512('');
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          onFilesSelected={handleFilesSelected}
          label="Select any file to calculate SHA-256 / SHA-512 checksum"
          hint="Calculated in-memory. File never leaves your machine."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">{file.name}</span>
              <span className="text-slate-400">{(file.size / 1024).toFixed(1)} KB</span>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
            >
              Check another file
            </button>
          </div>

          {isProcessing && <ProgressIndicator statusText="Computing cryptographic checksums in browser..." />}

          {sha256 && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                    SHA-256 Checksum
                  </span>
                  <CopyButton textToCopy={sha256} />
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs break-all select-all">
                  {sha256}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                    SHA-512 Checksum
                  </span>
                  <CopyButton textToCopy={sha512} />
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs break-all select-all">
                  {sha512}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
