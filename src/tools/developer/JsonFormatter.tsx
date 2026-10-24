import React, { useState } from 'react';
import { Braces, CheckCircle2, AlertCircle, Copy, Download, Minimize2, Trash2 } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ClearButton } from '../../components/common/ClearButton';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const JsonFormatter: React.FC = () => {
  const [input, setInput] = useState<string>(
    JSON.stringify({
      name: "ToolNova",
      toolkit: "Professional Web Tools",
      version: "2.0.0",
      features: ["Audio Tools", "Video Tools", "Images", "PDF", "Security", "Developer Tools"],
      privacy: { clientSideOnly: true, serverUploads: false }
    }, null, 2)
  );
  const [indent, setIndent] = useState<number>(2);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; message: string; line?: number } | null>(null);
  const [formattedOutput, setFormattedOutput] = useState<string>(input);

  const handleFormat = (spaces: number = indent, sortKeys: boolean = false) => {
    try {
      let parsed = JSON.parse(input);

      if (sortKeys && typeof parsed === 'object' && parsed !== null) {
        parsed = sortObjectKeys(parsed);
      }

      const formatted = JSON.stringify(parsed, null, spaces);
      setFormattedOutput(formatted);
      setValidationResult({ valid: true, message: 'Valid JSON structure!' });
    } catch (err: any) {
      const msg = err?.message || 'Invalid JSON';
      const match = msg.match(/position (\d+)/);
      let lineNum = undefined;
      if (match && match[1]) {
        const pos = parseInt(match[1]);
        lineNum = input.substring(0, pos).split('\n').length;
      }
      setValidationResult({
        valid: false,
        message: msg,
        line: lineNum
      });
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setFormattedOutput(minified);
      setValidationResult({ valid: true, message: 'Valid JSON minified!' });
    } catch (err: any) {
      setValidationResult({ valid: false, message: err?.message || 'Invalid JSON syntax.' });
    }
  };

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((acc: any, key: string) => {
          acc[key] = sortObjectKeys(obj[key]);
          return acc;
        }, {});
    }
    return obj;
  };

  const handleClear = () => {
    setInput('');
    setFormattedOutput('');
    setValidationResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => handleFormat(2, false)}
            className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-all shadow-xs"
          >
            Prettify (2 Spaces)
          </button>

          <button
            type="button"
            onClick={() => handleFormat(4, false)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
          >
            Prettify (4 Spaces)
          </button>

          <button
            type="button"
            onClick={handleMinify}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify / Compact</span>
          </button>

          <button
            type="button"
            onClick={() => handleFormat(indent, true)}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
          >
            Sort Keys A-Z
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <CopyButton textToCopy={formattedOutput} />
          <DownloadButton
            filename="formatted.json"
            content={formattedOutput}
            mimeType="application/json"
            label="Download .json"
          />
          <ShareResultButton
            toolName="JSON Formatter"
            resultSummary="JSON validated and formatted using ToolNova."
          />
        </div>
      </div>

      {/* Validation Banner */}
      {validationResult && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs font-medium ${
            validationResult.valid
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
              : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
          }`}
        >
          {validationResult.valid ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>
            {validationResult.message}
            {validationResult.line && ` (Near Line ${validationResult.line})`}
          </span>
        </div>
      )}

      {/* Split Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300">Input JSON</label>
            <ClearButton onClear={handleClear} disabled={!input} />
          </div>
          <textarea
            rows={15}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              try {
                JSON.parse(e.target.value);
                setValidationResult({ valid: true, message: 'Valid JSON' });
              } catch {
                // wait for format
              }
            }}
            placeholder="Paste raw JSON here..."
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-teal-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-teal-700 dark:text-teal-400">Formatted & Validated Output</label>
            <span className="text-slate-400 font-mono text-[11px]">
              {(formattedOutput.length / 1024).toFixed(2)} KB
            </span>
          </div>
          <textarea
            rows={15}
            readOnly
            value={formattedOutput}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
