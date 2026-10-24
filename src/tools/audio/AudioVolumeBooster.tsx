import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Download, RefreshCw, Play, Pause, Music, Sliders } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ShareResultButton } from '../../components/common/ShareResultButton';
import { audioBufferToWavBlob } from '../../utils/audioWavEncoder';

export const AudioVolumeBooster: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [gainLevel, setGainLevel] = useState<number>(1.5); // 1.5x = 150%
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [boostedBlob, setBoostedBlob] = useState<Blob | null>(null);
  const [boostedUrl, setBoostedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please select an audio file (MP3, WAV, OGG, M4A).');
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
    } catch {
      setError('Failed to decode audio file.');
    } finally {
      setIsProcessing(false);
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
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    if (!audioBuffer) return;
    if (isPlaying) {
      stopPlayback();
      return;
    }

    const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    if (ctx.state === 'suspended') ctx.resume();

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    const gainNode = ctx.createGain();
    gainNode.gain.value = gainLevel;
    gainNodeRef.current = gainNode;

    source.connect(gainNode);
    gainNode.connect(ctx.destination);
    sourceNodeRef.current = source;

    source.start(0);
    setIsPlaying(true);

    source.onended = () => {
      setIsPlaying(false);
    };
  };

  const handleGainChange = (newGain: number) => {
    setGainLevel(newGain);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newGain;
    }
  };

  const exportBoostedAudio = () => {
    if (!audioBuffer) return;
    setIsProcessing(true);
    try {
      const blob = audioBufferToWavBlob(audioBuffer, 0, audioBuffer.duration, gainLevel);
      if (boostedUrl) URL.revokeObjectURL(boostedUrl);
      const url = URL.createObjectURL(blob);
      setBoostedBlob(blob);
      setBoostedUrl(url);
    } catch {
      setError('Failed to export boosted audio.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    stopPlayback();
    if (boostedUrl) URL.revokeObjectURL(boostedUrl);
    setFile(null);
    setAudioBuffer(null);
    setBoostedBlob(null);
    setBoostedUrl(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="audio/*"
          onFilesSelected={handleFilesSelected}
          label="Select audio file to amplify volume"
          hint="Boost quiet recordings, podcasts, and audio clips up to 300% without quality loss."
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
                  Original Size: {(file.size / (1024 * 1024)).toFixed(2)} MB • Duration: {Math.round(audioBuffer?.duration || 0)}s
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Upload Another</span>
            </button>
          </div>

          {/* Volume Control Card */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Gain Multiplier</span>
              </span>
              <span className="text-lg font-black font-mono text-teal-600 dark:text-teal-400">
                {Math.round(gainLevel * 100)}%
              </span>
            </div>

            <input
              type="range"
              min="0.25"
              max="3.0"
              step="0.05"
              value={gainLevel}
              onChange={(e) => handleGainChange(parseFloat(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />

            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>25% (Softer)</span>
              <span>100% (Original)</span>
              <span>200% (+6dB)</span>
              <span>300% (Max Boost)</span>
            </div>

            <div className="pt-3 flex items-center justify-between flex-wrap gap-3">
              <button
                type="button"
                onClick={togglePlayback}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                  isPlaying
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-teal-600 hover:bg-teal-500 text-white shadow-sm'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isPlaying ? 'Pause Test Audio' : 'Preview Boosted Audio'}</span>
              </button>

              <button
                type="button"
                onClick={exportBoostedAudio}
                disabled={isProcessing}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all disabled:opacity-50"
              >
                <Sliders className="w-4 h-4" />
                <span>Apply & Process Volume</span>
              </button>
            </div>
          </div>

          {/* Download & Share Area */}
          {boostedUrl && boostedBlob && (
            <div className="p-5 rounded-2xl bg-teal-50/80 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                  Volume Boosted to {Math.round(gainLevel * 100)}%!
                </h5>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Ready for instant download in lossless PCM WAV format.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <a
                  href={boostedUrl}
                  download={`boosted_${Math.round(gainLevel * 100)}pct_${file.name.replace(/\.[^/.]+$/, '')}.wav`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex-1 sm:flex-initial"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Boosted WAV</span>
                </a>
                <ShareResultButton
                  toolName="Audio Volume Booster"
                  resultSummary={`Boosted volume of ${file.name} to ${Math.round(gainLevel * 100)}%.`}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
