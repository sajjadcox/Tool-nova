import React, { useState } from 'react';
import { HardDrive } from 'lucide-react';

export const FileSizeConverter: React.FC = () => {
  const [value, setValue] = useState<number>(1024);
  const [unit, setUnit] = useState<string>('MB');
  const [base, setBase] = useState<'binary' | 'decimal'>('binary'); // 1024 vs 1000

  const multiplier = base === 'binary' ? 1024 : 1000;

  const toBytes = (val: number, u: string): number => {
    switch (u) {
      case 'B': return val;
      case 'KB': return val * multiplier;
      case 'MB': return val * Math.pow(multiplier, 2);
      case 'GB': return val * Math.pow(multiplier, 3);
      case 'TB': return val * Math.pow(multiplier, 4);
      default: return val;
    }
  };

  const bytes = toBytes(value, unit);

  const formatUnit = (b: number, div: number) => {
    const res = b / div;
    return Number.isInteger(res) ? res.toString() : res.toFixed(4);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Unit</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
            >
              <option value="B">Bytes (B)</option>
              <option value="KB">Kilobytes (KB)</option>
              <option value="MB">Megabytes (MB)</option>
              <option value="GB">Gigabytes (GB)</option>
              <option value="TB">Terabytes (TB)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <span>Base Standard:</span>
          <button
            type="button"
            onClick={() => setBase('binary')}
            className={`px-3 py-1.5 rounded-xl ${base === 'binary' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 border'}`}
          >
            Binary (1024 base - OS file size)
          </button>
          <button
            type="button"
            onClick={() => setBase('decimal')}
            className={`px-3 py-1.5 rounded-xl ${base === 'decimal' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 border'}`}
          >
            Decimal (1000 base - Storage drive maker)
          </button>
        </div>
      </div>

      {/* Grid of All Units */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { label: 'Bytes', val: bytes.toLocaleString() + ' B' },
          { label: 'Kilobytes', val: formatUnit(bytes, multiplier) + ' KB' },
          { label: 'Megabytes', val: formatUnit(bytes, Math.pow(multiplier, 2)) + ' MB' },
          { label: 'Gigabytes', val: formatUnit(bytes, Math.pow(multiplier, 3)) + ' GB' },
          { label: 'Terabytes', val: formatUnit(bytes, Math.pow(multiplier, 4)) + ' TB' },
          { label: 'Bits', val: (bytes * 8).toLocaleString() + ' bits' }
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1"
          >
            <span className="text-[11px] text-slate-400 block font-semibold uppercase">{item.label}</span>
            <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 truncate block">
              {item.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
