import React, { useState } from 'react';
import { Paintbrush, Minimize2, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const CssFormatter: React.FC = () => {
  const [input, setInput] = useState<string>(
    '.card{background:#ffffff;border-radius:16px;padding:24px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);display:flex;align-items:center;}.card h2{font-size:18px;margin-bottom:8px;color:#1e293b;}'
  );

  const formatCss = (css: string) => {
    let formatted = css
      .replace(/\s*\{\s*/g, ' {\n  ')
      .replace(/\s*;\s*/g, ';\n  ')
      .replace(/\s*\}\s*/g, '\n}\n\n')
      .replace(/\s*:\s*/g, ': ')
      .trim();

    // Clean empty lines inside rules
    return formatted.replace(/  \n/g, '');
  };

  const minifyCss = (css: string) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s*([\{\}:;,])\s*/g, '$1')
      .replace(/;}/g, '}')
      .trim();
  };

  const [output, setOutput] = useState<string>(() => formatCss(input));

  const handleBeautify = () => setOutput(formatCss(input));
  const handleMinify = () => setOutput(minifyCss(input));

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBeautify}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all"
          >
            Format & Indent CSS
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
          >
            Minify CSS
          </button>
        </div>

        <CopyButton textToCopy={output} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Input CSS</label>
          <textarea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">Output CSS</label>
          <textarea
            rows={12}
            readOnly
            value={output}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
