import React, { useState } from 'react';
import { Code, Copy, Check, Download, Trash2 } from 'lucide-react';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const JavascriptFormatter: React.FC = () => {
  const [code, setCode] = useState<string>(
    'function calculateTotal(items,taxRate){let subtotal=0;for(let i=0;i<items.length;i++){subtotal+=items[i].price*items[i].quantity;}const tax=subtotal*(taxRate||0.05);return{subtotal,tax,total:subtotal+tax};}'
  );
  const [indentSize, setIndentSize] = useState<number>(2);
  const [formatted, setFormatted] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const formatJs = (source: string, indent: number): string => {
    try {
      let output = '';
      let depth = 0;
      const indentStr = ' '.repeat(indent);
      let inString: string | null = null;
      let inComment = false;

      for (let i = 0; i < source.length; i++) {
        const char = source[i];
        const nextChar = source[i + 1];

        // Handle string literals
        if ((char === '"' || char === "'" || char === '`') && source[i - 1] !== '\\') {
          if (inString === char) inString = null;
          else if (!inString && !inComment) inString = char;
        }

        if (inString) {
          output += char;
          continue;
        }

        // Handle line comment
        if (char === '/' && nextChar === '/') {
          inComment = true;
        }
        if (inComment && char === '\n') {
          inComment = false;
        }

        if (inComment) {
          output += char;
          continue;
        }

        if (char === '{' || char === '[') {
          depth++;
          output += `${char}\n${indentStr.repeat(depth)}`;
        } else if (char === '}' || char === ']') {
          depth = Math.max(0, depth - 1);
          output += `\n${indentStr.repeat(depth)}${char}`;
        } else if (char === ';') {
          output += `;\n${indentStr.repeat(depth)}`;
        } else if (char === ',' && (source[i + 1] !== ' ' && source[i + 1] !== '\n')) {
          output += ', ';
        } else {
          output += char;
        }
      }

      // Clean up multiple empty lines
      return output.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
    } catch {
      return source;
    }
  };

  const handleFormat = () => {
    const res = formatJs(code, indentSize);
    setFormatted(res);
  };

  const handleCopy = async () => {
    const text = formatted || code;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">JavaScript Formatter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Beautify, indent, and format JavaScript/TypeScript code cleanly.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareResultButton
              toolName="JavaScript Formatter"
              resultSummary="Beautified JavaScript code with ToolNova JavaScript Formatter!"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Indentation:</label>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(Number(e.target.value))}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200"
            >
              <option value={2}>2 Spaces</option>
              <option value={4}>4 Spaces</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {code && (
              <button
                type="button"
                onClick={() => {
                  setCode('');
                  setFormatted('');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleFormat}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              Format Code
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Raw Input</span>
              <span className="text-[11px] text-slate-500">{code.length} chars</span>
            </div>
            <textarea
              rows={14}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste raw JavaScript code here..."
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Formatted Output</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-teal-600"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <DownloadButton
                  filename="formatted.js"
                  content={formatted || code}
                  mimeType="text/javascript"
                  label="Download"
                  className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>
            <textarea
              readOnly
              rows={14}
              value={formatted || (code ? formatJs(code, indentSize) : '')}
              placeholder="Formatted output will appear here..."
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
