import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell } from 'lucide-react';

export const CountdownTimerTool: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState<number>(300); // 5 min default
  const [remaining, setRemaining] = useState<number>(300);
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && remaining > 0) {
      interval = setInterval(() => {
        setRemaining(prev => prev - 1);
      }, 1000);
    } else if (remaining === 0 && isActive) {
      setIsActive(false);
      playChime();
    }
    return () => clearInterval(interval);
  }, [isActive, remaining]);

  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // ignore
    }
  };

  const setPreset = (secs: number) => {
    setIsActive(false);
    setTotalSeconds(secs);
    setRemaining(secs);
  };

  const toggle = () => setIsActive(!isActive);

  const reset = () => {
    setIsActive(false);
    setRemaining(totalSeconds);
  };

  const formatDisplay = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {/* Presets */}
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-semibold">
        {[
          { label: '1 min', sec: 60 },
          { label: '3 min', sec: 180 },
          { label: '5 min', sec: 300 },
          { label: '10 min', sec: 600 },
          { label: '15 min', sec: 900 },
          { label: '25 min (Pomodoro)', sec: 1500 }
        ].map(p => (
          <button
            key={p.sec}
            type="button"
            onClick={() => setPreset(p.sec)}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              totalSeconds === p.sec
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Countdown Card */}
      <div className="p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-6">
        <span className="font-mono text-6xl sm:text-7xl font-black text-slate-900 dark:text-white tracking-tight">
          {formatDisplay(remaining)}
        </span>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-teal-600 dark:bg-teal-400 h-full transition-all duration-1000 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={toggle}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-md flex items-center gap-2 transition-all active:scale-95 ${
              isActive ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isActive ? 'Pause' : 'Start Timer'}</span>
          </button>

          <button
            type="button"
            onClick={reset}
            className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-500"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
