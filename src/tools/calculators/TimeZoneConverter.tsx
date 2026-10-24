import React, { useState } from 'react';
import { Globe, Clock, Copy, Check, RefreshCw } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

interface CityTimezone {
  name: string;
  zone: string;
  country: string;
}

const MAJOR_CITIES: CityTimezone[] = [
  { name: 'UTC (Coordinated Universal Time)', zone: 'UTC', country: 'Global' },
  { name: 'Dhaka', zone: 'Asia/Dhaka', country: 'Bangladesh' },
  { name: 'New York (EDT/EST)', zone: 'America/New_York', country: 'USA' },
  { name: 'London (BST/GMT)', zone: 'Europe/London', country: 'UK' },
  { name: 'Dubai', zone: 'Asia/Dubai', country: 'UAE' },
  { name: 'Tokyo', zone: 'Asia/Tokyo', country: 'Japan' },
  { name: 'Singapore', zone: 'Asia/Singapore', country: 'Singapore' },
  { name: 'Los Angeles (PDT/PST)', zone: 'America/Los_Angeles', country: 'USA' },
  { name: 'Sydney (AEST)', zone: 'Australia/Sydney', country: 'Australia' },
  { name: 'Berlin / Paris (CEST)', zone: 'Europe/Berlin', country: 'Germany' },
  { name: 'New Delhi (IST)', zone: 'Asia/Kolkata', country: 'India' },
];

export const TimeZoneConverter: React.FC = () => {
  const [baseDate, setBaseDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [baseTime, setBaseTime] = useState<string>(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [baseZone, setBaseZone] = useState<string>('Asia/Dhaka');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const getConvertedTime = (targetZone: string) => {
    try {
      const dateTimeStr = `${baseDate}T${baseTime}:00`;
      // Create a date object interpreting dateTimeStr in baseZone
      // Using Intl.DateTimeFormat
      const localDate = new Date(dateTimeStr);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: targetZone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return formatter.format(localDate);
    } catch {
      return 'Invalid time';
    }
  };

  const isWorkingHours = (targetZone: string) => {
    try {
      const dateTimeStr = `${baseDate}T${baseTime}:00`;
      const localDate = new Date(dateTimeStr);
      const hourStr = new Intl.DateTimeFormat('en-US', {
        timeZone: targetZone,
        hour: 'numeric',
        hour12: false,
      }).format(localDate);
      const hour = parseInt(hourStr, 10);
      return hour >= 9 && hour < 18;
    } catch {
      return false;
    }
  };

  const handleCopyTime = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSetNow = () => {
    const d = new Date();
    setBaseDate(d.toISOString().split('T')[0]);
    setBaseTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">World Time Zone Converter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Convert dates and times across global cities with work-hour detection.</p>
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
              toolName="Time Zone Converter"
              resultSummary={`Converting ${baseDate} ${baseTime} (${baseZone}) across global time zones on ToolNova!`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Date</label>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Time</label>
            <input
              type="time"
              value={baseTime}
              onChange={(e) => setBaseTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Base Timezone</label>
            <select
              value={baseZone}
              onChange={(e) => setBaseZone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            >
              {MAJOR_CITIES.map(c => (
                <option key={c.zone} value={c.zone}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">Converted Global Times</h4>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                <span className="text-slate-600 dark:text-slate-400">Working Hours (9AM - 6PM)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MAJOR_CITIES.map((city, idx) => {
              const formattedTime = getConvertedTime(city.zone);
              const inWorkHours = isWorkingHours(city.zone);
              return (
                <div
                  key={city.zone}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    inWorkHours
                      ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-800/60'
                      : 'border-slate-200 bg-slate-50/60 dark:bg-slate-900/40 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{city.name}</p>
                      {inWorkHours && (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                          Working
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 mt-1">
                      {formattedTime}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyTime(`${city.name}: ${formattedTime}`, idx)}
                    className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    title="Copy Time"
                  >
                    {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
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
