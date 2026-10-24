import React, { useState } from 'react';
import { 
  User, 
  Search, 
  Download, 
  Copy, 
  Check, 
  ExternalLink, 
  Image as ImageIcon, 
  BarChart3, 
  Rss, 
  Youtube,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { parseYouTubeUrl } from './youtubeUtils';

export type ChannelTab = 'id' | 'logo' | 'banner' | 'stats';

interface YouTubeChannelToolsProps {
  initialTab?: ChannelTab;
}

export const YouTubeChannelTools: React.FC<YouTubeChannelToolsProps> = ({ initialTab = 'id' }) => {
  const [activeTab, setActiveTab] = useState<ChannelTab>(initialTab);
  const [channelInput, setChannelInput] = useState<string>('@MrBeast');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Simulated parsed channel information
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const parsed = parseYouTubeUrl(channelInput);
  const cleanHandle = channelInput.replace(/^https?:\/\/(www\.)?youtube\.com\//, '').replace(/^@/, '');
  const displayHandle = '@' + cleanHandle;
  const channelId = 'UCX6OQ3DkcsbYNE6H8uQQuVA'; // sample / derived UCID

  const tabs: { id: ChannelTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'id', label: 'Channel ID & RSS', icon: User },
    { id: 'logo', label: 'HD Logo Downloader', icon: ImageIcon },
    { id: 'banner', label: 'HD Banner Downloader', icon: Download },
    { id: 'stats', label: 'Channel Audit & Stats', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube Channel Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            YouTube Channel Tools & Asset Downloader
          </h1>
          <p className="text-red-100 text-xs sm:text-sm max-w-2xl">
            Find YouTube Channel IDs, download high-resolution channel logos and banners, retrieve RSS feeds, and audit milestones.
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
          YouTube Channel Handle or URL
        </label>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            value={channelInput}
            onChange={(e) => setChannelInput(e.target.value)}
            placeholder="e.g. @MrBeast, @mkbhd, or https://youtube.com/@channel"
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'id' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Channel Identification & RSS Feeds</h3>
            <p className="text-xs text-slate-500">Universal Unique Channel ID (UCID) used by APIs and RSS readers.</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Channel Handle</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{displayHandle}</p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(displayHandle, 'h')}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                {copiedKey === 'h' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Channel UCID</p>
                <code className="text-xs font-mono font-bold text-red-600 dark:text-red-400 mt-0.5 block">{channelId}</code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(channelId, 'id')}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                {copiedKey === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="text-[11px] font-semibold text-slate-500">Direct RSS Feed URL</p>
                <code className="text-xs font-mono text-slate-600 dark:text-slate-400 mt-0.5 block truncate max-w-md">
                  https://www.youtube.com/feeds/videos.xml?channel_id={channelId}
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, 'rss')}
                className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold"
              >
                {copiedKey === 'rss' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'logo' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Channel Profile Picture (HD Logo)</h3>
            <p className="text-xs text-slate-500">Download high resolution 800×800 channel avatar.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-md bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center text-white text-3xl font-black">
              {cleanHandle.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-base font-bold text-slate-900 dark:text-white">{displayHandle}</p>
              <p className="text-xs text-slate-500">Original Avatar Dimensions: 800 × 800 px (PNG/JPG)</p>
              <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                <a
                  href={`https://www.youtube.com/${displayHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>View Original Logo</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'banner' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Channel Art Banner (2560 × 1440 HD)</h3>
            <p className="text-xs text-slate-500">Full TV banner with desktop, tablet, and mobile safe-area overlays.</p>
          </div>

          <div className="aspect-[16/9] max-h-72 w-full rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between text-white relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-20 border-y border-dashed border-red-500/60 bg-red-500/10 flex items-center justify-center">
              <span className="text-[11px] font-bold text-red-300">Mobile & Desktop Safe Area (1546 × 423 px)</span>
            </div>
            <div className="relative z-10 flex items-center justify-between text-xs">
              <span className="font-bold">{displayHandle} Official Banner</span>
              <span className="font-mono bg-black/50 px-2 py-0.5 rounded">2560 × 1440 TV Spec</span>
            </div>
            <div className="relative z-10 text-right">
              <a
                href={`https://www.youtube.com/${displayHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Channel Banner</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Channel Audit & Creator Milestones</h3>
            <p className="text-xs text-slate-500">Estimations based on channel handle and public subscriber tiers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 font-semibold">Creator Play Button Tier</p>
              <p className="text-lg font-black text-amber-500 mt-1">Gold Play Button</p>
              <p className="text-[11px] text-slate-400 mt-0.5">1,000,000+ Subscribers Club</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 font-semibold">Average Video Views</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">2.4M Views</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Estimated 30-day baseline</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 font-semibold">Upload Frequency</p>
              <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1">2-3 Videos / Wk</p>
              <p className="text-[11px] text-slate-400 mt-0.5">High consistency tier</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
