import React, { useState, useEffect } from 'react';
import { Timer, Calendar, Sparkles, RefreshCw } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const CountdownCalculator: React.FC = () => {
  const [eventName, setEventName] = useState<string>('My Big Event');
  const [targetDate, setTargetDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [targetTime, setTargetTime] = useState<string>('00:00');
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isPast: false });

  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(`${targetDate}T${targetTime}:00`).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0, isPast: true });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds, totalSeconds, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate, targetTime]);

  const setPreset = (name: string, date: string) => {
    setEventName(name);
    setTargetDate(date);
    setTargetTime('00:00');
  };

  const getNextNewYear = () => {
    const year = new Date().getFullYear() + 1;
    return `${year}-01-01`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Countdown Calculator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time live countdown timer to any upcoming event or deadline.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Countdown Calculator"
            resultSummary={`Counting down to ${eventName}: ${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s remaining with ToolNova!`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Project Launch"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Target Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Target Time</label>
            <input
              type="time"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Quick Presets:</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPreset('New Year Celebration', getNextNewYear())}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-teal-500 text-slate-700 dark:text-slate-300 transition-colors"
            >
              🎉 New Year
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 7);
                setPreset('1 Week From Now', d.toISOString().split('T')[0]);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-teal-500 text-slate-700 dark:text-slate-300 transition-colors"
            >
              ⏳ In 7 Days
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 30);
                setPreset('Next Month', d.toISOString().split('T')[0]);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-teal-500 text-slate-700 dark:text-slate-300 transition-colors"
            >
              📅 In 30 Days
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 100);
                setPreset('100 Day Milestone', d.toISOString().split('T')[0]);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-teal-500 text-slate-700 dark:text-slate-300 transition-colors"
            >
              🚀 100 Days Goal
            </button>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-gradient-to-br from-teal-500/10 via-slate-50 to-emerald-500/10 dark:from-teal-950/40 dark:via-slate-900 dark:to-emerald-950/40 border border-teal-200/50 dark:border-teal-900/50 text-center space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{eventName}</h2>

          {timeLeft.isPast ? (
            <div className="py-6">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">The event has arrived! 🎉</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <span className="block text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 font-mono">
                  {timeLeft.days}
                </span>
                <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mt-1 block">Days</span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <span className="block text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 font-mono">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mt-1 block">Hours</span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <span className="block text-3xl sm:text-4xl font-black text-teal-600 dark:text-teal-400 font-mono">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mt-1 block">Minutes</span>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <span className="block text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 mt-1 block">Seconds</span>
              </div>
            </div>
          )}

          {!timeLeft.isPast && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total remaining: <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.floor(timeLeft.totalSeconds / 3600).toLocaleString()} hours</span> &middot; <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.floor(timeLeft.totalSeconds / 60).toLocaleString()} minutes</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
