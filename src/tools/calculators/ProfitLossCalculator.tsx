import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const ProfitLossCalculator: React.FC = () => {
  const [costPrice, setCostPrice] = useState<number>(100);
  const [sellingPrice, setSellingPrice] = useState<number>(140);

  const profitOrLoss = sellingPrice - costPrice;
  const isProfit = profitOrLoss >= 0;
  const percentage = costPrice > 0 ? (Math.abs(profitOrLoss) / costPrice) * 100 : 0;
  const profitMargin = sellingPrice > 0 ? (profitOrLoss / sellingPrice) * 100 : 0;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cost Price ($)</label>
          <input
            type="number"
            value={costPrice}
            onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Selling Price ($)</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      <div
        className={`p-8 rounded-3xl border text-center space-y-2 ${
          isProfit
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
        }`}
      >
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {isProfit ? 'Net Profit' : 'Net Loss'}
        </span>
        <div
          className={`text-4xl font-extrabold font-mono ${
            isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}
        >
          {isProfit ? `+$${profitOrLoss.toFixed(2)}` : `-$${Math.abs(profitOrLoss).toFixed(2)}`}
        </div>
        <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 pt-2 flex items-center justify-center gap-4">
          <span>Markup: <strong>{percentage.toFixed(1)}%</strong></span>
          <span>•</span>
          <span>Profit Margin: <strong>{profitMargin.toFixed(1)}%</strong></span>
        </div>
      </div>
    </div>
  );
};
