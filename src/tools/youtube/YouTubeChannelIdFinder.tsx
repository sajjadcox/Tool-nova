import React, { useState } from 'react';
import { User, Copy, ExternalLink, RefreshCw, Rss, Bell, Sparkles } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { parseYouTubeUrl, fetchYouTubeOEmbed } from './youtubeUtils';

/**
 * Tool 11: YouTube Channel ID & Handle Finder
 */
export const YouTubeChannelIdFinder: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('https://www.youtube.com/@MrBeast');
  const [channelHandle, setChannelHandle] = useState<string>('@MrBeast');
  const [channelId, setChannelId] = useState<string>('UCX6OQ3DkcsbYNE6H8uQQuVA');
  const [channelTitle, setChannelTitle] = useState<string>('MrBeast');
  const [channelUrl, setChannelUrl] = useState<string>('https://www.youtube.com/@MrBeast');
  const [rssFeedUrl, setRssFeedUrl] = useState<string>('https://www.youtube.com/feeds/videos.xml?channel_id=UCX6OQ3DkcsbYNE6H8uQQuVA');
  const [subConfirmUrl, setSubConfirmUrl] = useState<string>('https://www.youtube.com/@MrBeast?sub_confirmation=1');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLookup = async () => {
    if (!inputUrl.trim()) return;
    setIsLoading(true);

    const parsed = parseYouTubeUrl(inputUrl);

    if (parsed.handle) {
      setChannelHandle(parsed.handle);
      setChannelTitle(parsed.handle.replace('@', ''));
      setChannelUrl(`https://www.youtube.com/${parsed.handle}`);
      setSubConfirmUrl(`https://www.youtube.com/${parsed.handle}?sub_confirmation=1`);
    } else if (parsed.channelId) {
      setChannelId(parsed.channelId);
      setRssFeedUrl(`https://www.youtube.com/feeds/videos.xml?channel_id=${parsed.channelId}`);
      setChannelUrl(`https://www.youtube.com/channel/${parsed.channelId}`);
      setSubConfirmUrl(`https://www.youtube.com/channel/${parsed.channelId}?sub_confirmation=1`);
    }

    // Try fetching via video oEmbed if video URL is passed
    if (parsed.videoId) {
      const meta = await fetchYouTubeOEmbed(inputUrl);
      if (meta) {
        setChannelTitle(meta.author_name);
        if (meta.author_url) {
          setChannelUrl(meta.author_url);
          const handleMatch = meta.author_url.match(/@([a-zA-Z0-9_.-]+)/);
          if (handleMatch) {
            setChannelHandle('@' + handleMatch[1]);
            setSubConfirmUrl(`https://www.youtube.com/@${handleMatch[1]}?sub_confirmation=1`);
          }
          const ucMatch = meta.author_url.match(/channel\/(UC[a-zA-Z0-9_-]{22})/);
          if (ucMatch) {
            setChannelId(ucMatch[1]);
            setRssFeedUrl(`https://www.youtube.com/feeds/videos.xml?channel_id=${ucMatch[1]}`);
          }
        }
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <User className="w-4 h-4 text-red-500" />
          Enter YouTube Channel URL, @Handle, or Video Link
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="e.g. https://www.youtube.com/@creator or UCxxxx..."
            className="flex-1 px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
          />
          <button
            onClick={handleLookup}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Find Channel ID</span>
          </button>
        </div>
      </div>

      {/* Results Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
            Channel Information & Identifiers
          </h4>
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 hover:underline"
          >
            <span>Visit Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* UC Channel ID */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              Unique Channel ID (UCID)
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                {channelId}
              </span>
              <CopyButton textToCopy={channelId} label="Copy" />
            </div>
          </div>

          {/* Channel Handle */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              YouTube Handle
            </span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-bold text-sm text-red-600 dark:text-red-400 truncate">
                {channelHandle}
              </span>
              <CopyButton textToCopy={channelHandle} label="Copy" />
            </div>
          </div>

          {/* RSS Feed URL */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 md:col-span-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Rss className="w-3.5 h-3.5 text-amber-500" />
              <span>Official YouTube XML/RSS Feed URL</span>
            </span>
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={rssFeedUrl}
                className="w-full bg-transparent font-mono text-xs text-slate-700 dark:text-slate-300 outline-none truncate"
              />
              <CopyButton textToCopy={rssFeedUrl} label="Copy RSS" />
            </div>
          </div>

          {/* Direct Subscribe Link with Confirmation */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 md:col-span-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-emerald-500" />
              <span>Auto-Subscribe Link (with 1-Click Confirmation Popup)</span>
            </span>
            <div className="flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={subConfirmUrl}
                className="w-full bg-transparent font-mono text-xs text-slate-700 dark:text-slate-300 outline-none truncate"
              />
              <CopyButton textToCopy={subConfirmUrl} label="Copy Link" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
