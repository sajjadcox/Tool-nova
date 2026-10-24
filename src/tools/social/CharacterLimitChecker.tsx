import React, { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const CharacterLimitChecker: React.FC = () => {
  const [text, setText] = useState<string>('ToolNova provides over 160 modern in-browser tools for creators and engineers! Check it out.');

  const platforms = [
    { name: 'X / Twitter Post', max: 280 },
    { name: 'Instagram Caption', max: 2200 },
    { name: 'Instagram Bio', max: 150 },
    { name: 'LinkedIn Post', max: 3000 },
    { name: 'Pinterest Pin Description', max: 500 },
    { name: 'YouTube Video Title', max: 100 },
    { name: 'TikTok Caption', max: 2200 }
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <label>Your Social Post or Bio Text</label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-teal-600">{text.length} characters</span>
            <CopyButton textToCopy={text} />
          </div>
        </div>
        <textarea
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 text-sm font-sans rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {platforms.map(p => {
          const remaining = p.max - text.length;
          const isOver = remaining < 0;
          const percent = Math.min(100, Math.round((text.length / p.max) * 100));

          return (
            <div
              key={p.name}
              className={`p-4 rounded-2xl border space-y-2 ${
                isOver
                  ? 'bg-red-50/60 dark:bg-red-950/30 border-red-200 dark:border-red-900'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-800 dark:text-slate-200 truncate pr-2">{p.name}</span>
                <span className={`font-mono ${isOver ? 'text-red-600 font-extrabold' : 'text-slate-500'}`}>
                  {isOver ? `${Math.abs(remaining)} over` : `${remaining} left`}
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 rounded-full ${
                    isOver ? 'bg-red-500' : percent > 85 ? 'bg-amber-500' : 'bg-teal-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{text.length} / {p.max}</span>
                <span>{percent}% used</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
