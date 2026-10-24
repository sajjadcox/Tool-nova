import React, { useState } from 'react';
import { ArrowUpDown, Copy, Shuffle } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const TextSorter: React.FC = () => {
  const [text, setText] = useState<string>('Zebra\nApple\nMango\nBanana\nOrange');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'length' | 'shuffle'>('asc');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

  const getSortedText = () => {
    const lines = text.split('\n');

    if (sortOrder === 'asc') {
      return [...lines].sort((a, b) => {
        const valA = caseSensitive ? a : a.toLowerCase();
        const valB = caseSensitive ? b : b.toLowerCase();
        return valA.localeCompare(valB);
      }).join('\n');
    } else if (sortOrder === 'desc') {
      return [...lines].sort((a, b) => {
        const valA = caseSensitive ? a : a.toLowerCase();
        const valB = caseSensitive ? b : b.toLowerCase();
        return valB.localeCompare(valA);
      }).join('\n');
    } else if (sortOrder === 'length') {
      return [...lines].sort((a, b) => a.length - b.length).join('\n');
    } else if (sortOrder === 'shuffle') {
      const copy = [...lines];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy.join('\n');
    }
    return text;
  };

  const output = getSortedText();

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <span>Sort By:</span>
          {[
            { id: 'asc', label: 'A to Z (Ascending)' },
            { id: 'desc', label: 'Z to A (Descending)' },
            { id: 'length', label: 'Line Length' },
            { id: 'shuffle', label: 'Random Shuffle' }
          ].map(opt => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSortOrder(opt.id as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                sortOrder === opt.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded text-teal-600"
          />
          <span>Case Sensitive</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Input Lines</label>
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">Sorted Lines</label>
            <CopyButton textToCopy={output} />
          </div>
          <textarea
            rows={10}
            readOnly
            value={output}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
