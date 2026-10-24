import React, { useState } from 'react';
import { AlignLeft, Copy, Check, Sparkles, Sliders } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const TextSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState<string>(
    `Artificial intelligence has transformed modern software development and everyday computing. In recent years, browser technologies like WebAssembly, HTML5 Canvas, and the Web Crypto API have reached incredible maturity. As a result, users no longer need to send confidential files to cloud servers to perform tasks like PDF compression, image editing, or cryptographic hashing. Client-side computing gives users complete sovereignty over their data while saving significant bandwidth and reducing latency. By keeping computing operations local to the device, modern web applications achieve both unmatched privacy and instantaneous performance.`
  );
  const [ratio, setRatio] = useState<number>(40); // 40% length
  const [copied, setCopied] = useState<boolean>(false);

  const summarize = (text: string, percent: number) => {
    if (!text.trim()) return '';

    // Split sentences
    const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
    if (sentences.length <= 2) return text;

    // Word frequencies
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const stopWords = new Set(['the', 'and', 'for', 'that', 'this', 'with', 'have', 'from', 'they', 'which', 'will', 'been']);
    const freq: Record<string, number> = {};
    words.forEach(w => {
      if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1;
    });

    // Score sentences
    const scored = sentences.map((sentence, index) => {
      const sWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      let score = 0;
      sWords.forEach(w => {
        score += freq[w] || 0;
      });
      // Boost initial and final sentences
      if (index === 0) score *= 1.5;
      if (index === sentences.length - 1) score *= 1.2;
      return { sentence: sentence.trim(), score, index };
    });

    const targetCount = Math.max(1, Math.round(sentences.length * (percent / 100)));
    const topSentences = [...scored]
      .sort((a, b) => b.score - a.score)
      .slice(0, targetCount)
      .sort((a, b) => a.index - b.index);

    return topSentences.map(s => s.sentence).join(' ');
  };

  const summary = summarize(inputText, ratio);

  const origWords = inputText.trim().split(/\s+/).filter(Boolean).length;
  const sumWords = summary.trim().split(/\s+/).filter(Boolean).length;
  const reduction = origWords > 0 ? Math.max(0, Math.round(((origWords - sumWords) / origWords) * 100)) : 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <AlignLeft className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Text Summarizer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Extract key points and condense long articles directly in your browser.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Text Summarizer"
            resultSummary={`Summarized text by ${reduction}% with ToolNova Text Summarizer!`}
          />
        </div>

        <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3 flex-1 max-w-sm">
            <Sliders className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Summary Ratio:</span>
            <input
              type="range"
              min="20"
              max="80"
              step="10"
              value={ratio}
              onChange={(e) => setRatio(Number(e.target.value))}
              className="flex-1 accent-teal-600"
            />
            <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400">{ratio}%</span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500">Words: <strong className="text-slate-700 dark:text-slate-300">{origWords} → {sumWords}</strong></span>
            <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">-{reduction}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Original Article / Text</label>
              {inputText && (
                <button type="button" onClick={() => setInputText('')} className="text-xs text-slate-400 hover:text-red-500">
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows={12}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste article, report, or essay text here..."
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 leading-relaxed focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Extracted Key Summary</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Summary'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={12}
              value={summary}
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
