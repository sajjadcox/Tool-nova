import React, { useState, useRef } from 'react';
import { Volume2, Play, Pause, RefreshCw } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';

export const AudioWaveformViewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [sampleRate, setSampleRate] = useState<number>(0);
  const [channels, setChannels] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('audio/')) {
      setError('Please select an audio file (MP3, WAV, OGG).');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setIsProcessing(true);

    const url = URL.createObjectURL(selectedFile);
    setAudioUrl(url);

    try {
      const buffer = await selectedFile.arrayBuffer();
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const decodedData = await audioCtx.decodeAudioData(buffer);

      setDuration(decodedData.duration);
      setSampleRate(decodedData.sampleRate);
      setChannels(decodedData.numberOfChannels);

      drawWaveform(decodedData);
    } catch {
      setError('Failed to decode audio waveform.');
    } finally {
      setIsProcessing(false);
    }
  };

  const drawWaveform = (audioBuffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const rawData = audioBuffer.getChannelData(0); // Left channel
    const step = Math.ceil(rawData.length / width);
    const amp = height / 2;

    ctx.fillStyle = '#16A085';

    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const datum = rawData[i * step + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setFile(null);
    setAudioUrl(null);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="audio/*"
          onFilesSelected={handleFilesSelected}
          label="Select an audio track to render sound wave peaks"
          hint="Decoded using Web Audio API AudioContext."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Another Audio File</span>
            </button>
          </div>

          {isProcessing && <ProgressIndicator statusText="Analyzing audio frequency peaks..." />}

          {/* Waveform Canvas */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={180}
              className="w-full h-44 rounded-xl"
            />

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold flex items-center gap-1.5"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  <span>{isPlaying ? 'Pause' : 'Play Track'}</span>
                </button>
                <span>Duration: {duration.toFixed(1)}s</span>
              </div>

              <span>{sampleRate} Hz • {channels === 1 ? 'Mono' : 'Stereo'}</span>
            </div>

            {audioUrl && (
              <audio
                ref={audioRef}
                src={audioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
