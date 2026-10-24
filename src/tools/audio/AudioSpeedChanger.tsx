import React, { useState, useRef } from 'react';
import { FastForward, Play, Pause, Download, RefreshCw, Volume2, Music } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';
import { audioBufferToWavBlob } from '../../utils/audioWavEncoder';

export const AudioSpeedChanger: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [speed, setSpeed] = useState<number>(1.25);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.type.startsWith('audio/')) {
      setError('Please upload a valid audio file (MP3, WAV, AAC, OGG).');
      return;
    }
    setError(null);
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setAudioUrl(url);
    setProcessedBlob(null);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
    setProcessedBlob(null);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.playbackRate = speed;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const exportModifiedAudio = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const decoded = await ctx.decodeAudioData(buffer);

      // Render at new speed using OfflineAudioContext
      const offlineCtx = new OfflineAudioContext(
        decoded.numberOfChannels,
        Math.round(decoded.length / speed),
        decoded.sampleRate
      );

      const source = offlineCtx.createBufferSource();
      source.buffer = decoded;
      source.playbackRate.value = speed;
      source.connect(offlineCtx.destination);
      source.start(0);

      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = audioBufferToWavBlob(renderedBuffer);
      setProcessedBlob(wavBlob);
    } catch {
      setError('Failed to render modified speed audio.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setFile(null);
    setAudioUrl(null);
    setProcessedBlob(null);
    setIsPlaying(false);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {!file ? (
        <FileUpload
          accept="audio/*"
          multiple={false}
          
          onFilesSelected={handleFilesSelected}
          hint="Upload any MP3, WAV, or AAC audio file to speed up or slow down playback and export."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
                <FastForward className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{file.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Playback Speed: {speed}x</p>
              </div>
            </div>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Audio</span>
            </button>
          </div>

          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Select Playback Speed:</span>
              <span className="text-sm font-mono font-bold text-teal-600 dark:text-teal-400">{speed}x Speed</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSpeedChange(s)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                    speed === s
                      ? 'border-teal-500 bg-teal-600 text-white shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-teal-400'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold rounded-xl text-xs hover:bg-slate-800 transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause' : `Preview at ${speed}x`}</span>
              </button>

              <button
                type="button"
                onClick={exportModifiedAudio}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-50"
              >
                <FastForward className="w-4 h-4" />
                <span>{isProcessing ? 'Rendering Audio...' : `Export at ${speed}x (WAV)`}</span>
              </button>
            </div>
          </div>

          {processedBlob && (
            <div className="p-4 bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-xs text-teal-800 dark:text-teal-200">Audio Export Ready!</p>
                <p className="text-[11px] text-teal-600 dark:text-teal-400">Processed completely client-side via Web Audio API.</p>
              </div>
              <div className="flex items-center gap-2">
                <DownloadButton
                  filename={`${file.name.replace(/\.[^/.]+$/, '')}_${speed}x.wav`}
                  blob={processedBlob}
                  label="Download Audio"
                  className="bg-teal-600 hover:bg-teal-500 text-white"
                />
                <ShareResultButton
                  toolName="Audio Speed Changer"
                  resultSummary={`Changed audio speed of ${file.name} to ${speed}x with ToolNova!`}
                />
              </div>
            </div>
          )}

          {isProcessing && <ProgressIndicator progress={75} statusText="Rendering audio buffers at modified speed..." />}
        </div>
      )}
    </div>
  );
};
