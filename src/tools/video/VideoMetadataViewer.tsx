import React, { useState, useRef } from 'react';
import { Film, Info, RefreshCw, Clock, Monitor, FileText, Share2 } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const VideoMetadataViewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{
    width: number;
    height: number;
    duration: number;
    aspectRatio: string;
    fileSize: string;
    mimeType: string;
    estimatedBitrate: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.type.startsWith('video/')) {
      setError('Please select a valid video file (MP4, WebM, MOV, MKV).');
      return;
    }
    setError(null);
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setVideoUrl(url);
  };

  const calculateGcd = (a: number, b: number): number => {
    return b === 0 ? a : calculateGcd(b, a % b);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || !file) return;

    const w = video.videoWidth;
    const h = video.videoHeight;
    const dur = video.duration;

    const gcd = calculateGcd(w, h);
    const aspect = `${w / gcd}:${h / gcd}`;

    // Estimated bitrate: (file size in bits) / duration in seconds
    let bitrateStr = 'N/A';
    if (dur > 0) {
      const bits = file.size * 8;
      const bps = bits / dur;
      if (bps > 1000000) {
        bitrateStr = (bps / 1000000).toFixed(2) + ' Mbps';
      } else {
        bitrateStr = (bps / 1000).toFixed(0) + ' kbps';
      }
    }

    setMetadata({
      width: w,
      height: h,
      duration: dur,
      aspectRatio: aspect === '16:9' || aspect === '4:3' || aspect === '1:1' || aspect === '9:16' ? aspect : `${aspect} (${(w / h).toFixed(2)}:1)`,
      fileSize: formatFileSize(file.size),
      mimeType: file.type || 'video/mp4',
      estimatedBitrate: bitrateStr
    });
  };

  const handleReset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null);
    setVideoUrl(null);
    setMetadata(null);
    setError(null);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 100);
    return `${m}m ${s}s (${secs.toFixed(2)}s)`;
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept="video/*"
          onFilesSelected={handleFilesSelected}
          label="Select video to inspect technical metadata"
          hint="Inspect resolution, aspect ratio, frame dimensions, codecs, and bitrate instantly."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {metadata ? `${metadata.width}x${metadata.height} • ${metadata.fileSize}` : 'Reading video streams...'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Inspect Another Video</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Video Preview */}
            <div className="p-4 rounded-2xl bg-black border border-slate-800 flex flex-col items-center justify-center">
              <video
                ref={videoRef}
                src={videoUrl || undefined}
                controls
                onLoadedMetadata={handleLoadedMetadata}
                className="max-h-72 w-full object-contain rounded-xl"
              />
            </div>

            {/* Metadata Table Cards */}
            {metadata && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Technical Properties
                    </span>
                    <ShareResultButton
                      toolName="Video Metadata Inspector"
                      resultSummary={`${file.name}: ${metadata.width}x${metadata.height} (${metadata.aspectRatio}), duration: ${formatDuration(metadata.duration)}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Resolution</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {metadata.width} × {metadata.height}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Aspect Ratio</span>
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400 text-sm">
                        {metadata.aspectRatio}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Exact Duration</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {formatDuration(metadata.duration)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Est. Bitrate</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                        {metadata.estimatedBitrate}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">File Size</span>
                      <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                        {metadata.fileSize}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Container MIME</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 text-xs truncate block">
                        {metadata.mimeType}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
