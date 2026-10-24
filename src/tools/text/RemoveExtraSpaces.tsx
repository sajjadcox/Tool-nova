import React, { useState } from 'react';
import { Space, Copy, Check } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const RemoveExtraSpaces: React.FC = () => {
  const [input, setInput] = useState<string>('  This    text   has     far    too    many    spaces.  \n\n  And    ragged    newlines!  ');
  const [trimLines, setTrimLines] = useState<boolean>(true);
  const [collapseMultipleSpaces, setCollapseMultipleSpaces] = useState<boolean>(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(true);

  const cleanText = () => {
    let result = input;
    if (collapseMultipleSpaces) {
      result = result.replace(/[ \t]+/g, ' ');
    }
    if (trimLines) {
      result = result
        .split('\n')
        .map(line => line.trim())
        .join('\n');
    }
    if (removeEmptyLines) {
      result = result
        .split('\n')
        .filter(line => line.trim().length > 0)
        .join('\n');
    }
    return result;
  };

  const output = cleanText();

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center gap-6 flex-wrap text-xs font-semibold text-slate-700 dark:text-slate-300">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={collapseMultipleSpaces}
            onChange={(e) => setCollapseMultipleSpaces(e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-500"
          />
          <span>Collapse Multiple Spaces to 1</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-500"
          />
          <span>Trim Leading & Trailing Spaces</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeEmptyLines}
            onChange={(e) => setRemoveEmptyLines(e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-500"
          />
          <span>Remove Empty Blank Lines</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Original Raw Text</label>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">Cleaned Text Result</label>
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
