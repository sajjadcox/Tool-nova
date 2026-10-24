import React, { useState } from 'react';
import { CheckCheck, Copy, Check, Sparkles, AlertCircle, Wrench } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

interface GrammarIssue {
  type: string;
  match: string;
  replacement: string;
  reason: string;
}

export const GrammarChecker: React.FC = () => {
  const [text, setText] = useState<string>(
    'This is an example text with some the the repeated words .Your going to love this tool because its very fast .'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const findIssues = (input: string): GrammarIssue[] => {
    const issues: GrammarIssue[] = [];

    // Duplicate words
    const duplicateRegex = /\b(\w+)\s+\1\b/gi;
    let m: RegExpExecArray | null;
    while ((m = duplicateRegex.exec(input)) !== null) {
      issues.push({
        type: 'Duplicate Word',
        match: m[0],
        replacement: m[1],
        reason: `Repeated word "${m[1]}".`
      });
    }

    // Space before punctuation
    const spacePunct = /\s+([.,!?:;])/g;
    while ((m = spacePunct.exec(input)) !== null) {
      issues.push({
        type: 'Punctuation Spacing',
        match: m[0],
        replacement: m[1],
        reason: 'Unnecessary whitespace before punctuation.'
      });
    }

    // Your vs You're
    const yourGoing = /\byour\s+going\b/gi;
    while ((m = yourGoing.exec(input)) !== null) {
      issues.push({
        type: 'Confused Word',
        match: m[0],
        replacement: "you're going",
        reason: 'Use "you\'re" (you are) instead of "your".'
      });
    }

    // its vs it's
    const itsVery = /\bits\s+(very|so|really|fast|great)\b/gi;
    while ((m = itsVery.exec(input)) !== null) {
      issues.push({
        type: 'Confused Word',
        match: m[0],
        replacement: `it's ${m[1]}`,
        reason: 'Use "it\'s" (it is) instead of possessive "its".'
      });
    }

    return issues;
  };

  const issues = findIssues(text);

  const handleFixAll = () => {
    let fixed = text;
    issues.forEach(iss => {
      fixed = fixed.replace(iss.match, iss.replacement);
    });
    // Fix double spaces
    fixed = fixed.replace(/\s{2,}/g, ' ').trim();
    setText(fixed);
  };

  const handleCopy = async () => {
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
              <CheckCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Grammar & Style Checker</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Audit duplicate words, punctuation spacing, and common typos client-side.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareResultButton
              toolName="Grammar Checker"
              resultSummary="Checked and fixed grammar issues locally on ToolNova!"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Text to Analyze</label>
            <div className="flex items-center gap-2">
              {text && (
                <button type="button" onClick={() => setText('')} className="text-xs text-slate-400 hover:text-red-500">
                  Clear
                </button>
              )}
              {issues.length > 0 && (
                <button
                  type="button"
                  onClick={handleFixAll}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Fix All ({issues.length})</span>
                </button>
              )}
            </div>
          </div>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to check for grammar and punctuation errors..."
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 leading-relaxed focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">
              {issues.length === 0 ? 'No Grammar Issues Found 🎉' : `Detected Issues (${issues.length})`}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Cleaned Text'}</span>
            </button>
          </div>

          {issues.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {issues.map((iss, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 flex items-start justify-between gap-3"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-400">{iss.type}</span>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                      Change <span className="line-through text-red-500">"{iss.match}"</span> → <span className="text-teal-600 font-bold">"{iss.replacement}"</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{iss.reason}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setText(text.replace(iss.match, iss.replacement))}
                    className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-teal-600 dark:text-teal-400 rounded-lg hover:border-teal-500"
                  >
                    Fix
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-300">
              Your text looks clean and free of obvious punctuation, spacing, or duplicate word errors.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
