import React, { useState } from 'react';
import { Percent, RotateCcw } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const PercentageCalculator: React.FC = () => {
  // Mode 1: What is X% of Y?
  const [val1A, setVal1A] = useState<number | ''>(20);
  const [val1B, setVal1B] = useState<number | ''>(150);

  // Mode 2: X is what percent of Y?
  const [val2A, setVal2A] = useState<number | ''>(45);
  const [val2B, setVal2B] = useState<number | ''>(180);

  // Mode 3: Percentage increase / decrease from X to Y
  const [val3A, setVal3A] = useState<number | ''>(80);
  const [val3B, setVal3B] = useState<number | ''>(120);

  const num1A = val1A === '' ? 0 : val1A;
  const num1B = val1B === '' ? 0 : val1B;
  const res1 = (num1A * num1B) / 100;

  const num2A = val2A === '' ? 0 : val2A;
  const num2B = val2B === '' ? 0 : val2B;
  const res2 = num2B !== 0 ? ((num2A / num2B) * 100).toFixed(2) : '0';

  const num3A = val3A === '' ? 0 : val3A;
  const num3B = val3B === '' ? 0 : val3B;
  const diff3 = num3B - num3A;
  const pct3 = num3A !== 0 ? ((diff3 / num3A) * 100).toFixed(2) : '0';
  const isIncrease = diff3 >= 0;

  const resetAll = () => {
    setVal1A(20);
    setVal1B(150);
    setVal2A(45);
    setVal2B(180);
    setVal3A(80);
    setVal3B(120);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Calculator</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
              1. Percentage of a Value
            </h4>
            <p className="text-xs text-slate-500 mb-4">What is X% of Y?</p>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Percentage (X%)</label>
                <input
                  type="number"
                  value={val1A}
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setVal1A(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Of Total (Y)</label>
                <input
                  type="number"
                  value={val1B}
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setVal1B(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center">
              <span className="text-[10px] text-teal-800 dark:text-teal-300 block font-semibold">Answer</span>
              <span className="text-2xl font-bold font-mono text-teal-600 dark:text-teal-400">{res1}</span>
            </div>
            <div className="flex justify-center">
              <ShareResultButton
                toolName="Percentage Calculator"
                resultSummary={`${num1A}% of ${num1B} = ${res1}`}
              />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
              2. What Percent is X of Y?
            </h4>
            <p className="text-xs text-slate-500 mb-4">Find the ratio of two numbers.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Number (X)</label>
                <input
                  type="number"
                  value={val2A}
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setVal2A(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Total (Y)</label>
                <input
                  type="number"
                  value={val2B}
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setVal2B(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center">
              <span className="text-[10px] text-teal-800 dark:text-teal-300 block font-semibold">Percentage Ratio</span>
              <span className="text-2xl font-bold font-mono text-teal-600 dark:text-teal-400">{res2}%</span>
            </div>
            <div className="flex justify-center">
              <ShareResultButton
                toolName="Percentage Calculator"
                resultSummary={`${num2A} is ${res2}% of ${num2B}`}
              />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 mb-2">
              3. Percentage Change
            </h4>
            <p className="text-xs text-slate-500 mb-4">Calculate increase or decrease.</p>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Initial Value</label>
                <input
                  type="number"
                  value={val3A}
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setVal3A(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">Final Value</label>
                <input
                  type="number"
                  value={val3B}
                  placeholder="0"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setVal3B(e.target.value === '' ? '' : parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center">
              <span className="text-[10px] text-teal-800 dark:text-teal-300 block font-semibold">
                {isIncrease ? 'Increase' : 'Decrease'}
              </span>
              <span className={`text-2xl font-bold font-mono ${isIncrease ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isIncrease ? `+${pct3}%` : `${pct3}%`}
              </span>
            </div>
            <div className="flex justify-center">
              <ShareResultButton
                toolName="Percentage Calculator"
                resultSummary={`Change from ${num3A} to ${num3B} is ${isIncrease ? `+${pct3}%` : `${pct3}%`}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
