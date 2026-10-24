import React, { useState } from 'react';
import { Binary, ArrowRightLeft } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const Base64Tool: React.FC = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState<string>('ToolNova: Every Tool You Need. All in One Place.');
  const [error, setError] = useState<string | null>(null);

  // Unicode safe Base64 encoder/decoder
  const encodeBase64 = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str);
      const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
      return btoa(binString);
    } catch {
      return '';
    }
  };

  const decodeBase64 = (b64: string) => {
    try {
      const clean = b64.trim().replace(/\s+/g, '');
      const binString = atob(clean);
      const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    } catch (err: any) {
      throw new Error('Invalid Base64 string.');
    }
  };

  let output = '';
  try {
    if (mode === 'encode') {
      output = encodeBase64(input);
      if (error) setError(null);
    } else {
      output = decodeBase64(input);
      if (error) setError(null);
    }
  } catch (err: any) {
    output = '';
  }

  const handleSwap = () => {
    if (output) {
      setInput(output);
      setMode(mode === 'encode' ? 'decode' : 'encode');
    }
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {/* Mode Switcher */}
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
            Text to Base64 (Encode)
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
            Base64 to Text (Decode)
          </button>
        </div>

        <button
          type="button"
          onClick={handleSwap}
          disabled={!output}
          className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5 disabled:opacity-50"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Swap Input & Output</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            {mode === 'encode' ? 'Plain Text Input (UTF-8)' : 'Base64 Encoded Input'}
          </label>
          <textarea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">
              {mode === 'encode' ? 'Base64 Output' : 'Decoded Plain Text'}
            </label>
            <CopyButton textToCopy={output} />
          </div>
          <textarea
            rows={10}
            readOnly
            value={output}
            placeholder={mode === 'decode' ? 'Decoded text will appear here...' : 'Base64 output...'}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
