import React from 'react';
import { Loader2 } from 'lucide-react';

interface ProgressIndicatorProps {
  progress?: number; // 0 to 100
  statusText?: string;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  statusText = 'Processing...',
  className = ''
}) => {
  return (
    <div className={`p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3 ${className}`}>
      <div className="flex items-center justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-teal-600 dark:text-teal-400" />
          <span>{statusText}</span>
        </div>
        {progress !== undefined && <span>{Math.round(progress)}%</span>}
      </div>

      {progress !== undefined && (
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 dark:bg-teal-400 h-full transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
};
