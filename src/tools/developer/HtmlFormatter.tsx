import React, { useState } from 'react';
import { FileCode, Minimize2, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const HtmlFormatter: React.FC = () => {
  const [input, setInput] = useState<string>(
    '<div class="container"><header><h1>ToolNova</h1><nav><a href="/tools">All Tools</a></nav></header><main><p>Fast client-side tools for developers.</p></main></div>'
  );

  const formatHtml = (html: string) => {
    let formatted = '';
    let indent = 0;
    const tab = '  ';

    html.split(/>\s*</).forEach(element => {
      if (element.match(/^\/\w/)) {
        indent = Math.max(0, indent - 1);
      }

      formatted += tab.repeat(indent) + '<' + element + '>\n';

      if (element.match(/^<?\w[^>]*[^\/]$/) && !element.startsWith('input') && !element.startsWith('img') && !element.startsWith('br') && !element.startsWith('hr')) {
        indent += 1;
      }
    });

    return formatted.substring(1, formatted.length - 2);
  };

  const minifyHtml = (html: string) => {
    return html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const [output, setOutput] = useState<string>(() => formatHtml(input));

  const handleBeautify = () => setOutput(formatHtml(input));
  const handleMinify = () => setOutput(minifyHtml(input));

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBeautify}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all"
          >
            Format & Indent HTML
          </button>
          <button
            type="button"
            onClick={handleMinify}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
          >
            Minify HTML
          </button>
        </div>

        <CopyButton textToCopy={output} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Input HTML</label>
          <textarea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">Output HTML</label>
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
