import React, { useState } from 'react';
import { Link2, ArrowRightLeft } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const UrlEncoderDecoder: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeMode, setEncodeMode] = useState<'component' | 'uri'>('component');
  const [input, setInput] = useState<string>('https://example.com/search?query=hello world & special=true#section');

  const processText = () => {
    try {
      if (mode === 'encode') {
        return encodeMode === 'component' ? encodeURIComponent(input) : encodeURI(input);
      } else {
        return decodeURIComponent(input);
      }
    } catch {
      return 'Error: Invalid URL encoding sequence.';
    }
  };

  const output = processText();

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-xl transition-all ${
              mode === 'encode'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            URL Encode
          </button>

          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-xl transition-all ${
              mode === 'decode'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            URL Decode
          </button>
        </div>

        {mode === 'encode' && (
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Method:</span>
            <button
              type="button"
              onClick={() => setEncodeMode('component')}
              className={`px-2.5 py-1 rounded-lg ${
                encodeMode === 'component' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200 font-bold' : 'text-slate-600'
              }`}
            >
              encodeURIComponent (Full)
            </button>
            <button
              type="button"
              onClick={() => setEncodeMode('uri')}
              className={`px-2.5 py-1 rounded-lg ${
                encodeMode === 'uri' ? 'bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-200 font-bold' : 'text-slate-600'
              }`}
            >
              encodeURI (Preserve / & ?)
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Input String</label>
          <textarea
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">Output Result</label>
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
