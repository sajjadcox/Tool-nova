import React, { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onFilesSelected: (files: File[]) => void;
  label?: string;
  hint?: string;
  className?: string;
  selectedFiles?: File[];
  onClear?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept,
  maxSizeMB = 50,
  multiple = false,
  onFilesSelected,
  label = 'Click to upload or drag & drop',
  hint = 'Secure, 100% private in-browser processing. Files never leave your device.',
  className = '',
  selectedFiles = [],
  onClear
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);

    const validFiles: File[] = [];
    const maxBytes = maxSizeMB * 1024 * 1024;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > maxBytes) {
        setError(`File "${file.name}" exceeds the maximum size limit of ${maxSizeMB}MB.`);
        return;
      }
      validFiles.push(file);
      if (!multiple) break;
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 scale-[0.99]'
            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 hover:border-teal-500/80 hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {label}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {accept ? `Supports: ${accept}` : 'All formats supported'} • Up to {maxSizeMB}MB
            </p>
          </div>

          <p className="text-[11px] text-teal-600 dark:text-teal-400/90 font-medium bg-teal-50 dark:bg-teal-950/30 px-2.5 py-1 rounded-full border border-teal-200/60 dark:border-teal-800/60">
            🔒 {hint}
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {selectedFiles && selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Selected {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'}</span>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="text-red-600 dark:text-red-400 hover:underline flex items-center gap-1 font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {selectedFiles.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  <File className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{f.name}</span>
                  <span className="text-slate-400 shrink-0">({formatFileSize(f.size)})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
