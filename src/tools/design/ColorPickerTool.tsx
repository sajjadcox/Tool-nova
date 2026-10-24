import React, { useState } from 'react';
import { Pipette, Copy, RefreshCw } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const ColorPickerTool: React.FC = () => {
  const [colorHex, setColorHex] = useState<string>('#16A085');

  // Convert hex to rgb
  const hexToRgb = (hex: string) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return { r, g, b, str: `rgb(${r}, ${g}, ${b})` };
  };

  // Convert rgb to hsl
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const rgb = hexToRgb(colorHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const presets = [
    '#16A085', '#2ECC71', '#3498DB', '#9B59B6', '#34495E',
    '#F1C40F', '#E67E22', '#E74C3C', '#1ABC9C', '#6366F1'
  ];

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Big Color Card */}
      <div
        className="h-44 rounded-3xl shadow-md border border-slate-200 dark:border-slate-800 transition-colors flex items-center justify-center"
        style={{ backgroundColor: colorHex }}
      >
        <span
          className="px-4 py-2 rounded-xl backdrop-blur-md bg-black/40 text-white font-mono text-xl font-bold tracking-wider"
        >
          {colorHex.toUpperCase()}
        </span>
      </div>

      {/* Color Picker & Presets */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={colorHex}
            onChange={(e) => setColorHex(e.target.value)}
            className="w-14 h-14 rounded-2xl cursor-pointer border-0 p-0"
          />
          <div className="flex-1">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hex Code</label>
            <input
              type="text"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase"
            />
          </div>
        </div>

        {/* Quick Swatches */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-200 dark:border-slate-800">
          <span className="text-xs font-semibold text-slate-500">Presets:</span>
          {presets.map(p => (
            <button
              key={p}
              type="button"
              onClick={() => setColorHex(p)}
              className="w-7 h-7 rounded-xl border border-white dark:border-slate-700 shadow-xs hover:scale-110 transition-transform"
              style={{ backgroundColor: p }}
              title={p}
            />
          ))}
        </div>
      </div>

      {/* Format Codes */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Color Value Formats
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 block">HEX</span>
            <span className="font-mono text-sm font-bold block">{colorHex.toUpperCase()}</span>
            <CopyButton textToCopy={colorHex.toUpperCase()} />
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 block">RGB</span>
            <span className="font-mono text-sm font-bold block truncate">{rgb.str}</span>
            <CopyButton textToCopy={rgb.str} />
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 block">HSL</span>
            <span className="font-mono text-sm font-bold block truncate">{hsl}</span>
            <CopyButton textToCopy={hsl} />
          </div>
        </div>
      </div>
    </div>
  );
};
