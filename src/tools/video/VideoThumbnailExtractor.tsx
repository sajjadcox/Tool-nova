import React, { useState, useRef } from 'react';
import { Camera, Download, RefreshCw, Film, ChevronLeft, ChevronRight, Sliders } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const VideoThumbnailExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [format, setFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [capturedFrameUrl, setCapturedFrameUrl] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, WebM, MOV, etc.).');
      return;
    }
    setError(null);
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setVideoSrc(url);
    setCapturedFrameUrl(null);
  };

  const captureFrame = (targetFormat = format) => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL(targetFormat, 0.95);
    setCapturedFrameUrl(dataUrl);
    setDimensions({ width: canvas.width, height: canvas.height });
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setDimensions({ width: videoRef.current.videoWidth, height: videoRef.current.videoHeight });
      setTimeout(() => captureFrame(format), 300);
    }
  };

  const handleSeek = (time: number) => {
    const clamped = Math.max(0, Math.min(duration, time));
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
      setCurrentTime(clamped);
      setTimeout(() => captureFrame(format), 100);
    }
  };

  const nudge = (seconds: number) => {
    handleSeek(currentTime + seconds);
  };

  const handleReset = () => {
    if (videoSrc) URL.revokeObjectURL(videoSrc);
    setFile(null);
    setVideoSrc(null);
    setCapturedFrameUrl(null);
  };

  const ext = format === 'image/png' ? 'png' : format === 'image/jpeg' ? 'jpg' : 'webp';

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="video/*"
          onFilesSelected={handleFilesSelected}
          label="Select video file to extract still frames"
          hint="Capture full native resolution still frames from any millisecond of video."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-slate-500 font-medium">
              {file.name} • {dimensions.width}×{dimensions.height}
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Snapshot Another Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Video Player & Controls */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                Video Timeline & Frame Scrubber
              </span>
              <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                {videoSrc && (
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    controls
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              {/* Precise Nudge & Scrub Controls */}
              {duration > 0 && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>{currentTime.toFixed(2)}s</span>
                    <span>Total: {duration.toFixed(2)}s</span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={duration}
                    step="0.05"
                    value={currentTime}
                    onChange={(e) => handleSeek(parseFloat(e.target.value))}
                    className="w-full accent-teal-600"
                  />

                  {/* Frame nudge buttons */}
                  <div className="grid grid-cols-4 gap-1.5 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => nudge(-1)}
                      className="py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      -1.0s
                    </button>
                    <button
                      type="button"
                      onClick={() => nudge(-0.1)}
                      className="py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      -0.1s
                    </button>
                    <button
                      type="button"
                      onClick={() => nudge(0.1)}
                      className="py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      +0.1s
                    </button>
                    <button
                      type="button"
                      onClick={() => nudge(1)}
                      className="py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100"
                    >
                      +1.0s
                    </button>
                  </div>

                  {/* Format selector */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Export Format:</span>
                    <select
                      value={format}
                      onChange={(e) => {
                        const fmt = e.target.value as any;
                        setFormat(fmt);
                        captureFrame(fmt);
                      }}
                      className="text-xs px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      <option value="image/png">Lossless PNG</option>
                      <option value="image/jpeg">JPEG (Quality 95%)</option>
                      <option value="image/webp">WebP (Optimized)</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => captureFrame(format)}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Capture Frame at {currentTime.toFixed(2)}s</span>
                  </button>
                </div>
              )}
            </div>

            {/* Captured Still Preview & Download */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                  Full Resolution Snapshot ({dimensions.width}×{dimensions.height})
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-video flex items-center justify-center overflow-hidden p-2">
                {capturedFrameUrl ? (
                  <img
                    src={capturedFrameUrl}
                    alt="Captured Still"
                    className="max-h-full max-w-full object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <span className="text-xs text-slate-400 italic">No frame captured yet</span>
                )}
              </div>

              {capturedFrameUrl && (
                <div className="pt-2 flex items-center justify-between flex-wrap gap-2">
                  <ShareResultButton
                    toolName="Video Frame Extractor"
                    resultSummary={`Snapshot captured from ${file.name} at ${currentTime.toFixed(2)}s (${dimensions.width}x${dimensions.height}).`}
                  />

                  <DownloadButton
                    filename={`frame_${currentTime.toFixed(2)}s.${ext}`}
                    dataUrl={capturedFrameUrl}
                    label={`Download Frame (${ext.toUpperCase()})`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
