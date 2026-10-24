import React, { useState } from 'react';
import { Youtube, Download, ExternalLink } from 'lucide-react';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const YouTubeThumbnailTool: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [error, setError] = useState<string | null>(null);

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractVideoId(videoUrl);

  const thumbnails = videoId ? [
    { label: 'Max Resolution (1080p HD)', url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, filename: `yt-thumb-max-${videoId}.jpg` },
    { label: 'High Quality (480p)', url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, filename: `yt-thumb-hq-${videoId}.jpg` },
    { label: 'Medium Quality (360p)', url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`, filename: `yt-thumb-mq-${videoId}.jpg` },
    { label: 'Standard Definition (120p)', url: `https://img.youtube.com/vi/${videoId}/default.jpg`, filename: `yt-thumb-sd-${videoId}.jpg` }
  ] : [];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Enter YouTube Video URL
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {videoId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {thumbnails.map((t, idx) => (
            <div
              key={idx}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-slate-300">{t.label}</span>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Full Size</span>
                </a>
              </div>

              <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 aspect-video flex items-center justify-center border border-slate-200 dark:border-slate-800">
                <img
                  src={t.url}
                  alt={t.label}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if maxres is unavailable
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                  }}
                />
              </div>

              <div className="flex justify-end">
                <a
                  href={t.url}
                  download={t.filename}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save Thumbnail</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
