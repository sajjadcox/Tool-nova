import React, { useState } from 'react';
import { Calendar, CalendarDays } from 'lucide-react';

export const DateDifferenceCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-12-31');

  const calculateDiff = () => {
    const s = new Date(startDate);
    const e = new Date(endDate);

    if (isNaN(s.getTime()) || isNaN(e.getTime())) return null;

    const diffMs = Math.abs(e.getTime() - s.getTime());
    const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remainderDays = totalDays % 7;

    // Working days (excluding Saturdays and Sundays)
    let workingDays = 0;
    const cur = new Date(Math.min(s.getTime(), e.getTime()));
    const target = new Date(Math.max(s.getTime(), e.getTime()));

    while (cur < target) {
      cur.setDate(cur.getDate() + 1);
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        workingDays++;
      }
    }

    return {
      totalDays,
      weeks,
      remainderDays,
      workingDays,
      hours: totalDays * 24
    };
  };

  const diff = calculateDiff();

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
          />
        </div>
      </div>

      {diff && (
        <div className="space-y-4">
          <div className="p-8 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Total Elapsed Time
            </span>
            <div className="text-4xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
              {diff.totalDays} Days
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Equivalent to {diff.weeks} weeks and {diff.remainderDays} days
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <span className="text-[11px] text-slate-400 block font-medium">Business / Working Days</span>
              <span className="text-xl font-bold font-mono text-teal-600 dark:text-teal-400">
                {diff.workingDays} Days
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <span className="text-[11px] text-slate-400 block font-medium">Total Hours</span>
              <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200">
                {diff.hours.toLocaleString()} Hours
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
