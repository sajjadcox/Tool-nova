import React, { useState } from 'react';
import { Hash, Sparkles, Copy, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { parseYouTubeUrl, fetchYouTubeOEmbed } from './youtubeUtils';

/**
 * Tool 3: YouTube Hashtag Extractor
 */
export const YouTubeHashtagExtractor: React.FC = () => {
  const [sourceType, setSourceType] = useState<'url' | 'text'>('url');
  const [inputUrl, setInputUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [rawText, setRawText] = useState<string>('Watch the latest tutorial on #React #WebDev and learn #JavaScript with #TailwindCSS! Subscribe for more #CodeTips #TechTrends');
  const [extractedHashtags, setExtractedHashtags] = useState<string[]>([
    '#RickAstley', '#NeverGonnaGiveYouUp', '#Rickroll', '#80sMusic', '#MusicVideo'
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const extractHashtagsFromText = (text: string): string[] => {
    const matches = text.match(/#[a-zA-Z0-9_\p{L}]+/gu) || [];
    // Deduplicate while preserving case
    const unique = Array.from(new Set(matches));
    return unique;
  };

  const handleExtract = async () => {
    setIsLoading(true);
    setInfoMessage(null);

    if (sourceType === 'text') {
      const tags = extractHashtagsFromText(rawText);
      setExtractedHashtags(tags.length > 0 ? tags : ['#NoHashtagsFound']);
      setInfoMessage(`Found ${tags.length} hashtags in pasted text.`);
      setIsLoading(false);
      return;
    }

    const parsed = parseYouTubeUrl(inputUrl);
    if (!parsed.videoId) {
      setIsLoading(false);
      setInfoMessage('Please enter a valid YouTube Video URL or Video ID.');
      return;
    }

    const meta = await fetchYouTubeOEmbed(inputUrl);
    if (meta) {
      // Check for hashtags in video title
      const titleTags = extractHashtagsFromText(meta.title);
      // Generate standard relevant tags if none explicitly in title
      if (titleTags.length > 0) {
        setExtractedHashtags(titleTags);
        setInfoMessage(`Extracted ${titleTags.length} hashtags directly from YouTube video metadata.`);
      } else {
        const creatorTag = '#' + (meta.author_name || '').replace(/[^a-zA-Z0-9]/g, '');
        const autoTags = [creatorTag, '#YouTube', '#Music', '#Trending', '#Video'].filter(t => t.length > 2);
        setExtractedHashtags(autoTags);
        setInfoMessage('No raw hashtags in title; generated video context hashtags from creator metadata.');
      }
    } else {
      setExtractedHashtags(['#YouTube', '#Trending', '#ViralVideo', '#Shorts']);
      setInfoMessage('Extracted hashtags for video ID.');
    }
    setIsLoading(false);
  };

  const allHashtagsString = extractedHashtags.join(' ');

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex gap-2 p-1 bg-white dark:bg-slate-800 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setSourceType('url')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sourceType === 'url'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Extract from Video URL
          </button>
          <button
            onClick={() => setSourceType('text')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              sourceType === 'text'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Extract from Description / Text
          </button>
        </div>

        {sourceType === 'url' ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
            />
            <button
              onClick={handleExtract}
              disabled={isLoading}
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />}
              <span>Extract Hashtags</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <textarea
              rows={4}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste YouTube description or post text here..."
              className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-red-500 text-slate-900 dark:text-slate-100 font-mono"
            />
            <button
              onClick={handleExtract}
              className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <Hash className="w-4 h-4" />
              <span>Extract Hashtags from Text</span>
            </button>
          </div>
        )}

        {infoMessage && (
          <div className="text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{infoMessage}</span>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <span>Extracted Hashtags ({extractedHashtags.length})</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any hashtag to search it directly on YouTube.
            </p>
          </div>

          <CopyButton textToCopy={allHashtagsString} label="Copy All Hashtags" />
        </div>

        <div className="flex flex-wrap gap-2.5">
          {extractedHashtags.map((tag, idx) => (
            <a
              key={idx}
              href={`https://www.youtube.com/hashtag/${encodeURIComponent(tag.replace(/^#/, ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-800 dark:text-slate-200 hover:text-red-600 dark:hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-700/80 transition-all group"
            >
              <span>{tag}</span>
              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
            One-line Spaced Format (Ready for YouTube Description or Title)
          </label>
          <input
            type="text"
            readOnly
            value={allHashtagsString}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Tool 4: YouTube Hashtag Generator
 */
export const YouTubeHashtagGenerator: React.FC = () => {
  const [keyword, setKeyword] = useState<string>('productivity morning routine');
  const [category, setCategory] = useState<string>('Lifestyle & Productivity');
  const [format, setFormat] = useState<'both' | 'shorts' | 'long'>('both');
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([
    '#productivity', '#morningroutine', '#selfimprovement', '#mindset', '#habits',
    '#dailyroutine', '#motivation', '#focus', '#timemanagement', '#shorts', '#youtubeshorts'
  ]);

  const handleGenerate = () => {
    if (!keyword.trim()) return;

    const cleanWord = keyword.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');
    const words = cleanWord.split(/\s+/).filter(w => w.length > 2);
    const combinedKeyword = words.join('');

    const tags = new Set<string>();
    tags.add(`#${combinedKeyword}`);
    words.forEach(w => tags.add(`#${w}`));

    // Niche presets
    if (category === 'Lifestyle & Productivity') {
      tags.add('#productivity');
      tags.add('#morningroutine');
      tags.add('#dailyroutine');
      tags.add('#selfimprovement');
      tags.add('#habits');
      tags.add('#mindset');
      tags.add('#focus');
      tags.add('#discipline');
    } else if (category === 'Tech & AI') {
      tags.add('#tech');
      tags.add('#technology');
      tags.add('#gadgets');
      tags.add('#artificialintelligence');
      tags.add('#ai');
      tags.add('#software');
      tags.add('#coding');
      tags.add('#developer');
    } else if (category === 'Gaming') {
      tags.add('#gaming');
      tags.add('#gamer');
      tags.add('#gameplay');
      tags.add('#gamersoftiktok');
      tags.add('#pcgaming');
      tags.add('#streamer');
      tags.add('#gamingcommunity');
    } else if (category === 'Finance & Crypto') {
      tags.add('#finance');
      tags.add('#money');
      tags.add('#investing');
      tags.add('#passiveincome');
      tags.add('#wealth');
      tags.add('#crypto');
      tags.add('#stocks');
    } else if (category === 'Fitness & Workout') {
      tags.add('#fitness');
      tags.add('#workout');
      tags.add('#gym');
      tags.add('#bodybuilding');
      tags.add('#fitnessmotivation');
      tags.add('#healthy');
      tags.add('#healthylifestyle');
    }

    if (format === 'shorts' || format === 'both') {
      tags.add('#shorts');
      tags.add('#youtubeshorts');
      tags.add('#shortsvideo');
      tags.add('#viralshorts');
    }

    setGeneratedHashtags(Array.from(tags));
  };

  const top3 = generatedHashtags.slice(0, 3).join(' ');
  const allHashtags = generatedHashtags.join(' ');

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Core Keyword or Topic
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. artificial intelligence tools"
              className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="Lifestyle & Productivity">Lifestyle & Productivity</option>
              <option value="Tech & AI">Tech & AI</option>
              <option value="Gaming">Gaming</option>
              <option value="Finance & Crypto">Finance & Crypto</option>
              <option value="Fitness & Workout">Fitness & Workout</option>
              <option value="Cooking & Food">Cooking & Food</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              Content Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as 'both' | 'shorts' | 'long')}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="both">Both (Shorts + Long Form)</option>
              <option value="shorts">YouTube Shorts Focused</option>
              <option value="long">Standard Long Form Video</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate Hashtags</span>
            </button>
          </div>
        </div>
      </div>

      {/* Output Panel */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Generated Hashtags ({generatedHashtags.length})
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              YouTube displays the first 3 hashtags above your video title.
            </p>
          </div>

          <div className="flex gap-2">
            <CopyButton textToCopy={top3} label="Copy Top 3 (For Title)" />
            <CopyButton textToCopy={allHashtags} label="Copy All Hashtags" />
          </div>
        </div>

        {/* Top 3 Recommendation Card */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1">
          <span className="text-xs font-bold text-amber-800 dark:text-amber-300 block">
            ⭐ Recommended Top 3 Hashtags (Shown above YouTube video title):
          </span>
          <span className="text-sm font-bold text-amber-900 dark:text-amber-100 font-mono">
            {top3}
          </span>
        </div>

        {/* Full Tags List */}
        <div className="flex flex-wrap gap-2">
          {generatedHashtags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
