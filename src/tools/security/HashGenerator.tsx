import React, { useState, useEffect } from 'react';
import { Fingerprint, Copy, RefreshCw } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const HashGenerator: React.FC = () => {
  const [input, setInput] = useState<string>('ToolNova');
  const [hashes, setHashes] = useState<{ [algo: string]: string }>({});

  const computeHashes = async (text: string) => {
    if (!text) {
      setHashes({});
      return;
    }
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const algos = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
    const results: { [algo: string]: string } = {};

    for (const algo of algos) {
      try {
        const hashBuffer = await crypto.subtle.digest(algo, data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        results[algo] = hashHex;
      } catch {
        results[algo] = 'Algorithm not supported in current browser environment.';
      }
    }
    setHashes(results);
  };

  useEffect(() => {
    computeHashes(input);
  }, [input]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Input Text to Hash
        </label>
        <textarea
          rows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to generate cryptographic digests..."
          className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-teal-500"
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Cryptographic Hash Digests (Web Crypto API)
        </h4>

        <div className="space-y-3">
          {Object.entries(hashes).map(([algo, hashVal]) => (
            <div
              key={algo}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                  {algo} ({algo === 'SHA-1' ? '160-bit' : algo === 'SHA-256' ? '256-bit' : algo === 'SHA-384' ? '384-bit' : '512-bit'})
                </span>
                <CopyButton textToCopy={hashVal} />
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                {hashVal}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
