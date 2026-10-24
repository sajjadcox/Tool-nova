import React, { useState } from 'react';
import { BoxSelect, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const CssBoxShadowGenerator: React.FC = () => {
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(10);
  const [blurRadius, setBlurRadius] = useState<number>(25);
  const [spreadRadius, setSpreadRadius] = useState<number>(-5);
  const [shadowColor, setShadowColor] = useState<string>('#000000');
  const [opacity, setOpacity] = useState<number>(0.15);
  const [inset, setInset] = useState<boolean>(false);

  // Convert hex + opacity to rgba
  const hexToRgba = (hex: string, alpha: number) => {
    let clean = hex.replace('#', '');
    if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const rgba = hexToRgba(shadowColor, opacity);
  const shadowValue = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blurRadius}px ${spreadRadius}px ${rgba}`;
  const css = `box-shadow: ${shadowValue};`;

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Visual Preview */}
      <div className="h-56 rounded-3xl bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-6 border border-slate-200 dark:border-slate-800">
        <div
          className="w-40 h-28 rounded-2xl bg-white dark:bg-[#131C31] flex items-center justify-center text-xs font-bold text-slate-700 dark:text-slate-300 transition-all"
          style={{ boxShadow: shadowValue }}
        >
          Shadow Box
        </div>
      </div>

      {/* Controls */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs font-semibold">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>X Offset</span>
              <span className="font-mono text-teal-600">{offsetX}px</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={offsetX}
              onChange={(e) => setOffsetX(parseInt(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Y Offset</span>
              <span className="font-mono text-teal-600">{offsetY}px</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Blur Radius</span>
              <span className="font-mono text-teal-600">{blurRadius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={blurRadius}
              onChange={(e) => setBlurRadius(parseInt(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span>Spread Radius</span>
              <span className="font-mono text-teal-600">{spreadRadius}px</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              value={spreadRadius}
              onChange={(e) => setSpreadRadius(parseInt(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 items-center">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={shadowColor}
              onChange={(e) => setShadowColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
            />
            <div>
              <span className="block text-[11px] text-slate-500">Color & Opacity ({Math.round(opacity * 100)}%)</span>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-24 accent-teal-600"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inset}
              onChange={(e) => setInset(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Inset Shadow</span>
          </label>
        </div>
      </div>

      {/* Generated CSS */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <code className="text-xs font-mono text-teal-700 dark:text-teal-400 break-all">
          {css}
        </code>
        <CopyButton textToCopy={css} label="Copy CSS" />
      </div>
    </div>
  );
};
