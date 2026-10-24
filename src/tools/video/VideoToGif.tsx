import React, { useState, useRef } from 'react';
import JSZip from 'jszip';
import { Video, Download, RefreshCw, Play, Pause, CheckCircle2, Film } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const VideoToGif: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [clipLength, setClipLength] = useState<number>(3);
  const [fps, setFps] = useState<number>(10);
  const [frames, setFrames] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [previewFrameIndex, setPreviewFrameIndex] = useState<number>(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }
    setError(null);
    setFile(selected);
    const url = URL.createObjectURL(selected);
    setVideoUrl(url);
    setFrames([]);
    setZipBlob(null);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration;
      setDuration(dur);
      setStartTime(0);
      setClipLength(Math.min(3, dur));
    }
  };

  const handleGenerateFrames = async () => {
    if (!videoRef.current || !videoUrl) return;
    setIsProcessing(true);
    setError(null);
    setFrames([]);

    const vid = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = 480;
    const height = Math.round((vid.videoHeight / vid.videoWidth) * width) || 270;
    canvas.width = width;
    canvas.height = height;

    const totalFrames = Math.min(60, Math.round(clipLength * fps));
    const step = clipLength / totalFrames;
    const extracted: string[] = [];
    const zip = new JSZip();

    try {
      for (let i = 0; i < totalFrames; i++) {
        const targetTime = startTime + i * step;
        vid.currentTime = targetTime;

        await new Promise<void>((resolve) => {
          const onSeeked = () => {
            vid.removeEventListener('seeked', onSeeked);
            resolve();
          };
          vid.addEventListener('seeked', onSeeked);
        });

        if (ctx) {
          ctx.drawImage(vid, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/png');
          extracted.push(dataUrl);

          // Add to zip
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          zip.file(`frame_${String(i + 1).padStart(3, '0')}.png`, base64Data, { base64: true });
        }
      }

      setFrames(extracted);
      const generatedZip = await zip.generateAsync({ type: 'blob' });
      setZipBlob(generatedZip);
      setIsPlayingPreview(true);
    } catch {
      setError('Failed to extract video frames. Try a shorter duration.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Preview animation loop
  React.useEffect(() => {
    if (!isPlayingPreview || frames.length === 0) return;
    const interval = setInterval(() => {
      setPreviewFrameIndex(prev => (prev + 1) % frames.length);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [isPlayingPreview, frames, fps]);

  const resetAll = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setVideoUrl(null);
    setFrames([]);
    setZipBlob(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {!file ? (
        <FileUpload
          accept="video/*"
          multiple={false}
          
          onFilesSelected={handleFilesSelected}
          hint="Select any MP4, WebM, or MOV video clip to extract animated frames and GIFs."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{file.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Duration: {duration.toFixed(1)}s</p>
              </div>
            </div>
            <button
              onClick={resetAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <video
                ref={videoRef}
                src={videoUrl || undefined}
                controls
                onLoadedMetadata={handleLoadedMetadata}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-black aspect-video object-contain"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Start (sec)</label>
                  <input
                    type="number"
                    min="0"
                    max={Math.max(0, duration - 1)}
                    step="0.5"
                    value={startTime}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setStartTime(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Length (sec)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    step="0.5"
                    value={clipLength}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setClipLength(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1">Frame Rate (FPS)</label>
                  <select
                    value={fps}
                    onChange={(e) => setFps(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                  >
                    <option value={10}>10 FPS (Light)</option>
                    <option value={15}>15 FPS (Smooth)</option>
                  </select>
                </div>
              </div>

              {!frames.length ? (
                <button
                  type="button"
                  onClick={handleGenerateFrames}
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  <Film className="w-4 h-4" />
                  <span>{isProcessing ? 'Capturing Frames...' : 'Extract Animated Sequence'}</span>
                </button>
              ) : null}
            </div>

            <div>
              {frames.length > 0 ? (
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black flex items-center justify-center relative">
                    <img
                      src={frames[previewFrameIndex]}
                      alt="Animated Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                      Frame {previewFrameIndex + 1} / {frames.length}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {zipBlob && (
                      <DownloadButton
                        filename={`${file.name.replace(/\.[^/.]+$/, '')}_frames.zip`}
                        blob={zipBlob}
                        label="Download Frames (ZIP)"
                        className="bg-teal-600 hover:bg-teal-500 text-white"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    >
                      {isPlayingPreview ? 'Pause Animation' : 'Play Animation'}
                    </button>
                    <ShareResultButton
                      toolName="Video to GIF"
                      resultSummary={`Extracted ${frames.length} frames from ${file.name} with ToolNova!`}
                    />
                  </div>
                </div>
              ) : (
                <div className="h-64 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <Film className="w-10 h-10 mb-2 stroke-1" />
                  <p className="text-xs">Adjust your clip range and click "Extract Animated Sequence" to generate frame animation.</p>
                </div>
              )}
            </div>
          </div>

          {isProcessing && <ProgressIndicator progress={60} statusText="Seeking video timecodes and encoding canvas frames..." />}
        </div>
      )}
    </div>
  );
};
