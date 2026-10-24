import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Scissors, Download, RefreshCw, Volume2, Music } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';
import { audioBufferToWavBlob } from '../../utils/audioWavEncoder';

export const AudioTrimmer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [trimmedBlob, setTrimmedBlob] = useState<Blob | null>(null);
  const [trimmedUrl, setTrimmedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const playbackStartRef = useRef<number>(0);
  const playbackOffsetRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please select a valid audio file (MP3, WAV, OGG, AAC).');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setIsProcessing(true);
    stopPlayback();

    try {
      const buffer = await selectedFile.arrayBuffer();
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const decoded = await ctx.decodeAudioData(buffer);
      setAudioBuffer(decoded);
      setDuration(decoded.duration);
      setStartTime(0);
      setEndTime(Math.min(decoded.duration, 30)); // default 30s or full duration
      setCurrentTime(0);

      drawWaveform(decoded, 0, Math.min(decoded.duration, 30));
    } catch {
      setError('Failed to decode audio. Please try another audio file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const drawWaveform = (buf: AudioBuffer, start: number, end: number, cursor?: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const rawData = buf.getChannelData(0);
    const step = Math.ceil(rawData.length / width);
    const amp = height / 2;

    const startX = (start / buf.duration) * width;
    const endX = (end / buf.duration) * width;

    // Draw background unselected regions
    ctx.fillStyle = 'rgba(100, 116, 139, 0.15)';
    ctx.fillRect(0, 0, startX, height);
    ctx.fillRect(endX, 0, width - endX, height);

    // Draw active selection region highlight
    ctx.fillStyle = 'rgba(20, 184, 166, 0.12)';
    ctx.fillRect(startX, 0, endX - startX, height);

    // Draw waveform bars
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = rawData[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }

      const inSelection = i >= startX && i <= endX;
      ctx.fillStyle = inSelection ? '#0d9488' : '#94a3b8';
      const barHeight = Math.max(2, (max - min) * amp);
      ctx.fillRect(i, (1 + min) * amp, 1.5, barHeight);
    }

    // Draw start and end boundary markers
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(startX - 1, 0, 3, height);
    ctx.fillRect(endX - 1, 0, 3, height);

    // Draw playback cursor if active
    if (cursor !== undefined) {
      const cursorX = (cursor / buf.duration) * width;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(cursorX - 1, 0, 2.5, height);
    }
  };

  const stopPlayback = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      sourceNodeRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsPlaying(false);
  };

  const playTrimmedSelection = () => {
    if (!audioBuffer) return;

    if (isPlaying) {
      stopPlayback();
      return;
    }

    const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    sourceNodeRef.current = source;

    const playDuration = Math.max(0.1, endTime - startTime);
    source.start(0, startTime, playDuration);
    playbackStartRef.current = ctx.currentTime;
    playbackOffsetRef.current = startTime;
    setIsPlaying(true);

    const updateCursor = () => {
      if (!audioContextRef.current) return;
      const elapsed = audioContextRef.current.currentTime - playbackStartRef.current;
      const current = startTime + elapsed;

      if (current >= endTime) {
        setIsPlaying(false);
        setCurrentTime(startTime);
        drawWaveform(audioBuffer, startTime, endTime);
        return;
      }

      setCurrentTime(current);
      drawWaveform(audioBuffer, startTime, endTime, current);
      animFrameRef.current = requestAnimationFrame(updateCursor);
    };

    animFrameRef.current = requestAnimationFrame(updateCursor);

    source.onended = () => {
      setIsPlaying(false);
      setCurrentTime(startTime);
      if (audioBuffer) drawWaveform(audioBuffer, startTime, endTime);
    };
  };

  const exportTrimmedAudio = () => {
    if (!audioBuffer) return;
    setIsProcessing(true);
    try {
      const blob = audioBufferToWavBlob(audioBuffer, startTime, endTime);
      if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
      const url = URL.createObjectURL(blob);
      setTrimmedBlob(blob);
      setTrimmedUrl(url);
    } catch {
      setError('Failed to export trimmed audio.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    stopPlayback();
    if (trimmedUrl) URL.revokeObjectURL(trimmedUrl);
    setFile(null);
    setAudioBuffer(null);
    setTrimmedBlob(null);
    setTrimmedUrl(null);
    setError(null);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m}:${s < 10 ? '0' : ''}${s}.${ms}`;
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="audio/*"
          onFilesSelected={handleFilesSelected}
          label="Select audio file to trim & cut"
          hint="Supports MP3, WAV, OGG, M4A, FLAC. 100% private in-browser trimming."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500">
                  Total Duration: {formatTime(duration)} • Sample Rate: {audioBuffer?.sampleRate} Hz
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Trim Another</span>
            </button>
          </div>

          {/* Interactive Waveform Canvas */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              width={800}
              height={140}
              className="w-full h-28 sm:h-36 block rounded-xl cursor-crosshair"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 px-1">
              <span>0:00.0</span>
              <span className="text-teal-400 font-medium">Selected: {formatTime(Math.max(0, endTime - startTime))}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Start and End Trim Slider Controls */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Start Cut Point</span>
                  <span className="text-teal-600 dark:text-teal-400 font-mono">{formatTime(startTime)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, endTime - 0.2)}
                  step="0.1"
                  value={startTime}
                  onChange={(e) => {
                    const newStart = parseFloat(e.target.value);
                    setStartTime(newStart);
                    if (audioBuffer) drawWaveform(audioBuffer, newStart, endTime);
                  }}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>End Cut Point</span>
                  <span className="text-teal-600 dark:text-teal-400 font-mono">{formatTime(endTime)}</span>
                </div>
                <input
                  type="range"
                  min={Math.min(duration, startTime + 0.2)}
                  max={duration}
                  step="0.1"
                  value={endTime}
                  onChange={(e) => {
                    const newEnd = parseFloat(e.target.value);
                    setEndTime(newEnd);
                    if (audioBuffer) drawWaveform(audioBuffer, startTime, newEnd);
                  }}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Play Selection & Export Buttons */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                onClick={playTrimmedSelection}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Playback' : 'Play Trimmed Selection'}</span>
              </button>

              <button
                type="button"
                onClick={exportTrimmedAudio}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
              >
                <Scissors className="w-4 h-4" />
                <span>Cut & Generate Audio</span>
              </button>
            </div>
          </div>

          {/* Download & Share Area */}
          {trimmedUrl && trimmedBlob && (
            <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                  Audio Trimmed Successfully!
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Length: {formatTime(endTime - startTime)} • Size: {(trimmedBlob.size / 1024).toFixed(1)} KB (High Quality WAV)
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={trimmedUrl}
                  download={`trimmed_${file.name.replace(/\.[^/.]+$/, '')}.wav`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex-1 sm:flex-initial"
                >
                  <Download className="w-4 h-4" />
                  <span>Download WAV</span>
                </a>
                <ShareResultButton
                  toolName="Audio Trimmer"
                  resultSummary={`Trimmed ${file.name} to ${formatTime(endTime - startTime)} duration.`}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
