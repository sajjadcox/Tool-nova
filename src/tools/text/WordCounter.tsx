import React, { useState } from 'react';
import { Type, Clock, BookOpen, Copy, Trash2 } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { ClearButton } from '../../components/common/ClearButton';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const WordCounter: React.FC = () => {
  const [text, setText] = useState<string>('');

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charsWithSpaces = text.length;
  const charsNoSpaces = text.replace(/\s+/g, '').length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+(\s|$)/g) || []).length || 1 : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;
  
  // Average reading speed: 225 wpm, speaking speed: 130 wpm
  const readingTimeSec = Math.ceil((words / 225) * 60);
  const speakingTimeSec = Math.ceil((words / 130) * 60);

  const formatDuration = (totalSeconds: number) => {
    if (totalSeconds < 60) return `${totalSeconds} sec`;
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} min ${secs > 0 ? `${secs}s` : ''}`;
  };

  // Top keywords density
  const getKeywordDensity = () => {
    if (!text.trim()) return [];
    const cleanWords = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2);

    const freq: { [key: string]: number } = {};
    cleanWords.forEach(w => {
      freq[w] = (freq[w] || 0) + 1;
    });

    return Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        word,
        count,
        percent: ((count / cleanWords.length) * 100).toFixed(1)
      }));
  };

  const keywords = getKeywordDensity();

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center space-y-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
            Words
          </span>
          <span className="text-2xl lg:text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
            {words}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Characters
          </span>
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
            {charsWithSpaces}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            No Spaces
          </span>
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
            {charsNoSpaces}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Sentences
          </span>
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
            {sentences}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Paragraphs
          </span>
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono">
            {paragraphs}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-center space-y-1">
          <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider block">
            Reading Time
          </span>
          <span className="text-base sm:text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono pt-1 block truncate">
            {formatDuration(readingTimeSec)}
          </span>
        </div>
      </div>

      {/* Text Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
          <span>Type, write, or paste your text below:</span>
          <div className="flex items-center gap-2">
            <CopyButton textToCopy={text} label="Copy Text" />
            <ClearButton onClear={() => setText('')} disabled={!text} />
            <ShareResultButton
              toolName="Word Counter"
              resultSummary={`Text Statistics: ${words} words, ${charsWithSpaces} characters, reading time ~${formatDuration(readingTimeSec)}`}
            />
          </div>
        </div>

        <textarea
          rows={10}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your content here to see instant statistics..."
          className="w-full p-4 text-sm font-sans rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500 leading-relaxed transition-colors"
        />
      </div>

      {/* Keyword Density */}
      {keywords.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Top Keyword Frequency & Density
          </span>
          <div className="flex flex-wrap gap-2">
            {keywords.map(kw => (
              <span
                key={kw.word}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200"
              >
                <strong className="text-teal-600 dark:text-teal-400 font-mono">{kw.word}</strong>
                <span className="text-slate-400">×{kw.count} ({kw.percent}%)</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
