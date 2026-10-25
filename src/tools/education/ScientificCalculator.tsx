import React, { useState } from 'react';
import { Calculator, Delete, RotateCcw, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState<string>('0');
  const [equation, setEquation] = useState<string>('');
  const [isRad, setIsRad] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>([]);

  const handleNum = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
  };

  const handleBackspace = () => {
    setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  const calculate = () => {
    try {
      const fullExpr = equation + display;
      // Sanitize expression
      const cleanExpr = fullExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');

      // Safe math evaluator using Function constructor
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${cleanExpr})`)();
      const formatted = Number.isFinite(result) ? String(parseFloat(result.toFixed(8))) : 'Error';
      
      setHistory(prev => [fullExpr + ' = ' + formatted, ...prev.slice(0, 9)]);
      setDisplay(formatted);
      setEquation('');
    } catch {
      setDisplay('Error');
    }
  };

  const handleScientific = (func: string) => {
    const val = parseFloat(display);
    if (isNaN(val)) return;

    let res = 0;
    const factor = isRad ? 1 : Math.PI / 180;

    switch (func) {
      case 'sin':
        res = Math.sin(val * factor);
        break;
      case 'cos':
        res = Math.cos(val * factor);
        break;
      case 'tan':
        res = Math.tan(val * factor);
        break;
      case 'sqrt':
        res = Math.sqrt(val);
        break;
      case 'square':
        res = Math.pow(val, 2);
        break;
      case 'cube':
        res = Math.pow(val, 3);
        break;
      case 'log':
        res = Math.log10(val);
        break;
      case 'ln':
        res = Math.log(val);
        break;
      case 'inv':
        res = 1 / val;
        break;
      case 'abs':
        res = Math.abs(val);
        break;
      case 'fact':
        let f = 1;
        for (let i = 2; i <= Math.min(val, 170); i++) f *= i;
        res = f;
        break;
      case 'pi':
        res = Math.PI;
        break;
      case 'e':
        res = Math.E;
        break;
    }

    const formatted = Number.isFinite(res) ? String(parseFloat(res.toFixed(8))) : 'Error';
    setHistory(prev => [`${func}(${val}) = ${formatted}`, ...prev.slice(0, 9)]);
    setDisplay(formatted);
  };

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Scientific Calculator
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsRad(!isRad)}
            className="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-xs bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            {isRad ? 'RAD' : 'DEG'}
          </button>
        </div>

        {/* Display Screen */}
        <div className="p-4 rounded-2xl bg-slate-900 text-right space-y-1 font-mono border border-slate-800">
          <p className="text-xs text-slate-400 h-5">
            {equation}
          </p>
          <div className="flex items-center justify-between gap-2">
            <CopyButton textToCopy={display} label="" className="text-slate-500 hover:text-white" />
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 overflow-x-auto scrollbar-none">
              {display}
            </span>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold">
          {/* Scientific Row 1 */}
          <button type="button" onClick={() => handleScientific('sin')} className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100">sin</button>
          <button type="button" onClick={() => handleScientific('cos')} className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100">cos</button>
          <button type="button" onClick={() => handleScientific('tan')} className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100">tan</button>
          <button type="button" onClick={() => handleScientific('log')} className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100">log</button>
          <button type="button" onClick={() => handleScientific('ln')} className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100">ln</button>

          {/* Scientific Row 2 */}
          <button type="button" onClick={() => handleScientific('sqrt')} className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100">&radic;x</button>
          <button type="button" onClick={() => handleScientific('square')} className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100">x&sup2;</button>
          <button type="button" onClick={() => handleScientific('cube')} className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100">x&sup3;</button>
          <button type="button" onClick={() => handleScientific('fact')} className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100">n!</button>
          <button type="button" onClick={() => handleScientific('inv')} className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100">1/x</button>

          {/* Numeric + Operations Row 1 */}
          <button type="button" onClick={() => handleScientific('pi')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">&pi;</button>
          <button type="button" onClick={handleClear} className="p-3 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">AC</button>
          <button type="button" onClick={handleBackspace} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"><Delete className="w-4 h-4 mx-auto" /></button>
          <button type="button" onClick={() => handleOp('%')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">%</button>
          <button type="button" onClick={() => handleOp('÷')} className="p-3 rounded-xl bg-indigo-600 text-white">&divide;</button>

          {/* Numeric Row 2 */}
          <button type="button" onClick={() => handleScientific('e')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">e</button>
          <button type="button" onClick={() => handleNum('7')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">7</button>
          <button type="button" onClick={() => handleNum('8')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">8</button>
          <button type="button" onClick={() => handleNum('9')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">9</button>
          <button type="button" onClick={() => handleOp('×')} className="p-3 rounded-xl bg-indigo-600 text-white">&times;</button>

          {/* Numeric Row 3 */}
          <button type="button" onClick={() => handleScientific('abs')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">|x|</button>
          <button type="button" onClick={() => handleNum('4')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">4</button>
          <button type="button" onClick={() => handleNum('5')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">5</button>
          <button type="button" onClick={() => handleNum('6')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">6</button>
          <button type="button" onClick={() => handleOp('-')} className="p-3 rounded-xl bg-indigo-600 text-white">&minus;</button>

          {/* Numeric Row 4 */}
          <button type="button" onClick={() => handleOp('^')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">xʸ</button>
          <button type="button" onClick={() => handleNum('1')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">1</button>
          <button type="button" onClick={() => handleNum('2')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">2</button>
          <button type="button" onClick={() => handleNum('3')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">3</button>
          <button type="button" onClick={() => handleOp('+')} className="p-3 rounded-xl bg-indigo-600 text-white">+</button>

          {/* Numeric Row 5 */}
          <button type="button" onClick={() => setDisplay(prev => prev.startsWith('-') ? prev.slice(1) : '-' + prev)} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">&plusmn;</button>
          <button type="button" onClick={() => handleNum('0')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">0</button>
          <button type="button" onClick={() => handleNum('.')} className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white">.</button>
          <button type="button" onClick={calculate} className="col-span-2 p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md">=</button>
        </div>

        {/* Calculation History */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
            <span className="font-bold text-slate-500 uppercase">Recent History:</span>
            <div className="space-y-1 font-mono text-slate-600 dark:text-slate-400">
              {history.map((h, i) => (
                <div key={i} className="flex justify-between py-0.5 border-b border-slate-100 dark:border-slate-800/60">
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
