import React, { useState, useRef, useEffect } from 'react';
import { 
  Video, 
  Download, 
  RefreshCw, 
  Play, 
  Pause, 
  CheckCircle2, 
  Sliders, 
  Zap, 
  Target, 
  ArrowRight,
  ShieldCheck,
  Layers,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  AlertCircle,
  Square
} from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { formatBytes } from '../image/compressionEngine';

export const VideoCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [origDimensions, setOrigDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // Compression presets
  // default to extreme (80-90% reduction) as requested by user
  const [preset, setPreset] = useState<'ultra85' | 'balanced' | 'whatsapp' | 'discord' | 'custom'>('ultra85');
  const [resolutionScale, setResolutionScale] = useState<number>(0.6); // 60% scale by default
  const [targetBitrateKbps, setTargetBitrateKbps] = useState<number>(750); // 750 kbps for 80-90% drop
  const [targetFps, setTargetFps] = useState<number>(24);
  const [muteAudio, setMuteAudio] = useState<boolean>(false);

  // Compression State
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const abortControllerRef = useRef<boolean>(false);

  // Apply preset options
  const handlePresetChange = (newPreset: 'ultra85' | 'balanced' | 'whatsapp' | 'discord' | 'custom') => {
    setPreset(newPreset);
    if (newPreset === 'ultra85') {
      // 80% to 90% size reduction target
      setResolutionScale(0.6);
      setTargetBitrateKbps(650);
      setTargetFps(24);
      setMuteAudio(false);
    } else if (newPreset === 'balanced') {
      // 60% to 75% size reduction target
      setResolutionScale(0.8);
      setTargetBitrateKbps(1500);
      setTargetFps(30);
      setMuteAudio(false);
    } else if (newPreset === 'whatsapp') {
      // Fit under 16 MB WhatsApp limit
      if (duration > 0) {
        const calculatedKbps = Math.max(350, Math.min(1200, Math.floor((14 * 8192) / duration)));
        setTargetBitrateKbps(calculatedKbps);
      } else {
        setTargetBitrateKbps(700);
      }
      setResolutionScale(0.5);
      setTargetFps(24);
    } else if (newPreset === 'discord') {
      // Fit under 8 MB Discord limit
      if (duration > 0) {
        const calculatedKbps = Math.max(250, Math.min(900, Math.floor((7 * 8192) / duration)));
        setTargetBitrateKbps(calculatedKbps);
      } else {
        setTargetBitrateKbps(500);
      }
      setResolutionScale(0.5);
      setTargetFps(24);
    }
  };

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, WebM, MOV, MKV).');
      return;
    }
    setError(null);
    setFile(selected);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setCompressedSize(0);
    setProgress(0);

    const url = URL.createObjectURL(selected);
    setVideoUrl(url);
  };

  const handleMetadataLoaded = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 1;
      const w = videoRef.current.videoWidth || 1280;
      const h = videoRef.current.videoHeight || 720;
      setDuration(dur);
      setOrigDimensions({ width: w, height: h });

      // Automatically recalculate bitrate if whatsapp/discord preset selected
      if (preset === 'whatsapp') {
        const calculatedKbps = Math.max(350, Math.min(1200, Math.floor((14 * 8192) / dur)));
        setTargetBitrateKbps(calculatedKbps);
      } else if (preset === 'discord') {
        const calculatedKbps = Math.max(250, Math.min(900, Math.floor((7 * 8192) / dur)));
        setTargetBitrateKbps(calculatedKbps);
      }
    }
  };

  const stopCompression = () => {
    abortControllerRef.current = true;
    setIsProcessing(false);
  };

  const runCompression = async () => {
    if (!file || !videoRef.current) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setCompressedBlob(null);
    setCompressedUrl(null);
    abortControllerRef.current = false;

    const video = videoRef.current;
    const targetW = Math.max(160, Math.round((origDimensions.width * resolutionScale) / 2) * 2);
    const targetH = Math.max(120, Math.round((origDimensions.height * resolutionScale) / 2) * 2);

    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      setError('Could not initialize video rendering engine.');
      setIsProcessing(false);
      return;
    }

    try {
      // Pick best supported MIME type
      const possibleTypes = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4'
      ];
      let selectedMime = 'video/webm';
      for (const t of possibleTypes) {
        if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(t)) {
          selectedMime = t;
          break;
        }
      }

      // Stream from canvas
      const canvasStream = canvas.captureStream(targetFps);

      // Attempt to attach audio track if not muted
      let combinedStream = new MediaStream();
      canvasStream.getVideoTracks().forEach(track => combinedStream.addTrack(track));

      let audioCtx: AudioContext | null = null;
      if (!muteAudio) {
        try {
          const streamAny = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream ? (video as any).mozCaptureStream() : null;
          if (streamAny && streamAny.getAudioTracks().length > 0) {
            combinedStream.addTrack(streamAny.getAudioTracks()[0]);
          } else {
            // Web Audio fallback
            audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const source = audioCtx.createMediaElementSource(video);
            const dest = audioCtx.createMediaStreamDestination();
            source.connect(dest);
            source.connect(audioCtx.destination);
            dest.stream.getAudioTracks().forEach(t => combinedStream.addTrack(t));
          }
        } catch (e) {
          console.warn('Audio capture bypassed:', e);
        }
      }

      const recorder = new MediaRecorder(combinedStream, {
        mimeType: selectedMime,
        videoBitsPerSecond: targetBitrateKbps * 1000,
        audioBitsPerSecond: 64000
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      const compressionPromise = new Promise<Blob>((resolve, reject) => {
        recorder.onstop = () => {
          const finalBlob = new Blob(chunks, { type: selectedMime });
          resolve(finalBlob);
        };
        recorder.onerror = (err) => reject(err);
      });

      // Start recording
      recorder.start(100);

      // Reset and play video at fast pace (2.0x playback rate for speedy client processing)
      video.currentTime = 0;
      video.muted = true; // Mute during fast processing
      video.playbackRate = 2.0;

      await video.play();

      // Rendering loop
      const renderFrame = () => {
        if (abortControllerRef.current) {
          recorder.stop();
          video.pause();
          setIsProcessing(false);
          return;
        }

        ctx.drawImage(video, 0, 0, targetW, targetH);

        const currentPct = Math.min(99, Math.round((video.currentTime / (video.duration || 1)) * 100));
        setProgress(currentPct);

        if (video.ended || video.currentTime >= video.duration - 0.1) {
          setProgress(100);
          recorder.stop();
          video.pause();
        } else {
          requestAnimationFrame(renderFrame);
        }
      };

      requestAnimationFrame(renderFrame);

      const resultBlob = await compressionPromise;
      if (audioCtx) audioCtx.close();

      setCompressedBlob(resultBlob);
      setCompressedSize(resultBlob.size);
      const resUrl = URL.createObjectURL(resultBlob);
      setCompressedUrl(resUrl);
      setIsProcessing(false);

    } catch (err: any) {
      console.error('Video compression failed:', err);
      setError(err?.message || 'Video compression encountered an unexpected issue.');
      setIsProcessing(false);
    }
  };

  const percentSaved = file && compressedSize > 0 
    ? Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100))
    : 0;

  const targetResolutionText = origDimensions.width > 0 
    ? `${Math.round(origDimensions.width * resolutionScale)}x${Math.round(origDimensions.height * resolutionScale)}` 
    : 'Auto Scale';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-indigo-500/10 border border-teal-500/20 rounded-2xl p-5 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Ultra Compressor • 80% to 90% Size Reduction</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Video Resolution & Bitrate Compressor
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Shrink large MP4, WebM, and MOV videos by 80% to 90% locally in your browser. Zero cloud uploads, 100% private in-memory processing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side
            </span>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {/* Upload Zone */}
      {!file ? (
        <FileUpload
          accept="video/*"
          onFilesSelected={handleFilesSelected}
          label="Click or Drag & Drop Video (MP4, WebM, MOV, MKV)"
          hint="Fast local compression. Video never leaves your device. Perfect for WhatsApp, Discord & Email."
          className="py-12"
        />
      ) : (
        <div className="space-y-6">
          {/* File Info Bar */}
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>Original: <strong>{formatBytes(file.size)}</strong></span>
                  <span>•</span>
                  <span>{origDimensions.width}x{origDimensions.height}</span>
                  <span>•</span>
                  <span>{Math.round(duration)}s</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setFile(null);
                setVideoUrl(null);
                setCompressedBlob(null);
                setCompressedUrl(null);
              }}
              disabled={isProcessing}
              className="text-xs font-bold text-slate-500 hover:text-rose-500 transition-colors"
            >
              Choose Different Video
            </button>
          </div>

          {/* Hidden/Helper Video Element for stream extraction */}
          <video
            ref={videoRef}
            src={videoUrl || undefined}
            onLoadedMetadata={handleMetadataLoaded}
            playsInline
            crossOrigin="anonymous"
            className="hidden"
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Preset Buttons */}
          <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-teal-500" />
                <span>Compression Level & Preset</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400">
                Level: {preset === 'ultra85' ? '80% - 90% Ultra' : preset === 'balanced' ? '60% - 75% Balanced' : preset.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                type="button"
                onClick={() => handlePresetChange('ultra85')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  preset === 'ultra85'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>80% - 90% Ultra</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Maximum drop, email & web ready</p>
              </button>

              <button
                type="button"
                onClick={() => handlePresetChange('whatsapp')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  preset === 'whatsapp'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                  <span>WhatsApp (&lt;16MB)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Instant send without size limits</p>
              </button>

              <button
                type="button"
                onClick={() => handlePresetChange('discord')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  preset === 'discord'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                  <span>Discord (&lt;8MB)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Free Nitro-less attachment size</p>
              </button>

              <button
                type="button"
                onClick={() => handlePresetChange('balanced')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  preset === 'balanced'
                    ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 ring-2 ring-teal-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                  <span>Balanced (60-75%)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Crisp high-definition quality</p>
              </button>
            </div>

            {/* Custom Sliders */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Scale & Resolution: {Math.round(resolutionScale * 100)}% ({targetResolutionText})
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={resolutionScale}
                  onChange={(e) => {
                    setResolutionScale(parseFloat(e.target.value));
                    setPreset('custom');
                  }}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Target Bitrate: {targetBitrateKbps} kbps
                </label>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="50"
                  value={targetBitrateKbps}
                  onChange={(e) => {
                    setTargetBitrateKbps(parseInt(e.target.value, 10));
                    setPreset('custom');
                  }}
                  className="w-full accent-teal-600"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-start sm:gap-4 pt-4 sm:pt-2">
                <button
                  type="button"
                  onClick={() => setMuteAudio(!muteAudio)}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 font-semibold transition-colors ${
                    muteAudio
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/30 text-rose-600'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {muteAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{muteAudio ? 'Audio Muted' : 'Keep Audio'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Button & Live Progress */}
          {!isProcessing && !compressedBlob && (
            <button
              type="button"
              onClick={runCompression}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.01]"
            >
              <Zap className="w-5 h-5 fill-current" />
              <span>Compress Video Now (Target 80% - 90% Reduction)</span>
            </button>
          )}

          {isProcessing && (
            <div className="bg-white dark:bg-[#131C31] border border-teal-500/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-teal-600 dark:text-teal-400">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Compressing Video Locally In-Browser...</span>
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Encoding frames at 2x hardware speed</span>
                <button
                  type="button"
                  onClick={stopCompression}
                  className="text-rose-500 hover:underline font-semibold flex items-center gap-1"
                >
                  <Square className="w-3.5 h-3.5 fill-current" /> Stop
                </button>
              </div>
            </div>
          )}

          {/* Compression Results */}
          {compressedBlob && compressedUrl && (
            <div className="bg-white dark:bg-[#131C31] border border-teal-500/30 rounded-2xl p-5 sm:p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Compression Complete!</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold border border-emerald-500/20">
                  {percentSaved}% Saved
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 text-center">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Original</p>
                  <p className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {formatBytes(file.size)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Compressed</p>
                  <p className="text-sm sm:text-base font-bold text-teal-600 dark:text-teal-400 mt-0.5">
                    {formatBytes(compressedSize)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">Reduction</p>
                  <p className="text-sm sm:text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    -{percentSaved}%
                  </p>
                </div>
              </div>

              {/* Video Player Preview */}
              <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center max-h-[360px]">
                <video
                  src={compressedUrl}
                  controls
                  playsInline
                  className="w-full max-h-[360px] object-contain"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={compressedUrl}
                  download={`compressed-${file.name.substring(0, file.name.lastIndexOf('.')) || 'video'}.webm`}
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Compressed Video ({formatBytes(compressedSize)})</span>
                </a>

                <button
                  type="button"
                  onClick={runCompression}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-compress with other settings
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
