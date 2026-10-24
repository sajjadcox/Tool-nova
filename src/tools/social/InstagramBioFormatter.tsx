import React, { useState } from 'react';
import { Sparkles, Copy, Check, Instagram } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

interface FontVariant {
  name: string;
  transform: (text: string) => string;
}

export const InstagramBioFormatter: React.FC = () => {
  const [bioText, setBioText] = useState<string>('Creating digital experiences & tools');
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const convertChars = (text: string, baseUpper: number, baseLower: number, baseDigit?: number) => {
    return text
      .split('')
      .map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCodePoint(baseUpper + (code - 65));
        }
        if (code >= 97 && code <= 122) {
          return String.fromCodePoint(baseLower + (code - 97));
        }
        if (baseDigit && code >= 48 && code <= 57) {
          return String.fromCodePoint(baseDigit + (code - 48));
        }
        return char;
      })
      .join('');
  };

  const fontStyles: FontVariant[] = [
    {
      name: 'Bold Sans',
      transform: (t) => convertChars(t, 0x1d5d4, 0x1d5ee, 0x1d7ec)
    },
    {
      name: 'Bold Serif',
      transform: (t) => convertChars(t, 0x1d400, 0x1d41a, 0x1d7ce)
    },
    {
      name: 'Italic Serif',
      transform: (t) => convertChars(t, 0x1d434, 0x1d44e)
    },
    {
      name: 'Gothic / Fraktur',
      transform: (t) => convertChars(t, 0x1d56c, 0x1d586)
    },
    {
      name: 'Double-Struck / Blackboard',
      transform: (t) => convertChars(t, 0x1d538, 0x1d552, 0x1d7d8)
    },
    {
      name: 'Circled / Bubble',
      transform: (t) => convertChars(t, 0x24b6, 0x24d0, 0x2460)
    },
    {
      name: 'Monospace Code',
      transform: (t) => convertChars(t, 0x1d670, 0x1d68a, 0x1d7f6)
    },
    {
      name: 'Squared Inverted',
      transform: (t) => convertChars(t, 0x1f170, 0x1f170)
    }
  ];

  const handleCopy = async (styleName: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedName(styleName);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const charLimit = 150;
  const currentChars = bioText.length;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-pink-50 dark:bg-pink-950/50 rounded-xl text-pink-600 dark:text-pink-400">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Instagram Bio & Unicode Font Generator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Generate aesthetic Unicode fonts and stay within Instagram's 150-character limit.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Instagram Bio Formatter"
            resultSummary="Generated aesthetic Instagram bio fonts with ToolNova!"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Bio Text</label>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-mono font-bold ${currentChars > charLimit ? 'text-red-500' : 'text-slate-500'}`}>
                {currentChars} / {charLimit} chars
              </span>
              {bioText && (
                <button
                  type="button"
                  onClick={() => setBioText('')}
                  className="text-xs text-slate-400 hover:text-red-500"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            placeholder="Type your bio or headline..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">Aesthetic Font Styles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fontStyles.map(font => {
              const styled = font.transform(bioText);
              return (
                <div
                  key={font.name}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between gap-3"
                >
                  <div className="overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-slate-400">{font.name}</span>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 mt-0.5 truncate select-all">
                      {styled}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(font.name, styled)}
                    className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Copy Font"
                  >
                    {copiedName === font.name ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
