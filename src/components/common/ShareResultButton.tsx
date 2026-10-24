import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

interface ShareResultButtonProps {
  toolName: string;
  resultSummary?: string;
  className?: string;
}

export const ShareResultButton: React.FC<ShareResultButtonProps> = ({
  toolName,
  resultSummary,
  className = ''
}) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const appUrl = window.location.href;
    const shareText = resultSummary 
      ? `${resultSummary}\n\nGenerated with ToolNova Tool Kit (${toolName}) - Every Tool You Need. All in One Place.\n${appUrl}`
      : `Check out ${toolName} on ToolNova Tool Kit - Every Tool You Need. All in One Place.\n${appUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${toolName} - ToolNova Tool Kit`,
          text: shareText,
          url: appUrl,
        });
        return;
      } catch (err: any) {
        // User cancelled or not supported; fallback to clipboard
        if (err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
        copied
          ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400'
      } ${className}`}
      title="Share result with ToolNova Tool Kit branding"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
      <span>{copied ? 'Copied with Link!' : 'Share Result'}</span>
    </button>
  );
};
