import React, { useState } from 'react';
import { GitCompare, ArrowRightLeft } from 'lucide-react';

export const TextDiffChecker: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>(
    'The quick brown fox jumps over the lazy dog.\nEverything is fine.\nThird line here.'
  );
  const [modifiedText, setModifiedText] = useState<string>(
    'The quick brown fox leaps over the lazy dog.\nEverything is awesome.\nThird line here.\nAdded fourth line.'
  );

  const getDiff = () => {
    const origLines = originalText.split('\n');
    const modLines = modifiedText.split('\n');
    const maxLen = Math.max(origLines.length, modLines.length);

    const diffRows = [];
    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[i] ?? null;
      const mod = modLines[i] ?? null;

      let type: 'same' | 'modified' | 'added' | 'removed' = 'same';
      if (orig === null && mod !== null) {
        type = 'added';
      } else if (orig !== null && mod === null) {
        type = 'removed';
      } else if (orig !== mod) {
        type = 'modified';
      }

      diffRows.push({ lineNum: i + 1, orig, mod, type });
    }
    return diffRows;
  };

  const diff = getDiff();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Original Text</label>
          <textarea
            rows={6}
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            className="w-full p-3 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Modified Text</label>
          <textarea
            rows={6}
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            className="w-full p-3 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-teal-600" />
          <span>Line-by-Line Comparison</span>
        </h4>

        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 text-xs font-mono">
          {diff.map((row) => {
            const isDiff = row.type !== 'same';
            return (
              <div
                key={row.lineNum}
                className={`flex border-b border-slate-100 dark:border-slate-800 last:border-0 ${
                  row.type === 'added'
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200'
                    : row.type === 'removed'
                    ? 'bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200'
                    : row.type === 'modified'
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="w-10 px-2 py-1.5 text-right select-none text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-r border-slate-200 dark:border-slate-800 shrink-0">
                  {row.lineNum}
                </span>

                <div className="flex-1 p-1.5 px-3 overflow-x-auto truncate">
                  {row.type === 'modified' ? (
                    <div className="space-y-1">
                      <div className="text-rose-700 dark:text-rose-400 line-through">
                        - {row.orig}
                      </div>
                      <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                        + {row.mod}
                      </div>
                    </div>
                  ) : row.type === 'added' ? (
                    <div>+ {row.mod}</div>
                  ) : row.type === 'removed' ? (
                    <div>- {row.orig}</div>
                  ) : (
                    <div>  {row.orig}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
