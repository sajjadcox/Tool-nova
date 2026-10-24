import React, { useState } from 'react';
import { Minimize2, Copy, Check, Download, Trash2, ShieldCheck } from 'lucide-react';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const JavascriptMinifier: React.FC = () => {
  const [code, setCode] = useState<string>(
    `// Calculate invoice total with tax and discounts\nfunction calculateInvoice(items, taxRate = 0.08) {\n  let subtotal = 0;\n  for (const item of items) {\n    subtotal += item.price * item.quantity;\n  }\n  \n  /* Apply discount if applicable */\n  const discount = subtotal > 100 ? subtotal * 0.1 : 0;\n  const taxableAmount = subtotal - discount;\n  const tax = taxableAmount * taxRate;\n  \n  return {\n    subtotal,\n    discount,\n    tax,\n    total: taxableAmount + tax\n  };\n}`
  );
  const [minified, setMinified] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const minifyJs = (src: string): string => {
    try {
      return src
        // Remove single-line comments (preserving URLs)
        .replace(/(?:^|[^\\])\/\/.*$/gm, '')
        // Remove multi-line comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove multiple spaces/tabs
        .replace(/[ \t]+/g, ' ')
        // Remove whitespace around operators and punctuation
        .replace(/\s*([{}();,:><=+\-*/&|])\s*/g, '$1')
        // Remove empty lines
        .replace(/\n+/g, '')
        .trim();
    } catch {
      return src;
    }
  };

  const handleMinify = () => {
    const res = minifyJs(code);
    setMinified(res);
  };

  const originalBytes = new Blob([code]).size;
  const minifiedResult = minified || (code ? minifyJs(code) : '');
  const minifiedBytes = new Blob([minifiedResult]).size;
  const savedBytes = originalBytes - minifiedBytes;
  const reductionPercent = originalBytes > 0 ? Math.max(0, Math.round((savedBytes / originalBytes) * 100)) : 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(minifiedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Minimize2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">JavaScript Minifier</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Strip comments, whitespaces, and compress JS code size instantly.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareResultButton
              toolName="JavaScript Minifier"
              resultSummary={`Minified JavaScript code by ${reductionPercent}% with ToolNova!`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Original Size</p>
            <p className="text-base font-bold text-slate-700 dark:text-slate-200 mt-0.5">{originalBytes} B</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Minified Size</p>
            <p className="text-base font-bold text-teal-600 dark:text-teal-400 mt-0.5">{minifiedBytes} B</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Reduction</p>
            <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">-{reductionPercent}%</p>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">Saved</p>
            <p className="text-base font-bold text-slate-700 dark:text-slate-300 mt-0.5">{savedBytes} B</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {code && (
              <button
                type="button"
                onClick={() => {
                  setCode('');
                  setMinified('');
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleMinify}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
            >
              Minify JavaScript
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1.5">Source Code</span>
            <textarea
              rows={12}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste JavaScript code to minify..."
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Minified Result</span>
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
                  filename="bundle.min.js"
                  content={minifiedResult}
                  mimeType="text/javascript"
                  label="Download"
                  className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>
            <textarea
              readOnly
              rows={12}
              value={minifiedResult}
              placeholder="Minified output will appear here..."
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
