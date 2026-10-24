import React, { useState } from 'react';
import { BadgePercent } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const DiscountCalculator: React.FC = () => {
  const [originalPrice, setOriginalPrice] = useState<number | ''>(100);
  const [discountPercent, setDiscountPercent] = useState<number | ''>(25);
  const [taxPercent, setTaxPercent] = useState<number | ''>(8);

  const priceNum = originalPrice === '' ? 0 : originalPrice;
  const discNum = discountPercent === '' ? 0 : discountPercent;
  const taxNum = taxPercent === '' ? 0 : taxPercent;

  const discountAmount = (priceNum * discNum) / 100;
  const priceAfterDiscount = Math.max(0, priceNum - discountAmount);
  const taxAmount = (priceAfterDiscount * taxNum) / 100;
  const finalPrice = priceAfterDiscount + taxAmount;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Original Price ($)</label>
          <input
            type="number"
            value={originalPrice}
            placeholder="0"
            onFocus={(e) => e.target.select()}
            onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
            className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Discount (% off)</label>
            <input
              type="number"
              value={discountPercent}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onChange={(e) => setDiscountPercent(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Optional Sales Tax (%)</label>
            <input
              type="number"
              value={taxPercent}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onChange={(e) => setTaxPercent(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
          Final Price You Pay
        </span>
        <div className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
          ${finalPrice.toFixed(2)}
        </div>
        <p className="text-xs text-slate-500 pt-1">
          You save <strong className="text-emerald-600">${discountAmount.toFixed(2)}</strong> ({discNum}%) with ${taxAmount.toFixed(2)} tax.
        </p>
        <div className="pt-2 flex justify-center">
          <ShareResultButton
            toolName="Discount Calculator"
            resultSummary={`$${priceNum} with ${discNum}% discount = $${finalPrice.toFixed(2)} (Saved $${discountAmount.toFixed(2)})`}
          />
        </div>
      </div>
    </div>
  );
};
