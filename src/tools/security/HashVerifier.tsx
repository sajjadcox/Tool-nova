import React, { useState } from 'react';
import { CheckCheck, XCircle, CheckCircle2 } from 'lucide-react';

export const HashVerifier: React.FC = () => {
  const [text, setText] = useState<string>('ToolNova');
  const [targetHash, setTargetHash] = useState<string>('');
  const [algo, setAlgo] = useState<string>('SHA-256');
  const [matchResult, setMatchResult] = useState<{ matches: boolean; computedHash: string } | null>(null);

  const handleVerify = async () => {
    if (!text || !targetHash.trim()) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algo, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const computed = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const cleanExpected = targetHash.trim().toLowerCase();
    const cleanComputed = computed.toLowerCase();

    setMatchResult({
      matches: cleanExpected === cleanComputed,
      computedHash: computed
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Hash Algorithm
          </label>
          <select
            value={algo}
            onChange={(e) => { setAlgo(e.target.value); setMatchResult(null); }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-384">SHA-384</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Expected Hash to Verify Against
          </label>
          <input
            type="text"
            value={targetHash}
            onChange={(e) => { setTargetHash(e.target.value); setMatchResult(null); }}
            placeholder="Paste expected hash hex string..."
            className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
          Input String or Payload
        </label>
        <textarea
          rows={4}
          value={text}
          onChange={(e) => { setText(e.target.value); setMatchResult(null); }}
          className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        />
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={!text || !targetHash.trim()}
        className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
      >
        <CheckCheck className="w-4 h-4" />
        <span>Verify Hash Match</span>
      </button>

      {matchResult && (
        <div
          className={`p-6 rounded-2xl border space-y-2 ${
            matchResult.matches
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
              : 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-base">
            {matchResult.matches ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Hash Verified! Identical Match.</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-600" />
                <span>Hash Mismatch! Tampering or difference detected.</span>
              </>
            )}
          </div>
          <div className="text-xs font-mono pt-2">
            <span className="opacity-70 block font-sans">Computed Hash:</span>
            <span className="break-all font-bold">{matchResult.computedHash}</span>
          </div>
        </div>
      )}
    </div>
  );
};
