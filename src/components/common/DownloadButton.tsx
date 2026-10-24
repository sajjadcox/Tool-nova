import React from 'react';
import { Download } from 'lucide-react';

interface DownloadButtonProps {
  filename: string;
  dataUrl?: string;
  blob?: Blob;
  content?: string;
  mimeType?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  filename,
  dataUrl,
  blob,
  content,
  mimeType = 'text/plain;charset=utf-8',
  label = 'Download',
  className = '',
  disabled = false
}) => {
  const handleDownload = () => {
    if (disabled) return;

    let downloadHref = dataUrl;
    let shouldRevoke = false;

    if (!downloadHref) {
      if (blob) {
        downloadHref = URL.createObjectURL(blob);
        shouldRevoke = true;
      } else if (content !== undefined) {
        const textBlob = new Blob([content], { type: mimeType });
        downloadHref = URL.createObjectURL(textBlob);
        shouldRevoke = true;
      }
    }

    if (!downloadHref) return;

    const link = document.createElement('a');
    link.href = downloadHref;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (shouldRevoke) {
      setTimeout(() => URL.revokeObjectURL(downloadHref as string), 1000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={disabled || (!dataUrl && !blob && content === undefined)}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98] transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Download className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};
