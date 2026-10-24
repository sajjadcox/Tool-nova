import React, { useState, useEffect } from 'react';
import { Lock, RefreshCw, Copy, Check, ShieldCheck } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState<number>(18);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(true); // e.g. 0, O, l, 1, I
  const [password, setPassword] = useState<string>('');

  const generatePassword = () => {
    let chars = '';
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const upperAll = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const lowerAll = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '23456789';
    const numsAll = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (includeUppercase) chars += excludeAmbiguous ? upper : upperAll;
    if (includeLowercase) chars += excludeAmbiguous ? lower : lowerAll;
    if (includeNumbers) chars += excludeAmbiguous ? nums : numsAll;
    if (includeSymbols) chars += syms;

    if (!chars) return '';

    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[randomValues[i] % chars.length];
    }
    return result;
  };

  useEffect(() => {
    setPassword(generatePassword());
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous]);

  // Calculate Shannon entropy: length * log2(poolSize)
  const getEntropy = () => {
    let pool = 0;
    if (includeUppercase) pool += 26;
    if (includeLowercase) pool += 26;
    if (includeNumbers) pool += 10;
    if (includeSymbols) pool += 30;
    if (pool === 0) return 0;
    return Math.round(length * Math.log2(pool));
  };

  const entropy = getEntropy();

  const getStrengthLabel = (ent: number) => {
    if (ent < 50) return { label: 'Weak', color: 'text-amber-500', bar: 'w-1/4 bg-amber-500' };
    if (ent < 75) return { label: 'Moderate', color: 'text-yellow-500', bar: 'w-2/4 bg-yellow-500' };
    if (ent < 100) return { label: 'Strong', color: 'text-teal-600', bar: 'w-3/4 bg-teal-500' };
    return { label: 'Very Strong (Military-Grade)', color: 'text-emerald-600', bar: 'w-full bg-emerald-500' };
  };

  const strength = getStrengthLabel(entropy);

  return (
    <div className="space-y-6">
      {/* Generated Password Box */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Generated Secure Password
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold ${strength.color}`}>
              {strength.label} ({entropy} bits entropy)
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="font-mono text-base sm:text-xl font-bold text-slate-900 dark:text-white break-all select-all">
            {password || 'Select at least one character set'}
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setPassword(generatePassword())}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <CopyButton textToCopy={password} label="Copy Password" />
          </div>
        </div>

        {/* Strength meter bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-300 rounded-full ${strength.bar}`} />
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-6">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            <span>Password Length</span>
            <span className="font-mono text-teal-600 dark:text-teal-400 text-sm">{length} characters</span>
          </div>
          <input
            type="range"
            min="8"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>8 (Basic)</span>
            <span>16 (Recommended)</span>
            <span>32 (High Security)</span>
            <span>64 (Maximum)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-4 border-t border-slate-200 dark:border-slate-700">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>Special Symbols (!@#$%)</span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => setExcludeAmbiguous(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>Avoid Ambiguous Characters (0, O, l, 1, I)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
