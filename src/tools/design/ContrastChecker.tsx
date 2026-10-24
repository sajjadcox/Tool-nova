import React, { useState } from 'react';
import { Contrast, CheckCircle2, XCircle, ArrowRightLeft } from 'lucide-react';

export const ContrastChecker: React.FC = () => {
  const [fgColor, setFgColor] = useState<string>('#16A085');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');

  // Relative luminance
  const getLuminance = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;

    const sRGB = [r, g, b].map(val => {
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const getContrastRatio = () => {
    const l1 = getLuminance(fgColor);
    const l2 = getLuminance(bgColor);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (lighter + 0.05) / (darker + 0.05);
    return parseFloat(ratio.toFixed(2));
  };

  const ratio = getContrastRatio();

  const swap = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  const passes = {
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Pickers */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Foreground (Text) Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={swap}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-100"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap Foreground & Background</span>
          </button>
        </div>
      </div>

      {/* Preview Card */}
      <div
        className="p-8 rounded-3xl border shadow-md space-y-2 text-center transition-colors"
        style={{ backgroundColor: bgColor, color: fgColor, borderColor: fgColor + '33' }}
      >
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight block">
          ToolNova Contrast Preview
        </span>
        <p className="text-sm font-medium opacity-90 max-w-md mx-auto">
          The quick brown fox jumps over the lazy dog. Good contrast improves legibility for all users.
        </p>
      </div>

      {/* WCAG Criteria Results */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Contrast Ratio
          </span>
          <span className="text-2xl font-black font-mono text-teal-600 dark:text-teal-400">
            {ratio} : 1
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs font-medium">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span>WCAG AA Normal Text (4.5:1)</span>
            {passes.aaNormal ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">Pass</span>
            ) : (
              <span className="text-rose-600 font-bold flex items-center gap-1">Fail</span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span>WCAG AA Large Text (3.0:1)</span>
            {passes.aaLarge ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">Pass</span>
            ) : (
              <span className="text-rose-600 font-bold flex items-center gap-1">Fail</span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span>WCAG AAA Normal Text (7.0:1)</span>
            {passes.aaaNormal ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">Pass</span>
            ) : (
              <span className="text-rose-600 font-bold flex items-center gap-1">Fail</span>
            )}
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span>WCAG AAA Large Text (4.5:1)</span>
            {passes.aaaLarge ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">Pass</span>
            ) : (
              <span className="text-rose-600 font-bold flex items-center gap-1">Fail</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
