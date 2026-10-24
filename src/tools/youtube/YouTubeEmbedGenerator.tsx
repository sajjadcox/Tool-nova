import React, { useState } from 'react';
import { Code, Play, Eye, Copy, Sliders, ExternalLink, ShieldCheck } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { parseYouTubeUrl } from './youtubeUtils';

/**
 * Tool 10: YouTube Embed Code Generator
 */
export const YouTubeEmbedGenerator: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [startMinutes, setStartMinutes] = useState<number>(0);
  const [startSeconds, setStartSeconds] = useState<number>(0);
  const [endMinutes, setEndMinutes] = useState<number>(0);
  const [endSeconds, setEndSeconds] = useState<number>(0);

  const [autoplay, setAutoplay] = useState<boolean>(false);
  const [mute, setMute] = useState<boolean>(false);
  const [loop, setLoop] = useState<boolean>(false);
  const [hideControls, setHideControls] = useState<boolean>(false);
  const [privacyEnhanced, setPrivacyEnhanced] = useState<boolean>(true); // youtube-nocookie.com
  const [lazyLoad, setLazyLoad] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9'); // 16:9, 9:16, 4:3, 1:1

  const parsed = parseYouTubeUrl(videoUrl);
  const videoId = parsed.videoId || 'dQw4w9WgXcQ';

  const startTimeTotal = (startMinutes * 60) + startSeconds;
  const endTimeTotal = (endMinutes * 60) + endSeconds;

  // Build query params
  const params = new URLSearchParams();
  if (autoplay) {
    params.set('autoplay', '1');
    // Modern browsers require mute for autoplay
    if (!mute) setMute(true);
  }
  if (mute) params.set('mute', '1');
  if (loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }
  if (hideControls) params.set('controls', '0');
  if (startTimeTotal > 0) params.set('start', startTimeTotal.toString());
  if (endTimeTotal > 0 && endTimeTotal > startTimeTotal) params.set('end', endTimeTotal.toString());

  const domain = privacyEnhanced ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
  const queryString = params.toString() ? `?${params.toString()}` : '';
  const embedUrl = `${domain}/embed/${videoId}${queryString}`;

  // Aspect ratio classes for preview
  const aspectClass =
    aspectRatio === '9:16' ? 'aspect-[9/16] max-w-xs mx-auto' :
    aspectRatio === '4:3' ? 'aspect-[4/3]' :
    aspectRatio === '1:1' ? 'aspect-square max-w-md mx-auto' :
    'aspect-video';

  const iframeHtml = `<iframe
  width="100%"
  height="100%"
  src="${embedUrl}"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen${lazyLoad ? '\n  loading="lazy"' : ''}
></iframe>`;

  const responsiveWrapperHtml = `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 16px;">
  <iframe
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
    src="${embedUrl}"
    title="YouTube video player"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen${lazyLoad ? '\n    loading="lazy"' : ''}
  ></iframe>
</div>`;

  return (
    <div className="space-y-6">
      {/* Video Source input */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Play className="w-4 h-4 text-red-500" />
          Enter YouTube Video URL or Video ID
        </label>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
          className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Settings Column */}
        <div className="lg:col-span-5 space-y-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-red-500" />
            <span>Embed Configuration</span>
          </h4>

          {/* Start Time */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              Start Video At
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <input
                  type="number"
                  min="0"
                  value={startMinutes}
                  onChange={(e) => setStartMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-slate-100 outline-none text-right"
                />
                <span className="text-[11px] text-slate-400">min</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={startSeconds}
                  onChange={(e) => setStartSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 dark:text-slate-100 outline-none text-right"
                />
                <span className="text-[11px] text-slate-400">sec</span>
              </div>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['16:9', '9:16', '4:3', '1:1'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    aspectRatio === ratio
                      ? 'bg-red-50 text-red-600 border-red-500 dark:bg-red-950/40 dark:text-red-400'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Autoplay Video</span>
              <input
                type="checkbox"
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Mute Audio</span>
              <input
                type="checkbox"
                checked={mute}
                onChange={(e) => setMute(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Loop Playback</span>
              <input
                type="checkbox"
                checked={loop}
                onChange={(e) => setLoop(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Hide Controls</span>
              <input
                type="checkbox"
                checked={hideControls}
                onChange={(e) => setHideControls(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer select-none">
              <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-semibold">Privacy-Enhanced Mode (nocookie)</span>
              </div>
              <input
                type="checkbox"
                checked={privacyEnhanced}
                onChange={(e) => setPrivacyEnhanced(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Lazy Loading</span>
              <input
                type="checkbox"
                checked={lazyLoad}
                onChange={(e) => setLazyLoad(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
            </label>
          </div>
        </div>

        {/* Live Preview & Code Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Live Preview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Eye className="w-4 h-4 text-red-500" />
                <span>Live Interactive Player Preview</span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">ID: {videoId}</span>
            </div>

            <div className={`w-full rounded-2xl overflow-hidden bg-black shadow-inner ${aspectClass}`}>
              <iframe
                key={embedUrl}
                src={embedUrl}
                title="Preview"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Embed Code Outputs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Code className="w-4 h-4 text-red-500" />
                <span>Responsive Embed Code</span>
              </h4>
              <CopyButton textToCopy={responsiveWrapperHtml} label="Copy HTML Code" />
            </div>

            <textarea
              readOnly
              rows={6}
              value={responsiveWrapperHtml}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-200 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
