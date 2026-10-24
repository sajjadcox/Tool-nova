import React, { useState } from 'react';
import { Undo2, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const TextReverser: React.FC = () => {
  const [text, setText] = useState<string>('ToolNova is an all-in-one suite of web tools.');
  const [reverseMode, setReverseMode] = useState<'chars' | 'words' | 'lines'>('chars');

  const getReversed = () => {
    if (reverseMode === 'chars') {
      return text.split('').reverse().join('');
    } else if (reverseMode === 'words') {
      return text.split(/\s+/).reverse().join(' ');
    } else {
      return text.split('\n').reverse().join('\n');
    }
  };

  const output = getReversed();

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <span>Reverse Mode:</span>
        {[
          { id: 'chars', label: 'Reverse Letters (Characters)' },
          { id: 'words', label: 'Reverse Words' },
          { id: 'lines', label: 'Reverse Lines' }
        ].map(opt => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setReverseMode(opt.id as any)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              reverseMode === opt.id
                ? 'bg-teal-600 text-white'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Input Text</label>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">Reversed Text</label>
            <CopyButton textToCopy={output} />
          </div>
          <textarea
            rows={8}
            readOnly
            value={output}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
