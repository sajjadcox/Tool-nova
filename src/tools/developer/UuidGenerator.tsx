import React, { useState } from 'react';
import { Key, RefreshCw, Copy, Check } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const UuidGenerator: React.FC = () => {
  const [count, setCount] = useState<number>(5);
  const [useHyphens, setUseHyphens] = useState<boolean>(true);
  const [uppercase, setUppercase] = useState<boolean>(false);

  const generateUuidV4 = () => {
    // Native crypto randomUUID
    let id: string = crypto.randomUUID();
    if (!useHyphens) id = id.replace(/-/g, '');
    if (uppercase) id = id.toUpperCase();
    return id;
  };

  const generateList = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(generateUuidV4());
    }
    return list;
  };

  const [uuids, setUuids] = useState<string[]>(() => generateList());

  const handleRegenerate = () => {
    setUuids(generateList());
  };

  const allUuidsText = uuids.join('\n');

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Quantity to Generate ({count})
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useHyphens}
                onChange={(e) => setUseHyphens(e.target.checked)}
                className="rounded text-teal-600"
              />
              <span>Include Hyphens</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={uppercase}
                onChange={(e) => setUppercase(e.target.checked)}
                className="rounded text-teal-600"
              />
              <span>Uppercase</span>
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleRegenerate}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Generate New UUIDs</span>
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Generated UUID v4 Identifiers ({uuids.length})
          </span>
          <CopyButton textToCopy={allUuidsText} label="Copy All UUIDs" />
        </div>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {uuids.map((id, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 group"
            >
              <span className="truncate pr-4 font-semibold">{id}</span>
              <CopyButton textToCopy={id} label="Copy" className="shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
