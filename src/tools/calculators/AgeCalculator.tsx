import React, { useState } from 'react';
import { Cake, Calendar } from 'lucide-react';

export const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('2000-01-15');

  const calculateAge = () => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();

    if (isNaN(birth.getTime()) || birth > now) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    // Total metrics
    const totalDays = Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;

    // Next Birthday countdown
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalHours,
      daysUntilNext
    };
  };

  const ageData = calculateAge();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Select Your Date of Birth
        </label>
        <input
          type="date"
          value={birthDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
        />
      </div>

      {ageData && (
        <div className="space-y-6">
          {/* Main Age Banner */}
          <div className="p-8 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
              Your Chronological Age
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-teal-600 dark:text-teal-400 font-mono">
              {ageData.years} Years, {ageData.months} Months, {ageData.days} Days
            </div>
            <p className="text-xs text-slate-500 pt-2">
              Next birthday is in <strong>{ageData.daysUntilNext} days</strong>! 🎂
            </p>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <span className="text-[11px] text-slate-400 block font-medium">Total Days</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                {ageData.totalDays.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <span className="text-[11px] text-slate-400 block font-medium">Total Weeks</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                {ageData.totalWeeks.toLocaleString()}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <span className="text-[11px] text-slate-400 block font-medium">Total Hours</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-slate-100">
                {ageData.totalHours.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
