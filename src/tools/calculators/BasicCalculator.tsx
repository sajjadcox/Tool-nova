import React, { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

export const BasicCalculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState<boolean>(true);

  const handleDigit = (d: string) => {
    if (overwrite) {
      setDisplay(d);
      setOverwrite(false);
    } else {
      setDisplay(display === '0' ? d : display + d);
    }
  };

  const handleDot = () => {
    if (overwrite) {
      setDisplay('0.');
      setOverwrite(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    if (prevValue !== null && operation && !overwrite) {
      const res = calculate(prevValue, current, operation);
      setDisplay(res.toString());
      setPrevValue(res);
    } else {
      setPrevValue(current);
    }
    setOperation(op);
    setOverwrite(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEqual = () => {
    if (prevValue === null || !operation) return;
    const current = parseFloat(display);
    const res = calculate(prevValue, current, operation);
    setDisplay(res.toString());
    setPrevValue(null);
    setOperation(null);
    setOverwrite(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setOverwrite(true);
  };

  const handleBackspace = () => {
    if (overwrite) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setOverwrite(true);
    }
  };

  const handleToggleSign = () => {
    const num = parseFloat(display);
    setDisplay((-num).toString());
  };

  const handlePercent = () => {
    const num = parseFloat(display);
    setDisplay((num / 100).toString());
  };

  return (
    <div className="max-w-sm mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4">
      {/* Display */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 text-right space-y-1">
        <div className="text-xs text-slate-400 font-mono h-4">
          {prevValue !== null && operation ? `${prevValue} ${operation}` : ''}
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight truncate">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2.5">
        <button
          onClick={handleClear}
          className="p-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-300 transition-colors"
        >
          AC
        </button>
        <button
          onClick={handleToggleSign}
          className="p-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-300 transition-colors"
        >
          ±
        </button>
        <button
          onClick={handlePercent}
          className="p-3.5 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-300 transition-colors"
        >
          %
        </button>
        <button
          onClick={() => handleOperation('÷')}
          className="p-3.5 rounded-2xl bg-teal-600 text-white font-bold text-base hover:bg-teal-700 transition-colors"
        >
          ÷
        </button>

        {['7', '8', '9'].map(d => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-bold text-lg text-slate-900 dark:text-white hover:bg-slate-100 transition-colors"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperation('×')}
          className="p-3.5 rounded-2xl bg-teal-600 text-white font-bold text-base hover:bg-teal-700 transition-colors"
        >
          ×
        </button>

        {['4', '5', '6'].map(d => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-bold text-lg text-slate-900 dark:text-white hover:bg-slate-100 transition-colors"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperation('-')}
          className="p-3.5 rounded-2xl bg-teal-600 text-white font-bold text-base hover:bg-teal-700 transition-colors"
        >
          -
        </button>

        {['1', '2', '3'].map(d => (
          <button
            key={d}
            onClick={() => handleDigit(d)}
            className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-bold text-lg text-slate-900 dark:text-white hover:bg-slate-100 transition-colors"
          >
            {d}
          </button>
        ))}
        <button
          onClick={() => handleOperation('+')}
          className="p-3.5 rounded-2xl bg-teal-600 text-white font-bold text-base hover:bg-teal-700 transition-colors"
        >
          +
        </button>

        <button
          onClick={() => handleDigit('0')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-bold text-lg text-slate-900 dark:text-white hover:bg-slate-100 transition-colors"
        >
          0
        </button>
        <button
          onClick={handleDot}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-bold text-lg text-slate-900 dark:text-white hover:bg-slate-100 transition-colors"
        >
          .
        </button>
        <button
          onClick={handleBackspace}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center justify-center transition-colors"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          onClick={handleEqual}
          className="p-3.5 rounded-2xl bg-emerald-600 text-white font-bold text-xl hover:bg-emerald-700 transition-colors shadow-sm"
        >
          =
        </button>
      </div>
    </div>
  );
};
