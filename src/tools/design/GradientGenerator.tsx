import React, { useState } from 'react';
import { Palette, Copy, RefreshCw } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const GradientGenerator: React.FC = () => {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [color1, setColor1] = useState<string>('#16A085');
  const [color2, setColor2] = useState<string>('#6366F1');
  const [angle, setAngle] = useState<number>(135);

  const getCssString = () => {
    if (gradientType === 'linear') {
      return `background: linear-gradient(${angle}deg, ${color1}, ${color2});`;
    }
    return `background: radial-gradient(circle, ${color1}, ${color2});`;
  };

  const css = getCssString();

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Visual Canvas */}
      <div
        className="h-48 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 transition-all flex items-center justify-center p-4"
        style={{
          background: gradientType === 'linear'
            ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
            : `radial-gradient(circle, ${color1}, ${color2})`
        }}
      >
        <span className="px-4 py-2 rounded-xl backdrop-blur-md bg-black/40 text-white font-mono text-sm font-bold shadow-xs">
          Gradient Preview
        </span>
      </div>

      {/* Controls */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGradientType('linear')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              gradientType === 'linear' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Linear Gradient
          </button>
          <button
            type="button"
            onClick={() => setGradientType('radial')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
              gradientType === 'radial' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            Radial Gradient
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Color 1</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Color 2</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase"
              />
            </div>
          </div>
        </div>

        {gradientType === 'linear' && (
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              <span>Angle</span>
              <span className="font-mono text-teal-600">{angle}°</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>
        )}
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
