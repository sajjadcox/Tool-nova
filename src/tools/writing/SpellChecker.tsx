import React, { useState } from 'react';
import { SpellCheck, Copy, Check, Wrench } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

const COMMON_MISSPELLINGS: Record<string, string> = {
  definately: 'definitely',
  seperate: 'separate',
  recieve: 'receive',
  untill: 'until',
  goverment: 'government',
  accomodate: 'accommodate',
  occured: 'occurred',
  truely: 'truly',
  wierd: 'weird',
  neccessary: 'necessary',
  calender: 'calendar',
  embarass: 'embarrass',
  enviroment: 'environment',
  freind: 'friend',
  beleive: 'believe',
  acheive: 'achieve',
  tommorow: 'tomorrow',
  refering: 'referring',
  suprise: 'surprise',
  priviledge: 'privilege',
};

export const SpellChecker: React.FC = () => {
  const [text, setText] = useState<string>(
    'It is definately neccessary to seperate your tasks and check your calender tommorow.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const words = text.split(/\b/);
  const detectedMistakes: { word: string; suggestion: string }[] = [];

  words.forEach(w => {
    const lower = w.toLowerCase();
    if (COMMON_MISSPELLINGS[lower]) {
      if (!detectedMistakes.some(d => d.word.toLowerCase() === lower)) {
        detectedMistakes.push({ word: w, suggestion: COMMON_MISSPELLINGS[lower] });
      }
    }
  });

  const fixMistake = (wrong: string, right: string) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    setText(text.replace(regex, right));
  };

  const fixAll = () => {
    let t = text;
    detectedMistakes.forEach(d => {
      const regex = new RegExp(`\\b${d.word}\\b`, 'gi');
      t = t.replace(regex, d.suggestion);
    });
    setText(t);
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
              <SpellCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Client-Side Spell Checker</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scan for common spelling mistakes and apply single-click corrections.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareResultButton
              toolName="Spell Checker"
              resultSummary="Checked text spelling locally on ToolNova!"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Input Text</label>
            <div className="flex items-center gap-2">
              {text && (
                <button type="button" onClick={() => setText('')} className="text-xs text-slate-400 hover:text-red-500">
                  Clear
                </button>
              )}
              {detectedMistakes.length > 0 && (
                <button
                  type="button"
                  onClick={fixAll}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Fix All ({detectedMistakes.length})</span>
                </button>
              )}
            </div>
          </div>
          <textarea
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to inspect spelling..."
            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 leading-relaxed focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">
              {detectedMistakes.length === 0 ? 'No Common Spelling Errors Found' : `Suggestions (${detectedMistakes.length})`}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-teal-600"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Corrected Text'}</span>
            </button>
          </div>

          {detectedMistakes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {detectedMistakes.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 flex items-center justify-between"
                >
                  <div>
                    <span className="line-through text-xs text-red-600 font-semibold">{item.word}</span>
                    <p className="text-sm font-bold text-teal-600 dark:text-teal-400">{item.suggestion}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fixMistake(item.word, item.suggestion)}
                    className="px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-teal-600 dark:text-teal-400 rounded-lg hover:border-teal-500 shadow-sm"
                  >
                    Replace
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-700 dark:text-emerald-300">
              Spelling check completed. No common dictionary spelling mistakes detected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
