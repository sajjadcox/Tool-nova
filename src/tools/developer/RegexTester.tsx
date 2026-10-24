import React, { useState } from 'react';
import { Code, CheckCircle2, AlertCircle } from 'lucide-react';

export const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState<string>('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean }>({ g: true, i: true, m: false });
  const [testText, setTestText] = useState<string>(
    'Reach out at support@toolnova.com or contact sales@example.org for enterprise inquiries!'
  );

  const getFlagString = () => {
    let f = '';
    if (flags.g) f += 'g';
    if (flags.i) f += 'i';
    if (flags.m) f += 'm';
    return f;
  };

  let matches: RegExpMatchArray[] = [];
  let error: string | null = null;

  try {
    if (pattern) {
      const re = new RegExp(pattern, getFlagString());
      if (flags.g) {
        matches = Array.from(testText.matchAll(re));
      } else {
        const m = testText.match(re);
        if (m) matches = [m];
      }
    }
  } catch (err: any) {
    error = err?.message || 'Invalid Regular Expression syntax.';
  }

  return (
    <div className="space-y-6">
      {/* Regex Input Row */}
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Regular Expression Pattern
          </label>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono text-lg">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g. [a-z0-9]+"
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
            />
            <span className="text-slate-400 font-mono text-lg">/</span>

            {/* Flag toggles */}
            <div className="flex items-center gap-1.5 pl-2">
              {(['g', 'i', 'm'] as const).map(flagKey => (
                <button
                  key={flagKey}
                  type="button"
                  onClick={() => setFlags(prev => ({ ...prev, [flagKey]: !prev[flagKey] }))}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors ${
                    flags[flagKey]
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500'
                  }`}
                  title={`Toggle flag: ${flagKey === 'g' ? 'Global' : flagKey === 'i' ? 'Case Insensitive' : 'Multiline'}`}
                >
                  {flagKey}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Test String */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300">Test String</label>
          <span className="font-semibold text-teal-600 dark:text-teal-400">
            {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
          </span>
        </div>
        <textarea
          rows={6}
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Enter sample text to match against..."
          className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 leading-relaxed outline-none"
        />
      </div>

      {/* Matches List */}
      {matches.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Match Details & Capture Groups
          </h4>
          <div className="space-y-2">
            {matches.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 text-xs font-mono flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">
                    Match #{idx + 1}: "{m[0]}"
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    Index: {m.index} • Length: {m[0].length}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
