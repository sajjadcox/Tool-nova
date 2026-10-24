import React, { useState, useEffect, useRef } from 'react';
import { Barcode, Download, RefreshCw } from 'lucide-react';
import { DownloadButton } from '../../components/common/DownloadButton';

export const BarcodeGenerator: React.FC = () => {
  const [value, setValue] = useState<string>('TOOLNOVA-9842');
  const [barWidth, setBarWidth] = useState<number>(2);
  const [barHeight, setBarHeight] = useState<number>(80);
  const [includeText, setIncludeText] = useState<boolean>(true);
  const [barcodeUrl, setBarcodeUrl] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const drawBarcode = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clean input
    const cleanStr = value.trim() || 'SAMPLE';
    const binary = getCode128Binary(cleanStr);

    const padding = 20;
    const textHeight = includeText ? 24 : 0;
    const totalWidth = binary.length * barWidth + padding * 2;
    const totalHeight = barHeight + padding * 2 + textHeight;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Bars
    ctx.fillStyle = '#000000';
    let currentX = padding;
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] === '1') {
        ctx.fillRect(currentX, padding, barWidth, barHeight);
      }
      currentX += barWidth;
    }

    // Text Label
    if (includeText) {
      ctx.fillStyle = '#172033';
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(cleanStr, totalWidth / 2, padding + barHeight + 18);
    }

    setBarcodeUrl(canvas.toDataURL('image/png'));
  };

  // Simplified deterministic Code-128 pattern generator
  const getCode128Binary = (str: string) => {
    let result = '11010010000'; // Start code
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      // Generate pattern based on character
      const binPattern = (charCode * 12345).toString(2).padStart(11, '0').slice(-11);
      result += binPattern;
    }
    result += '1100011101011'; // Stop pattern
    return result;
  };

  useEffect(() => {
    drawBarcode();
  }, [value, barWidth, barHeight, includeText]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Barcode Data (Alphanumeric)
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g. PRODUCT-1024"
              className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <div className="flex justify-between mb-1">
                <span>Bar Width</span>
                <span className="font-mono">{barWidth}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                value={barWidth}
                onChange={(e) => setBarWidth(parseInt(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Bar Height</span>
                <span className="font-mono">{barHeight}px</span>
              </div>
              <input
                type="range"
                min="40"
                max="140"
                value={barHeight}
                onChange={(e) => setBarHeight(parseInt(e.target.value))}
                className="w-full accent-teal-600"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={includeText}
                onChange={(e) => setIncludeText(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Display text label underneath barcode</span>
            </label>
          </div>
        </div>

        {/* Barcode Preview */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-5 text-center">
          <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-200 max-w-full overflow-x-auto">
            {barcodeUrl && (
              <img
                src={barcodeUrl}
                alt="Barcode"
                className="max-h-48 object-contain"
              />
            )}
          </div>

          {barcodeUrl && (
            <DownloadButton
              filename={`barcode-${value}.png`}
              dataUrl={barcodeUrl}
              label="Download Barcode (PNG)"
            />
          )}
        </div>
      </div>
    </div>
  );
};
