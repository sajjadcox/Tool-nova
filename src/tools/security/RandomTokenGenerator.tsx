import React, { useState } from 'react';
import { KeyRound, RefreshCw, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const RandomTokenGenerator: React.FC = () => {
  const [tokenType, setTokenType] = useState<'hex' | 'alphanumeric' | 'base64'>('hex');
  const [byteLength, setByteLength] = useState<number>(32);

  const generateToken = () => {
    const randomBytes = new Uint8Array(byteLength);
    crypto.getRandomValues(randomBytes);

    if (tokenType === 'hex') {
      return Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');
    } else if (tokenType === 'base64') {
      const binString = Array.from(randomBytes, b => String.fromCharCode(b)).join('');
      return btoa(binString);
    } else {
      // Alphanumeric
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return Array.from(randomBytes, b => chars[b % chars.length]).join('');
    }
  };

  const [token, setToken] = useState<string>(() => generateToken());

  const handleRegenerate = () => {
    setToken(generateToken());
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Generated API / Secret Token
        </span>

        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800">
          <span className="font-mono text-sm sm:text-base font-bold text-teal-600 dark:text-teal-400 break-all select-all">
            {token}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRegenerate}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600"
              title="Regenerate token"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <CopyButton textToCopy={token} label="Copy Token" />
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            Token Format
          </label>
          <div className="flex items-center gap-2">
            {[
              { id: 'hex', label: 'Hexadecimal' },
              { id: 'alphanumeric', label: 'Alphanumeric' },
              { id: 'base64', label: 'Base64' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTokenType(t.id as any);
                  const randomBytes = new Uint8Array(byteLength);
                  crypto.getRandomValues(randomBytes);
                  if (t.id === 'hex') {
                    setToken(Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join(''));
                  } else if (t.id === 'base64') {
                    const binString = Array.from(randomBytes, b => String.fromCharCode(b)).join('');
                    setToken(btoa(binString));
                  } else {
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                    setToken(Array.from(randomBytes, b => chars[b % chars.length]).join(''));
                  }
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  tokenType === t.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            <span>Entropy Bytes: {byteLength} bytes</span>
            <span className="font-mono text-teal-600">{byteLength * 8} bits</span>
          </div>
          <input
            type="range"
            min="16"
            max="128"
            step="16"
            value={byteLength}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setByteLength(val);
              const randomBytes = new Uint8Array(val);
              crypto.getRandomValues(randomBytes);
              if (tokenType === 'hex') {
                setToken(Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join(''));
              } else if (tokenType === 'base64') {
                const binString = Array.from(randomBytes, b => String.fromCharCode(b)).join('');
                setToken(btoa(binString));
              } else {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                setToken(Array.from(randomBytes, b => chars[b % chars.length]).join(''));
              }
            }}
            className="w-full accent-teal-600"
          />
        </div>
      </div>
    </div>
  );
};
