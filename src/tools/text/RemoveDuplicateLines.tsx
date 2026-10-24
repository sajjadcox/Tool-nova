import React, { useState } from 'react';
import { ListFilter, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const RemoveDuplicateLines: React.FC = () => {
  const [input, setInput] = useState<string>('apple\nbanana\norange\napple\nbanana\ngrapes');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimLines, setTrimLines] = useState<boolean>(true);

  const getDeduplicated = () => {
    const rawLines = input.split('\n');
    const seen = new Set<string>();
    const result: string[] = [];

    for (const rawLine of rawLines) {
      const line = trimLines ? rawLine.trim() : rawLine;
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }

    return result.join('\n');
  };

  const output = getDeduplicated();
  const inputLineCount = input.split('\n').filter(l => l.trim().length > 0).length;
  const outputLineCount = output.split('\n').filter(l => l.trim().length > 0).length;
  const duplicatesRemoved = Math.max(0, inputLineCount - outputLineCount);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Case Sensitive</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Trim Whitespace</span>
          </label>
        </div>

        <span className="text-teal-700 dark:text-teal-400 font-bold">
          {duplicatesRemoved} duplicate {duplicatesRemoved === 1 ? 'line' : 'lines'} removed ({outputLineCount} unique lines left)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Original List ({inputLineCount} lines)</label>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">Deduplicated List ({outputLineCount} lines)</label>
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
