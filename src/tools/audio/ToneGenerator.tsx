import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Activity, Download } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const ToneGenerator: React.FC = () => {
  const [frequency, setFrequency] = useState<number>(440);
  const [waveType, setWaveType] = useState<OscillatorType>('sine');
  const [volume, setVolume] = useState<number>(0.2);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const presets = [
    { name: 'Concert Pitch A4', freq: 440 },
    { name: 'Solfeggio Love', freq: 528 },
    { name: 'Verdi Tuning A', freq: 432 },
    { name: 'Standard 1kHz', freq: 1000 },
    { name: 'Deep Bass Sub', freq: 60 },
    { name: 'High Frequency', freq: 4000 },
  ];

  const stopTone = () => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {
        // ignore
      }
      oscRef.current = null;
    }
    setIsPlaying(false);
  };

  const startTone = () => {
    const ctx = audioCtxRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
    audioCtxRef.current = ctx;
    if (ctx.state === 'suspended') ctx.resume();

    stopTone();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveType;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    oscRef.current = osc;
    gainRef.current = gain;
    setIsPlaying(true);
  };

  const toggleTone = () => {
    if (isPlaying) {
      stopTone();
    } else {
      startTone();
    }
  };

  const handleFrequencyChange = (newFreq: number) => {
    setFrequency(newFreq);
    if (oscRef.current && audioCtxRef.current) {
      oscRef.current.frequency.setValueAtTime(newFreq, audioCtxRef.current.currentTime);
    }
  };

  const handleWaveTypeChange = (type: OscillatorType) => {
    setWaveType(type);
    if (isPlaying) {
      stopTone();
      setTimeout(() => startTone(), 50);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(newVol, audioCtxRef.current.currentTime);
    }
  };

  // Generate 5s WAV file of the current tone for download
  const generateToneWav = () => {
    const sampleRate = 44100;
    const duration = 5; // 5 seconds
    const numSamples = sampleRate * duration;
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);

    let offset = 44;
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      let sample = 0;

      if (waveType === 'sine') {
        sample = Math.sin(2 * Math.PI * frequency * t);
      } else if (waveType === 'square') {
        sample = Math.sin(2 * Math.PI * frequency * t) >= 0 ? 1 : -1;
      } else if (waveType === 'sawtooth') {
        sample = 2 * ((frequency * t) % 1) - 1;
      } else if (waveType === 'triangle') {
        sample = 2 * Math.abs(2 * ((frequency * t) % 1) - 1) - 1;
      }

      sample = sample * volume * 0.9;
      const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
      view.setInt16(offset, intSample, true);
      offset += 2;
    }

    const blob = new Blob([buffer], { type: 'audio/wav' });
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    const url = URL.createObjectURL(blob);
    setRecordedBlob(blob);
    setRecordedUrl(url);
  };

  useEffect(() => {
    return () => {
      stopTone();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Visual Frequency & Tone Card */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-white relative overflow-hidden">
        <div className="text-xs uppercase font-mono tracking-widest text-teal-400 mb-2 flex items-center justify-center gap-2">
          <Activity className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-emerald-400' : ''}`} />
          <span>{waveType.toUpperCase()} WAVE OSCILLATOR</span>
        </div>

        <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white mb-2">
          {frequency} <span className="text-2xl text-teal-400 font-sans font-semibold">Hz</span>
        </div>

        <p className="text-xs text-slate-400 max-w-sm mx-auto mb-6">
          Human hearing range: 20 Hz to 20,000 Hz. Adjust frequency slider below.
        </p>

        <button
          type="button"
          onClick={toggleTone}
          className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg ${
            isPlaying
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-4 ring-rose-600/20'
              : 'bg-teal-500 hover:bg-teal-400 text-slate-900 shadow-teal-500/20'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          <span>{isPlaying ? 'Stop Tone' : 'Play Sound Now'}</span>
        </button>
      </div>

      {/* Waveform Type Selector */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Waveform Shape
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['sine', 'square', 'sawtooth', 'triangle'] as OscillatorType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleWaveTypeChange(type)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                waveType === type
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {type} Wave
            </button>
          ))}
        </div>
      </div>

      {/* Slider Controls */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-6">
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span>Frequency Slider</span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="20"
                max="20000"
                value={frequency}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleFrequencyChange(Math.max(20, Math.min(20000, parseInt(e.target.value) || 20)))}
                className="w-20 px-2 py-0.5 text-xs text-right font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
              />
              <span className="font-mono text-teal-600 dark:text-teal-400">Hz</span>
            </div>
          </div>
          <input
            type="range"
            min="20"
            max="4000"
            step="1"
            value={frequency}
            onChange={(e) => handleFrequencyChange(parseInt(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-slate-500" />
              Volume
            </span>
            <span className="font-mono text-teal-600 dark:text-teal-400">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.01"
            max="1.0"
            step="0.01"
            value={volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>

        {/* Quick Presets */}
        <div>
          <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Standard Tuning & Test Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.freq}
                type="button"
                onClick={() => handleFrequencyChange(p.freq)}
                className="px-3 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                {p.name} ({p.freq}Hz)
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
          <button
            type="button"
            onClick={generateToneWav}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export 5-Second WAV Sample</span>
          </button>
        </div>
      </div>

      {recordedUrl && (
        <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/80 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h5 className="font-bold text-slate-900 dark:text-white text-sm">
              Generated {frequency}Hz {waveType} Wave Sample!
            </h5>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Clean 5-second PCM audio sample ready for audio testing and calibration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={recordedUrl}
              download={`tone_${frequency}Hz_${waveType}.wav`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download WAV</span>
            </a>
            <ShareResultButton
              toolName="Tone Generator"
              resultSummary={`Generated ${frequency}Hz ${waveType} wave tone.`}
            />
          </div>
        </div>
      )}
    </div>
  );
};
