import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const UnixTimestampConverter: React.FC = () => {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [timestampInput, setTimestampInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [dateInput, setDateInput] = useState<string>(new Date().toISOString().slice(0, 16));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Parse input timestamp
  const parseTimestamp = () => {
    let num = parseInt(timestampInput);
    if (isNaN(num)) return null;
    // If 10 digits -> seconds. If 13 digits -> milliseconds
    if (timestampInput.trim().length <= 10) {
      num = num * 1000;
    }
    const d = new Date(num);
    if (isNaN(d.getTime())) return null;

    return {
      utc: d.toUTCString(),
      iso: d.toISOString(),
      local: d.toLocaleString(),
      relative: getRelativeTimeString(d.getTime())
    };
  };

  const getRelativeTimeString = (timeMs: number) => {
    const diff = Math.floor((timeMs - Date.now()) / 1000);
    if (Math.abs(diff) < 5) return 'just now';
    if (diff > 0) return `in ${Math.floor(diff / 60)} minutes`;
    return `${Math.floor(Math.abs(diff) / 60)} minutes ago`;
  };

  const parsed = parseTimestamp();

  // Convert Date picker to timestamp
  const dateToTimestamp = () => {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return 0;
    return Math.floor(d.getTime() / 1000);
  };

  return (
    <div className="space-y-6">
      {/* Real-time Clock Banner */}
      <div className="p-5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-semibold text-teal-800 dark:text-teal-300 uppercase tracking-wider block">
            Current Unix Epoch Timestamp
          </span>
          <span className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
            {currentEpoch}
          </span>
        </div>
        <CopyButton textToCopy={currentEpoch.toString()} label="Copy Timestamp" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timestamp to Date */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Epoch Timestamp to Human Date</span>
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Seconds or Milliseconds:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={timestampInput}
                onChange={(e) => setTimestampInput(e.target.value)}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <button
                type="button"
                onClick={() => setTimestampInput(Math.floor(Date.now() / 1000).toString())}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 shrink-0"
              >
                Now
              </button>
            </div>
          </div>

          {parsed && (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">GMT / UTC:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{parsed.utc}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Your Local Time:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{parsed.local}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">ISO 8601:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">{parsed.iso}</span>
              </div>
            </div>
          )}
        </div>

        {/* Date to Timestamp */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Date & Time to Epoch Timestamp</span>
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Select Calendar Date & Time:
            </label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Unix Timestamp (Seconds)</span>
                <span className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400">
                  {dateToTimestamp()}
                </span>
              </div>
              <CopyButton textToCopy={dateToTimestamp().toString()} />
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Unix Timestamp (Milliseconds)</span>
                <span className="text-xl font-bold font-mono text-slate-700 dark:text-slate-300">
                  {dateToTimestamp() * 1000}
                </span>
              </div>
              <CopyButton textToCopy={(dateToTimestamp() * 1000).toString()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
