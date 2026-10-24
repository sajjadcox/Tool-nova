import React, { useState } from 'react';
import { Briefcase, Calendar, CheckCircle2, RefreshCw } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const WorkingDaysCalculator: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [weekendPattern, setWeekendPattern] = useState<'sat-sun' | 'fri-sat' | 'sun-only'>('sat-sun');
  const [holidaysCount, setHolidaysCount] = useState<number>(0);
  const [dailyHours, setDailyHours] = useState<number>(8);

  const calculateDays = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
      return { totalDays: 0, workingDays: 0, weekendDays: 0, workingHours: 0 };
    }

    let current = new Date(start);
    let totalDays = 0;
    let weekendDays = 0;

    while (current <= end) {
      totalDays++;
      const day = current.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

      let isWeekend = false;
      if (weekendPattern === 'sat-sun') {
        isWeekend = day === 0 || day === 6;
      } else if (weekendPattern === 'fri-sat') {
        isWeekend = day === 5 || day === 6;
      } else if (weekendPattern === 'sun-only') {
        isWeekend = day === 0;
      }

      if (isWeekend) {
        weekendDays++;
      }

      current.setDate(current.getDate() + 1);
    }

    const workingDays = Math.max(0, totalDays - weekendDays - Math.min(holidaysCount, totalDays - weekendDays));
    const workingHours = workingDays * dailyHours;

    return { totalDays, workingDays, weekendDays, workingHours };
  };

  const results = calculateDays();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Working Days Calculator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Compute business days, weekends, and total billable work hours between two dates.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Working Days Calculator"
            resultSummary={`Calculated ${results.workingDays} working days (${results.workingHours} hours) between ${startDate} and ${endDate} with ToolNova!`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Weekend Pattern</label>
            <select
              value={weekendPattern}
              onChange={(e) => setWeekendPattern(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            >
              <option value="sat-sun">Saturday & Sunday (Standard)</option>
              <option value="fri-sat">Friday & Saturday (Middle East/BD)</option>
              <option value="sun-only">Sunday Only (6-day workweek)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Holidays to Exclude</label>
            <input
              type="number"
              min="0"
              value={holidaysCount}
              onFocus={(e) => e.target.select()}
              onChange={(e) => setHolidaysCount(Number(e.target.value) || 0)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-900 bg-teal-50/50 dark:bg-teal-950/30 text-center">
            <p className="text-xs font-bold text-teal-800 dark:text-teal-300 uppercase">Working Days</p>
            <p className="text-3xl font-black text-teal-600 dark:text-teal-400 mt-1 font-mono">{results.workingDays}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Excluding weekends & holidays</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Total Calendar Days</p>
            <p className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-1 font-mono">{results.totalDays}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Full span between dates</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Weekend Days</p>
            <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1 font-mono">{results.weekendDays}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Days off</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase">Working Hours</p>
            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{results.workingHours}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">At 8h/day standard</p>
          </div>
        </div>
      </div>
    </div>
  );
};
