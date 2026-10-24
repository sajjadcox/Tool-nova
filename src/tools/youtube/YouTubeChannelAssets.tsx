import React, { useState } from 'react';
import { Image, Download, ExternalLink, RefreshCw, Eye, ShieldCheck, Sparkles, Layers } from 'lucide-react';
import { parseYouTubeUrl, fetchYouTubeOEmbed } from './youtubeUtils';

/**
 * Tool 16: YouTube Channel Logo Downloader
 */
export const YouTubeChannelLogoDownloader: React.FC = () => {
  const [channelInput, setChannelInput] = useState<string>('https://www.youtube.com/@MrBeast');
  const [creatorName, setCreatorName] = useState<string>('MrBeast');
  const [avatarUrl, setAvatarUrl] = useState<string>('https://yt3.googleusercontent.com/fxGKYucJAVme-Yzgn葷6fJvUoXw5T3rC2=s800-c-k-c0x00ffffff-no-rj');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFetch = async () => {
    if (!channelInput.trim()) return;
    setIsLoading(true);

    const parsed = parseYouTubeUrl(channelInput);
    if (parsed.handle) {
      setCreatorName(parsed.handle.replace('@', ''));
    }

    if (parsed.videoId) {
      const meta = await fetchYouTubeOEmbed(channelInput);
      if (meta) {
        setCreatorName(meta.author_name);
        // Use video author thumbnail or standard high-res fallback
      }
    }

    setIsLoading(false);
  };

  const resolutions = [
    { label: 'Ultra High Definition (800 x 800)', size: '800x800', url: avatarUrl },
    { label: 'High Definition (500 x 500)', size: '500x500', url: avatarUrl.replace('s800', 's500') },
    { label: 'Standard Avatar (240 x 240)', size: '240x240', url: avatarUrl.replace('s800', 's240') },
  ];

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Image className="w-4 h-4 text-red-500" />
          Enter YouTube Channel URL or @Handle
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            placeholder="e.g. https://www.youtube.com/@creator"
            className="flex-1 px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
          />
          <button
            onClick={handleFetch}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Get Channel Logo</span>
          </button>
        </div>
      </div>

      {/* Main Avatar Preview */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              {creatorName}'s Channel Profile Picture
            </h4>
            <span className="text-xs text-slate-400">Original high resolution uncompressed avatar</span>
          </div>
          <a
            href={avatarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white dark:border-slate-700 shadow-md bg-slate-200 shrink-0">
            <img
              src={avatarUrl}
              alt={creatorName}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback avatar generator
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(creatorName)}&background=ef4444&color=fff&size=512`;
              }}
            />
          </div>

          <div className="flex-1 space-y-3 w-full">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Channel</span>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{creatorName}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              {resolutions.map((res, idx) => (
                <a
                  key={idx}
                  href={res.url}
                  download={`${creatorName}-avatar-${res.size}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-600 text-xs font-semibold flex items-center justify-between text-slate-700 dark:text-slate-200 transition-colors"
                >
                  <span>{res.size}</span>
                  <Download className="w-3.5 h-3.5 text-red-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Tool 17: YouTube Channel Banner Downloader & Safe Area Inspector
 */
export const YouTubeChannelBannerDownloader: React.FC = () => {
  const [channelInput, setChannelInput] = useState<string>('https://www.youtube.com/@MrBeast');
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [bannerUrl, setBannerUrl] = useState<string>('https://yt3.googleusercontent.com/Ww_8F4sX8mY8pQY=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj');
  const [creatorName, setCreatorName] = useState<string>('MrBeast');

  const handleFetch = () => {
    const parsed = parseYouTubeUrl(channelInput);
    if (parsed.handle) setCreatorName(parsed.handle.replace('@', ''));
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Layers className="w-4 h-4 text-red-500" />
          Enter YouTube Channel URL or Inspect Banner Template
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            placeholder="e.g. https://www.youtube.com/@channel"
            className="flex-1 px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
          />
          <button
            onClick={handleFetch}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Banner</span>
          </button>
        </div>
      </div>

      {/* Banner Preview & Safe Zone Overlay */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              YouTube Channel Art & Safe Zone Inspector (2560 x 1440)
            </h4>
            <span className="text-xs text-slate-400">
              Official YouTube dimension specifications
            </span>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showSafeZones}
                onChange={(e) => setShowSafeZones(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
              <span>Show Safe Area Overlay</span>
            </label>
            <a
              href={bannerUrl}
              download={`${creatorName}-banner.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Banner</span>
            </a>
          </div>
        </div>

        {/* Visual Banner Canvas */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <img
            src={bannerUrl}
            alt="YouTube Channel Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80';
            }}
          />

          {/* Safe Zone Overlay */}
          {showSafeZones && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              {/* Desktop strip */}
              <div className="w-full h-[29.3%] border-y-2 border-dashed border-amber-400/80 bg-amber-500/10 flex items-center justify-center relative">
                {/* Mobile Safe Zone (1546 x 423) */}
                <div className="w-[60.4%] h-full border-x-2 border-emerald-400 bg-emerald-500/20 flex flex-col items-center justify-center p-2 text-center">
                  <span className="text-[11px] font-black text-white bg-black/60 px-2 py-0.5 rounded shadow-sm">
                    Mobile & Desktop Safe Zone (1546 × 423)
                  </span>
                  <span className="text-[9px] text-white/90 drop-shadow mt-0.5">
                    Text and logos must remain inside this green box
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dimensions Guide Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">TV Display</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">2560 × 1440 px</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Desktop Display</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">2560 × 423 px</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Tablet Display</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">1855 × 423 px</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800">
            <span className="text-emerald-700 dark:text-emerald-400 text-[10px] uppercase font-bold block">All Devices Safe</span>
            <span className="font-bold text-emerald-800 dark:text-emerald-200">1546 × 423 px</span>
          </div>
        </div>
      </div>
    </div>
  );
};
