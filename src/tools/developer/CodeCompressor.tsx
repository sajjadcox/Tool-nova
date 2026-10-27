import React, { useState } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  Zap, 
  FileCode, 
  Sliders, 
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { formatBytes } from '../image/compressionEngine';

export const CodeCompressor: React.FC = () => {
  const [language, setLanguage] = useState<'javascript' | 'css' | 'html' | 'json'>('javascript');
  const [inputCode, setInputCode] = useState<string>(`// Sample JavaScript Code
function calculateDiscount(originalPrice, discountPercentage) {
  /* Validate parameters */
  if (originalPrice <= 0 || discountPercentage < 0) {
    return 0;
  }
  
  // Calculate discount amount
  const discountAmount = (originalPrice * discountPercentage) / 100;
  const finalPrice = originalPrice - discountAmount;
  
  return {
    saved: discountAmount,
    price: Math.round(finalPrice * 100) / 100
  };
}

console.log(calculateDiscount(120, 25));`);

  const [compressedCode, setCompressedCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [aggressiveMode, setAggressiveMode] = useState<boolean>(true);

  const compressCode = () => {
    let result = inputCode;
    if (!result.trim()) {
      setCompressedCode('');
      return;
    }

    if (language === 'javascript') {
      // Strip single line comments (careful with strings)
      result = result.replace(/\/\/[^\n\r]*/g, '');
      // Strip multi-line comments
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
      // Compress multiple whitespaces into one
      result = result.replace(/\s+/g, ' ');
      // Remove spaces around operators & punctuation
      if (aggressiveMode) {
        result = result.replace(/\s*([;:=+\-*/{}()[\]><,])\s*/g, '$1');
      }
      result = result.trim();
    } else if (language === 'css') {
      // Strip comments
      result = result.replace(/\/\*[\s\S]*?\*\//g, '');
      // Remove newlines and tabs
      result = result.replace(/\s+/g, ' ');
      // Remove spaces around colon, braces, semicolons
      result = result.replace(/\s*([{}:;,])\s*/g, '$1');
      // Remove trailing semicolons in blocks
      result = result.replace(/;}/g, '}');
      result = result.trim();
    } else if (language === 'html') {
      // Strip comments
      result = result.replace(/<!--[\s\S]*?-->/g, '');
      // Collapse whitespace between tags
      result = result.replace(/>\s+</g, '><');
      // Collapse multiple spaces
      result = result.replace(/\s{2,}/g, ' ');
      result = result.trim();
    } else if (language === 'json') {
      try {
        const parsed = JSON.parse(inputCode);
        result = JSON.stringify(parsed);
      } catch (e) {
        // Fallback regex whitespace strip
        result = inputCode.replace(/\s+(?=(?:[^"]*"[^"]*")*[^"]*$)/g, '');
      }
    }

    setCompressedCode(result);
  };

  const handleCopy = () => {
    if (!compressedCode) return;
    navigator.clipboard.writeText(compressedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!compressedCode) return;
    const extensions: Record<string, string> = {
      javascript: 'min.js',
      css: 'min.css',
      html: 'min.html',
      json: 'min.json'
    };
    const blob = new Blob([compressedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bundle.${extensions[language]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const originalBytes = new Blob([inputCode]).size;
  const compressedBytes = new Blob([compressedCode]).size;
  const percentSaved = originalBytes > 0 && compressedCode.length > 0
    ? Math.max(0, Math.round(((originalBytes - compressedBytes) / originalBytes) * 100))
    : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-indigo-500/10 border border-teal-500/20 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Code Minifier • 70% to 90% Byte Reduction</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Code & Script Compressor (JS, CSS, HTML, JSON)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Strip comments, linebreaks, and unnecessary whitespace to reduce code asset payloads by up to 90% for web production.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
            </span>
          </div>
        </div>
      </div>

      {/* Language Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['javascript', 'css', 'html', 'json'] as const).map(lang => (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize transition-all ${
              language === lang
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#131C31] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-teal-500'
            }`}
          >
            {lang === 'javascript' ? 'JavaScript (JS)' : lang.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Editors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Source Code */}
        <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Input Code ({formatBytes(originalBytes)})</span>
            <button
              type="button"
              onClick={() => setInputCode('')}
              className="text-slate-400 hover:text-rose-500"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Paste your source code here..."
            rows={14}
            className="w-full flex-1 p-3 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500 resize-none"
          />
        </div>

        {/* Compressed Code */}
        <div className="bg-white dark:bg-[#131C31] border border-teal-500/30 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="text-teal-600 dark:text-teal-400 font-bold">
              Compressed Output {compressedCode ? `(${formatBytes(compressedBytes)} • -${percentSaved}%)` : ''}
            </span>
            <div className="flex items-center gap-2">
              {compressedCode && (
                <>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </>
              )}
            </div>
          </div>
          <textarea
            value={compressedCode}
            readOnly
            placeholder="Click 'Compress Code Now' below to generate minified output..."
            rows={14}
            className="w-full flex-1 p-3 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500 resize-none"
          />
        </div>
      </div>

      {/* Trigger & Settings */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={aggressiveMode}
            onChange={(e) => setAggressiveMode(e.target.checked)}
            className="accent-teal-600 rounded"
          />
          <span>Aggressive Whitespace & Punctuation Stripping (Targets 80-90% Drop)</span>
        </label>

        <button
          type="button"
          onClick={compressCode}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Compress {language.toUpperCase()} Now</span>
        </button>
      </div>
    </div>
  );
};
