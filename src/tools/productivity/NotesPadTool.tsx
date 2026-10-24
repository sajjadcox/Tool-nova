import React, { useState, useEffect } from 'react';
import { FileEdit, Download, Trash2, CheckCircle2 } from 'lucide-react';
import { DownloadButton } from '../../components/common/DownloadButton';
import { CopyButton } from '../../components/common/CopyButton';

const STORAGE_KEY = 'toolnova_private_notes';

export const NotesPadTool: React.FC = () => {
  const [content, setContent] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'Welcome to your private offline scratchpad!\n\n- Everything you type here is auto-saved locally on your device.\n- No account required.\n- Zero cloud storage: completely private to your web browser.\n- Export anytime to a clean .txt file.';
    } catch {
      return '';
    }
  });

  const [savedTime, setSavedTime] = useState<string>('Saved just now');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, content);
      setSavedTime(`Saved at ${new Date().toLocaleTimeString()}`);
    } catch {
      // ignore
    }
  }, [content]);

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const chars = content.length;

  const handleClear = () => {
    if (window.confirm('Clear all scratchpad text?')) {
      setContent('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-teal-600 dark:text-teal-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedTime}</span>
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 font-mono">{words} words, {chars} characters</span>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton textToCopy={content} label="Copy Notes" />
          <DownloadButton
            filename="notes.txt"
            content={content}
            label="Download .txt"
          />
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
            title="Clear notes"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <textarea
        rows={18}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your private notes..."
        className="w-full p-6 text-sm font-sans rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500 leading-relaxed transition-colors shadow-xs"
      />
    </div>
  );
};
