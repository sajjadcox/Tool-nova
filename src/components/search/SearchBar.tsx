import React, { useRef, useEffect } from 'react';
import { Search, X, Command } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  categories?: { id: string; name: string }[];
  resultCount?: number;
  className?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search 255+ tools (e.g. bulk image compress, pdf compress, youtube, cgpa, gpa, json...)',
  selectedCategory,
  onSelectCategory,
  categories = [],
  resultCount,
  className = '',
  autoFocus = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Global hotkey: Ctrl+K or '/' focuses the search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`w-full space-y-3 ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full pl-12 pr-28 py-3.5 bg-white dark:bg-[#131C31] text-slate-900 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm focus:border-teal-500 dark:focus:border-teal-400 focus:ring-4 focus:ring-teal-500/10 dark:focus:ring-teal-400/10 text-sm md:text-base outline-none transition-all placeholder:text-slate-400"
        />

        <div className="absolute right-3.5 flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Category Pills & Result Count */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categories.length > 0 && onSelectCategory && (
          <div className="flex items-center gap-1.5 flex-nowrap">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1 rounded-full font-medium transition-all shrink-0 ${
                !selectedCategory || selectedCategory === 'all'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50'
              }`}
            >
              All
            </button>
            {categories.slice(0, 8).map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCategory(c.id)}
                className={`px-3 py-1 rounded-full font-medium transition-all shrink-0 ${
                  selectedCategory === c.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {resultCount !== undefined && (
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 shrink-0 ml-auto">
            {resultCount} {resultCount === 1 ? 'tool' : 'tools'}
          </span>
        )}
      </div>
    </div>
  );
};
