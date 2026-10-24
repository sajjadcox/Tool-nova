import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Check, X, Eye, EyeOff } from 'lucide-react';

export const PasswordStrengthChecker: React.FC = () => {
  const [password, setPassword] = useState<string>('P@ssw0rd!2026Nova');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const isLongEnough = password.length >= 12;

  const calculateEntropy = () => {
    let pool = 0;
    if (hasUpper) pool += 26;
    if (hasLower) pool += 26;
    if (hasNumber) pool += 10;
    if (hasSymbol) pool += 32;
    if (pool === 0 || password.length === 0) return 0;
    return Math.round(password.length * Math.log2(pool));
  };

  const entropy = calculateEntropy();

  const getCrackTime = (ent: number) => {
    // Assuming 10 billion guesses/second (modern GPU cluster)
    if (ent === 0) return 'Instant';
    if (ent < 30) return '< 1 millisecond';
    if (ent < 45) return 'A few seconds';
    if (ent < 60) return 'A few hours';
    if (ent < 75) return 'Several months';
    if (ent < 90) return 'Thousands of years';
    return 'Centuries (Virtually Uncrackable)';
  };

  const checks = [
    { label: 'Minimum 12 characters length', passed: isLongEnough },
    { label: 'Contains uppercase letter (A-Z)', passed: hasUpper },
    { label: 'Contains lowercase letter (a-z)', passed: hasLower },
    { label: 'Contains number digit (0-9)', passed: hasNumber },
    { label: 'Contains special symbol (!@#$)', passed: hasSymbol },
  ];

  return (
    <div className="space-y-6">
      {/* Input Field */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Enter Password to Evaluate
        </label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste password here..."
            className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-sm outline-none focus:border-teal-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Shannon Entropy</span>
          <span className="text-2xl font-bold font-mono text-teal-600 dark:text-teal-400">
            {entropy} bits
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Estimated Brute-Force Time</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block truncate pt-1">
            {getCrackTime(entropy)}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
          <span className="text-[11px] text-slate-400 block font-medium">Length</span>
          <span className="text-2xl font-bold font-mono text-slate-800 dark:text-slate-200">
            {password.length} chars
          </span>
        </div>
      </div>

      {/* Security Checklist */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Password Health Checklist
        </h4>
        <div className="space-y-2">
          {checks.map((chk, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs">
              {chk.passed ? (
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                  <X className="w-3.5 h-3.5" />
                </div>
              )}
              <span className={chk.passed ? 'text-slate-700 dark:text-slate-300 font-medium' : 'text-slate-400'}>
                {chk.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
