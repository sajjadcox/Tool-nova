import React from 'react';
import { Trash2, X } from 'lucide-react';

interface ClearButtonProps {
  onClear: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const ClearButton: React.FC<ClearButtonProps> = ({
  onClear,
  label = 'Clear',
  className = '',
  disabled = false
}) => {
  return (
    <button
      type="button"
      onClick={onClear}
      disabled={disabled}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700/80 hover:border-rose-300 dark:hover:border-rose-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
      title="Clear text"
      aria-label="Clear text"
    >
      <X className="w-3.5 h-3.5" />
      <span>{label}</span>
    </button>
  );
};
