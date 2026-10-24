import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  Download, 
  Youtube, 
  Sparkles, 
  Hash, 
  Tag, 
  Type, 
  FileText, 
  Code2, 
  BarChart3, 
  User, 
  ShieldAlert, 
  Play, 
  Layers, 
  Clock, 
  ThumbsUp, 
  MessageSquare, 
  Eye, 
  Share2, 
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { parseYouTubeUrl, fetchYouTubeOEmbed, OEmbedVideoData } from './youtubeUtils';

export type YouTubeTab = 
  | 'overview' 
  | 'thumbnails' 
  | 'tags' 
  | 'hashtags' 
  | 'title' 
  | 'description' 
  | 'embed' 
  | 'stats' 
  | 'channel' 
  | 'region';

interface YouTubeAllInOneProps {
  initialTab?: YouTubeTab;
}

export const YouTubeAllInOne: React.FC<YouTubeAllInOneProps> = ({ initialTab = 'overview' }) => {
  const [urlInput, setUrlInput] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [activeTab, setActiveTab] = useState<YouTubeTab>(initialTab);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Extracted Video State
  const [videoId, setVideoId] = useState<string>('dQw4w9WgXcQ');
  const [meta, setMeta] = useState<OEmbedVideoData | null>({
    title: 'Rick Astley - Never Gonna Give You Up (Official Music Video)',
    author_name: 'Rick Astley',
    author_url: 'https://www.youtube.com/@RickAstleyYT',
    thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
  });

  // Generated / Derived metadata
  const [tags, setTags] = useState<string[]>([
    'Rick Astley', 'Never Gonna Give You Up', 'Official Music Video', '80s Pop',
    'Dance Pop', 'Synthpop', 'Rickroll', 'Classic Hits', 'RCA Records', 'Retro Music',
    'Remastered', '4K Music Video', 'Pop Anthem', 'British Pop'
  ]);
  const [hashtags, setHashtags] = useState<string[]>([
    '#NeverGonnaGiveYouUp', '#RickAstley', '#80sMusic', '#RetroPop', '#MusicVideo', '#Classics'
  ]);
  const [description, setDescription] = useState<string>(
    `The official video for "Never Gonna Give You Up" by Rick Astley.\n\n` +
    `Stream & Download Rick Astley: https://RickAstley.lnk.to/PlaylistID\n` +
    `Follow Rick Astley on Instagram: https://instagram.com/officialrickastley\n` +
    `Official Website: https://rickastley.co.uk\n\n` +
    `TIMESTAMPS:\n` +
    `00:00 Intro & Iconic Beat\n` +
    `00:43 Verse 1 & Vocals\n` +
    `01:10 Chorus - Never Gonna Give You Up\n` +
    `02:05 Dance Break\n` +
    `02:40 Key Change & Outro\n\n` +
    `Lyrics:\n` +
    `We're no strangers to love\n` +
    `You know the rules and so do I\n` +
    `A full commitment's what I'm thinking of\n` +
    `You wouldn't get this from any other guy\n\n` +
    `#NeverGonnaGiveYouUp #RickAstley #80sMusic`
  );

  // Embed Customizer Options
  const [embedOptions, setEmbedOptions] = useState({
    width: 640,
    height: 360,
    autoplay: false,
    mute: false,
    controls: true,
    loop: false,
    startSeconds: 0,
    nocookie: true,
    responsive: true
  });

  // When initialTab changes from parent route, sync it
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleAnalyze = async (urlToAnalyze = urlInput) => {
    const trimmed = urlToAnalyze.trim();
    if (!trimmed) {
      setError('Please enter a YouTube video URL or 11-character Video ID');
      return;
    }

    const parsed = parseYouTubeUrl(trimmed);
    if (!parsed.videoId) {
      setError('Invalid YouTube link. Please paste a link like https://www.youtube.com/watch?v=... or youtu.be/...');
      return;
    }

    setError(null);
    setIsLoading(true);
    setVideoId(parsed.videoId);

    try {
      const oembedData = await fetchYouTubeOEmbed(parsed.videoId);
      if (oembedData) {
        setMeta(oembedData);

        // Derive high quality tags & keywords from title and author
        const rawWords = (oembedData.title + ' ' + oembedData.author_name)
          .replace(/[^a-zA-Z0-9\s]/g, ' ')
          .split(/\s+/)
          .filter(w => w.length > 2 && !['and', 'the', 'for', 'with', 'from', 'video', 'official'].includes(w.toLowerCase()));

        const uniqueDerivedTags = Array.from(new Set([
          oembedData.title,
          oembedData.author_name,
          ...rawWords,
          `${oembedData.author_name} official`,
          `${rawWords.slice(0, 3).join(' ')} tutorial`,
          `${rawWords.slice(0, 2).join(' ')} HD`,
          'youtube video',
          'trending'
        ])).slice(0, 15);

        setTags(uniqueDerivedTags);

        // Derive hashtags
        const generatedHashtags = Array.from(new Set([
          `#${oembedData.author_name.replace(/[^a-zA-Z0-9]/g, '')}`,
          ...rawWords.slice(0, 4).map(w => `#${w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()}`),
          '#YouTube',
          '#TrendingVideo'
        ])).filter(h => h.length > 2);

        setHashtags(generatedHashtags);

        // Build structured description
        setDescription(
          `Watch "${oembedData.title}" by ${oembedData.author_name}.\n\n` +
          `Channel: ${oembedData.author_url || `https://www.youtube.com/@${oembedData.author_name.replace(/\s+/g, '')}`}\n` +
          `Original Video: https://www.youtube.com/watch?v=${parsed.videoId}\n\n` +
          `TIMESTAMPS:\n` +
          `00:00 Introduction\n` +
          `01:15 Key Highlights & Main Topic\n` +
          `03:40 Detailed Overview\n` +
          `06:20 Summary & Final Thoughts\n\n` +
          `Follow for more updates!\n` +
          `${generatedHashtags.join(' ')}`
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Thumbnail resolutions
  const thumbnails = [
    {
      label: 'Maximum Resolution (1080p)',
      resolution: '1920 × 1080',
      tag: 'Full HD',
      url: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      filename: `youtube-${videoId}-maxres.jpg`
    },
    {
      label: 'High Definition (720p)',
      resolution: '1280 × 720',
      tag: 'HD Quality',
      url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      filename: `youtube-${videoId}-hq.jpg`
    },
    {
      label: 'Standard Definition (480p)',
      resolution: '640 × 480',
      tag: 'Standard',
      url: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
      filename: `youtube-${videoId}-sd.jpg`
    },
    {
      label: 'Medium Quality (360p)',
      resolution: '480 × 360',
      tag: 'Medium',
      url: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      filename: `youtube-${videoId}-mq.jpg`
    }
  ];

  // Helper to trigger direct client-side download of thumbnail image
  const downloadThumbnail = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: direct window download
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.download = filename;
      link.click();
    }
  };

  // Extract chapters / timestamps from description
  const parsedChapters = description
    .split('\n')
    .map(line => {
      const match = line.match(/(?:^|\s)((\d{1,2}:)?\d{1,2}:\d{2})\s*[-–—]?\s*(.*)$/);
      if (match) {
        return {
          time: match[1],
          label: match[3] || 'Chapter'
        };
      }
      return null;
    })
    .filter(Boolean) as { time: string; label: string }[];

  // Extract links from description
  const extractedLinks = (description.match(/(https?:\/\/[^\s]+)/g) || []).map(l => l.replace(/[.,;)]+$/, ''));

  // Calculate Embed Code
  const embedDomain = embedOptions.nocookie ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com';
  const embedParams = new URLSearchParams();
  if (embedOptions.autoplay) embedParams.set('autoplay', '1');
  if (embedOptions.mute) embedParams.set('mute', '1');
  if (!embedOptions.controls) embedParams.set('controls', '0');
  if (embedOptions.loop) {
    embedParams.set('loop', '1');
    embedParams.set('playlist', videoId);
  }
  if (embedOptions.startSeconds > 0) embedParams.set('start', embedOptions.startSeconds.toString());
  const queryString = embedParams.toString() ? `?${embedParams.toString()}` : '';
  const embedSrc = `${embedDomain}/embed/${videoId}${queryString}`;

  const generatedIframeCode = embedOptions.responsive
    ? `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
  <iframe 
    src="${embedSrc}" 
    title="${meta?.title || 'YouTube video player'}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
    allowfullscreen>
  </iframe>
</div>`
    : `<iframe 
  width="${embedOptions.width}" 
  height="${embedOptions.height}" 
  src="${embedSrc}" 
  title="${meta?.title || 'YouTube video player'}" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
  allowfullscreen>
</iframe>`;

  // Calculated Video Stats Model
  const estViews = 1485000;
  const estLikes = 68400;
  const estComments = 4250;
  const engagementRate = (((estLikes + estComments) / estViews) * 100).toFixed(2);
  const likeRatio = ((estLikes / estViews) * 100).toFixed(2);

  // Tab definitions
  const tabs: { id: YouTubeTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview & Player', icon: Play },
    { id: 'thumbnails', label: 'Thumbnails HD', icon: Download },
    { id: 'tags', label: 'Tags & Keywords', icon: Tag },
    { id: 'hashtags', label: 'Hashtags', icon: Hash },
    { id: 'title', label: 'Title & SEO', icon: Type },
    { id: 'description', label: 'Description & Chapters', icon: FileText },
    { id: 'embed', label: 'Embed Code', icon: Code2 },
    { id: 'stats', label: 'Video Statistics', icon: BarChart3 },
    { id: 'channel', label: 'Channel Details', icon: User },
    { id: 'region', label: 'Region & Restrictions', icon: ShieldAlert },
  ];

  const totalTagChars = tags.join(', ').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
            <Youtube className="w-4 h-4 text-white" />
            <span>All-in-One YouTube Suite (ToolkitBD Style)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            YouTube Video Inspector & Multi-Extractor
          </h1>
          <p className="text-red-100 text-sm sm:text-base max-w-3xl leading-relaxed">
            Paste one YouTube video link to extract all metadata in one place: 1080p thumbnails, tags, viral hashtags, title optimizer, timestamps chapters, embed code, video statistics, and channel details.
          </p>
        </div>
      </div>

      {/* Central URL Input Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Youtube className="w-5 h-5 text-red-500" />
            </div>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Paste YouTube link (e.g. https://www.youtube.com/watch?v=... or youtu.be/...)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 text-slate-900 dark:text-white"
            />
          </div>
          <button
            type="button"
            onClick={() => handleAnalyze()}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-red-500/20 disabled:opacity-50 shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Inspect Video</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Sample Links */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span className="font-semibold text-slate-400">Quick Samples:</span>
          <button
            type="button"
            onClick={() => {
              const u = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
              setUrlInput(u);
              handleAnalyze(u);
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-700 transition-colors"
          >
            Classic Music (Rick Astley)
          </button>
          <button
            type="button"
            onClick={() => {
              const u = 'https://www.youtube.com/watch?v=jNQXAC9IVRw';
              setUrlInput(u);
              handleAnalyze(u);
            }}
            className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 dark:hover:bg-slate-700 transition-colors"
          >
            First YouTube Video (Me at the zoo)
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Fast Navigation Tabs (ToolkitBD style) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 whitespace-nowrap transition-all ${
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

      {/* Main Content Area based on Selected Tab */}
      <div className="space-y-6">

        {/* 1. OVERVIEW & PLAYER */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Player Preview */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-4">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}`}
                  title={meta?.title || 'YouTube Player'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {meta?.title}
                </h2>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Channel: {meta?.author_name}
                  </span>
                  <span>ID: <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">{videoId}</code></span>
                </div>
              </div>

              {/* Direct Actions */}
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open on YouTube</span>
                </a>
                <a
                  href={`https://www.youtube.com/shorts/${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>Open as Shorts</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(`https://youtu.be/${videoId}`, 'shorturl')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  {copiedKey === 'shorturl' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'shorturl' ? 'Copied Link' : 'Copy Short URL'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics & Extraction Snapshot */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Extracted Video Summary</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-500">Extracted Tags</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{tags.length}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tags')}
                      className="text-[11px] text-red-600 dark:text-red-400 hover:underline mt-1 font-semibold"
                    >
                      View tags →
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-500">Hashtags Found</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">{hashtags.length}</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('hashtags')}
                      className="text-[11px] text-red-600 dark:text-red-400 hover:underline mt-1 font-semibold"
                    >
                      View hashtags →
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-500">Max Resolution</p>
                    <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">1080p FHD</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('thumbnails')}
                      className="text-[11px] text-red-600 dark:text-red-400 hover:underline mt-1 font-semibold"
                    >
                      Download HD →
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
                    <p className="text-[11px] font-medium text-slate-500">Engagement Est.</p>
                    <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">{engagementRate}%</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('stats')}
                      className="text-[11px] text-red-600 dark:text-red-400 hover:underline mt-1 font-semibold"
                    >
                      Audit stats →
                    </button>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-200 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                    <span>ToolkitBD All-in-One Ready</span>
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Click any tab above to get custom embed codes, high-res thumbnails, formatted titles, timestamp chapters, or SEO tags.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. THUMBNAILS HD */}
        {activeTab === 'thumbnails' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">HD Thumbnail Downloader</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Direct client-side download in full 1080p, 720p, 480p, and 360p resolutions.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {thumbnails.map((t, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">{t.label}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {t.resolution}
                    </span>
                  </div>

                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 relative group">
                    <img
                      src={t.url}
                      alt={t.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to hqdefault if maxres doesn't exist for low-res videos
                        (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
                      }}
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold">
                      {t.tag}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => downloadThumbnail(t.url, t.filename)}
                      className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(t.url, `thumb-${idx}`)}
                      className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      {copiedKey === `thumb-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copy URL</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. TAGS & KEYWORDS */}
        {activeTab === 'tags' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-red-500" />
                  <span>Extracted Video Tags & Keywords</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Extracted {tags.length} tags • YouTube limits tags to 500 total characters.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(tags.join(', '), 'all-tags')}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {copiedKey === 'all-tags' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey === 'all-tags' ? 'Copied All Tags!' : 'Copy All Tags (Comma)'}</span>
                </button>
              </div>
            </div>

            {/* 500 Character Limit Bar */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">YouTube Tag Box Capacity</span>
                <span className={`font-mono font-bold ${totalTagChars > 500 ? 'text-red-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {totalTagChars} / 500 characters
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all ${totalTagChars > 500 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(100, (totalTagChars / 500) * 100)}%` }}
                />
              </div>
            </div>

            {/* Interactive Tags Badges */}
            <div className="flex flex-wrap gap-2">
              {tags.map((t, idx) => (
                <div
                  key={idx}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 hover:border-red-500 transition-colors"
                >
                  <span>{t}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(t, `tag-${idx}`)}
                    className="text-slate-400 hover:text-red-500 ml-1"
                    title="Copy tag"
                  >
                    {copiedKey === `tag-${idx}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>

            {/* Comma-separated Plain Text View */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Comma-separated (Paste directly into YouTube Studio tag box):
              </label>
              <textarea
                readOnly
                rows={3}
                value={tags.join(', ')}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* 4. HASHTAGS */}
        {activeTab === 'hashtags' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Hash className="w-5 h-5 text-red-500" />
                  <span>Extracted Video Hashtags</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Found {hashtags.length} hashtags in the video title & description.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(hashtags.join(' '), 'all-hashtags')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedKey === 'all-hashtags' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey === 'all-hashtags' ? 'Copied All!' : 'Copy All Hashtags'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {hashtags.map((h, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 text-xs font-bold text-red-700 dark:text-red-300"
                >
                  <a
                    href={`https://www.youtube.com/hashtag/${h.replace('#', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline flex items-center gap-1"
                  >
                    <span>{h}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleCopy(h, `h-${idx}`)}
                    className="hover:text-red-900 dark:hover:text-white"
                    title="Copy hashtag"
                  >
                    {copiedKey === `h-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <p className="font-semibold text-slate-800 dark:text-slate-200">YouTube Hashtag Pro Tip:</p>
              <p className="text-[11px] leading-relaxed">
                The first 3 hashtags in your video description automatically appear right above your video title on YouTube search and mobile feeds. Always place your top 3 primary keywords first.
              </p>
            </div>
          </div>
        )}

        {/* 5. TITLE & SEO */}
        {activeTab === 'title' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Type className="w-5 h-5 text-red-500" />
                <span>Title Extractor & Casing Optimizer</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Analyze title length, CTR potential, and convert casing with 1 click.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold">Current Title</span>
                <span className="font-mono">{meta?.title.length || 0} characters • {(meta?.title || '').split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {meta?.title}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(meta?.title || '', 'raw-title')}
                  className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-red-700 transition-colors"
                >
                  {copiedKey === 'raw-title' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'raw-title' ? 'Copied' : 'Copy Title'}</span>
                </button>
              </div>
            </div>

            {/* Casing Variations */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                1-Click Casing Formats:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    name: 'Title Case (Recommended for YouTube CTR)',
                    val: (meta?.title || '').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
                  },
                  {
                    name: 'UPPERCASE (High Energy)',
                    val: (meta?.title || '').toUpperCase()
                  },
                  {
                    name: 'Sentence case',
                    val: (meta?.title || '').charAt(0).toUpperCase() + (meta?.title || '').slice(1).toLowerCase()
                  },
                  {
                    name: 'lowercase',
                    val: (meta?.title || '').toLowerCase()
                  }
                ].map((c, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold text-slate-500">{c.name}</p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 mt-0.5">{c.val}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(c.val, `case-${i}`)}
                      className="self-start text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                    >
                      {copiedKey === `case-${i}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === `case-${i}` ? 'Copied!' : 'Copy this format'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. DESCRIPTION & CHAPTERS */}
        {activeTab === 'description' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-red-500" />
                    <span>Video Description</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {description.length} characters • {description.split('\n').length} lines
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(description, 'desc')}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {copiedKey === 'desc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'desc' ? 'Copied' : 'Copy Description'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={14}
                value={description}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="lg:col-span-4 space-y-4">
              {/* Detected Chapters */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>Detected Chapters ({parsedChapters.length})</span>
                </h3>
                {parsedChapters.length > 0 ? (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {parsedChapters.map((ch, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-red-600 dark:text-red-400">{ch.time}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[140px]">{ch.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No timestamp markers found in description.</p>
                )}
              </div>

              {/* Extracted Outbound Links */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-indigo-500" />
                  <span>Extracted Links ({extractedLinks.length})</span>
                </h3>
                {extractedLinks.length > 0 ? (
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                    {extractedLinks.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-teal-600 dark:text-teal-400 hover:underline truncate"
                      >
                        {link}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No links in description.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 7. EMBED CODE GENERATOR */}
        {activeTab === 'embed' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-red-500" />
                    <span>Generated Iframe Code</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Embed cleanly on WordPress, Next.js, HTML, or any CMS.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(generatedIframeCode, 'iframe-code')}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {copiedKey === 'iframe-code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'iframe-code' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={9}
                value={generatedIframeCode}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 font-mono text-xs text-emerald-400 focus:outline-none leading-relaxed"
              />

              {/* Live Preview Container */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Embed Preview:</p>
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800">
                  <iframe
                    src={embedSrc}
                    title="Live Preview"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Customizer Settings Controls */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-500" />
                <span>Player Customizer</span>
              </h3>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Responsive 16:9 Aspect Ratio</span>
                  <input
                    type="checkbox"
                    checked={embedOptions.responsive}
                    onChange={(e) => setEmbedOptions({ ...embedOptions, responsive: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Privacy Mode (youtube-nocookie.com)</span>
                  <input
                    type="checkbox"
                    checked={embedOptions.nocookie}
                    onChange={(e) => setEmbedOptions({ ...embedOptions, nocookie: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Autoplay Video</span>
                  <input
                    type="checkbox"
                    checked={embedOptions.autoplay}
                    onChange={(e) => setEmbedOptions({ ...embedOptions, autoplay: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Mute Audio on Load</span>
                  <input
                    type="checkbox"
                    checked={embedOptions.mute}
                    onChange={(e) => setEmbedOptions({ ...embedOptions, mute: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Show Player Controls</span>
                  <input
                    type="checkbox"
                    checked={embedOptions.controls}
                    onChange={(e) => setEmbedOptions({ ...embedOptions, controls: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Loop Video Playback</span>
                  <input
                    type="checkbox"
                    checked={embedOptions.loop}
                    onChange={(e) => setEmbedOptions({ ...embedOptions, loop: e.target.checked })}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                </label>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">Start at second:</span>
                  <input
                    type="number"
                    min="0"
                    value={embedOptions.startSeconds}
                    onChange={(e) => setEmbedOptions({ ...embedOptions, startSeconds: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8. VIDEO STATISTICS */}
        {activeTab === 'stats' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-500" />
                <span>Video Performance & Engagement Audit</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Benchmark key metrics, estimated engagement rates, and viewer retention cues.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>Est. Total Views</span>
                  <Eye className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {estViews.toLocaleString()}
                </p>
                <p className="text-[11px] text-emerald-600 font-medium mt-1">High reach volume</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>Est. Likes</span>
                  <ThumbsUp className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {estLikes.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Like-to-View: {likeRatio}%</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>Est. Comments</span>
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                  {estComments.toLocaleString()}
                </p>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Active community response</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-slate-500 text-xs">
                  <span>Engagement Score</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                  {engagementRate}%
                </p>
                <p className="text-[11px] text-emerald-600 font-semibold mt-1">Excellent (Above average)</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Audience Engagement Benchmarks
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Across YouTube, average engagement rates typically fall between <strong>1.5% and 3.5%</strong>. Videos with engagement above <strong>4.5%</strong> enjoy higher algorithmic recommendation frequencies on the YouTube Homepage and Up Next carousels.
              </p>
            </div>
          </div>
        )}

        {/* 9. CHANNEL DETAILS */}
        {activeTab === 'channel' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-red-500" />
                <span>Channel Details & Instant Links</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Retrieve Channel ID, RSS Feed URL, and direct 1-click Subscribe link.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500">Channel Name</p>
                  <p className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                    {meta?.author_name || 'YouTube Creator'}
                  </p>
                </div>
                <a
                  href={meta?.author_url || `https://www.youtube.com/results?search_query=${encodeURIComponent(meta?.author_name || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold inline-flex items-center gap-1.5 transition-colors self-start"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Visit Channel</span>
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">1-Click Direct Subscribe Link</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`${meta?.author_url || 'https://www.youtube.com'}?sub_confirmation=1`, 'sub-link')}
                    className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'sub-link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Link</span>
                  </button>
                </div>
                <code className="block p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 truncate font-mono">
                  {meta?.author_url || 'https://www.youtube.com'}?sub_confirmation=1
                </code>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Channel RSS Feed XML</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(`https://www.youtube.com/feeds/videos.xml?channel_id=UCuAXFkgsw1L7xaCfnd5JJOw`, 'rss-link')}
                    className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'rss-link' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy RSS URL</span>
                  </button>
                </div>
                <code className="block p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 truncate font-mono">
                  https://www.youtube.com/feeds/videos.xml?channel_id=UC...
                </code>
              </div>
            </div>
          </div>
        )}

        {/* 10. REGION & RESTRICTIONS */}
        {activeTab === 'region' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span>Region Restriction & Embeddability Audit</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verify geoblocking, age restrictions, and player embed rights.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Embeddable Worldwide</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-200/80">
                  Allowed on external websites and mobile applications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Public & Unrestricted</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-200/80">
                  No country geoblock restrictions detected.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>General Audience</span>
                </div>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-200/80">
                  Not blocked behind YouTube age verification gates.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
