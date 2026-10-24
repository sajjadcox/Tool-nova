import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';

export const StopwatchTool: React.FC = () => {
  const [timeMs, setTimeMs] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<number[]>([]);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      startRef.current = performance.now() - timeMs;
      const update = () => {
        setTimeMs(performance.now() - startRef.current);
        rafRef.current = requestAnimationFrame(update);
      };
      rafRef.current = requestAnimationFrame(update);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isRunning]);

  const toggleRun = () => setIsRunning(!isRunning);

  const reset = () => {
    setIsRunning(false);
    setTimeMs(0);
    setLaps([]);
  };

  const addLap = () => {
    setLaps(prev => [timeMs, ...prev]);
  };

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSec / 60);
    const seconds = totalSec % 60;
    const millis = Math.floor((ms % 1000) / 10);

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(minutes)}:${pad(seconds)}.${pad(millis)}`;
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {/* Big Digital Display */}
      <div className="p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
        <span className="font-mono text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
          {formatTime(timeMs)}
        </span>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={toggleRun}
            className={`px-8 py-3 rounded-2xl font-bold text-sm text-white shadow-md flex items-center gap-2 transition-all active:scale-95 ${
              isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isRunning ? 'Pause' : 'Start'}</span>
          </button>

          <button
            type="button"
            onClick={addLap}
            disabled={!isRunning && timeMs === 0}
            className="px-6 py-3 rounded-2xl font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-2 disabled:opacity-40"
          >
            <Flag className="w-4 h-4" />
            <span>Lap</span>
          </button>

          <button
            type="button"
            onClick={reset}
            disabled={timeMs === 0}
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-500 disabled:opacity-40"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Laps Table */}
      {laps.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Recorded Split Laps ({laps.length})
          </h4>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs font-mono">
            {laps.map((lapMs, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-2.5 bg-white dark:bg-slate-900"
              >
                <span className="text-slate-500 font-sans font-semibold">
                  Lap #{laps.length - idx}
                </span>
                <span className="font-bold text-teal-600 dark:text-teal-400">
                  {formatTime(lapMs)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
