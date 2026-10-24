import React, { useState } from 'react';
import { Calendar, Copy, Check, Clock, RefreshCw } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const DateFormatConverter: React.FC = () => {
  const [inputDate, setInputDate] = useState<string>(() => new Date().toISOString());
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parseDate = (val: string): Date | null => {
    if (!val.trim()) return null;
    // Check if numeric timestamp
    if (/^\d+$/.test(val.trim())) {
      const num = parseInt(val.trim(), 10);
      return new Date(num > 1e11 ? num : num * 1000);
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  };

  const parsed = parseDate(inputDate);

  const getFormats = (d: Date | null) => {
    if (!d) return [];
    return [
      { key: 'iso', label: 'ISO 8601 (UTC)', value: d.toISOString() },
      { key: 'unix_sec', label: 'Unix Timestamp (Seconds)', value: Math.floor(d.getTime() / 1000).toString() },
      { key: 'unix_ms', label: 'Unix Timestamp (Milliseconds)', value: d.getTime().toString() },
      { key: 'rfc2822', label: 'RFC 2822 / Email Header', value: d.toUTCString() },
      { key: 'readable', label: 'Human Readable (Local)', value: d.toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'medium' }) },
      { key: 'us', label: 'US Date (MM/DD/YYYY)', value: `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}` },
      { key: 'eu', label: 'European Date (DD/MM/YYYY)', value: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}` },
      { key: 'sql', label: 'SQL Datetime (YYYY-MM-DD HH:MM:SS)', value: d.toISOString().replace('T', ' ').substring(0, 19) },
    ];
  };

  const formats = getFormats(parsed);

  const handleCopy = async (key: string, val: string) => {
    await navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSetNow = () => {
    setInputDate(new Date().toISOString());
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Date Format Converter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Convert dates, times, and timestamps across all standard global formats.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSetNow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 rounded-xl hover:bg-teal-100 transition-colors"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Current Time</span>
            </button>
            <ShareResultButton
              toolName="Date Format Converter"
              resultSummary={`Converted date ${inputDate} across standard ISO, Unix, RFC & SQL formats with ToolNova!`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">
            Enter Any Date, ISO String, or Unix Timestamp:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              placeholder="e.g. 2026-10-24T12:00:00Z or 1761307200"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
            {inputDate && (
              <button
                type="button"
                onClick={() => setInputDate('')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {!parsed ? (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-amber-800 dark:text-amber-200 text-xs">
            Please enter a valid date or numeric timestamp.
          </div>
        ) : (
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">Converted Formats</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formats.map(f => (
                <div
                  key={f.key}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between"
                >
                  <div className="overflow-hidden mr-2">
                    <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">{f.label}</p>
                    <p className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 mt-1 truncate">
                      {f.value}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(f.key, f.value)}
                    className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors shrink-0"
                    title="Copy"
                  >
                    {copiedKey === f.key ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
