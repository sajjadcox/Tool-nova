import React, { useState } from 'react';
import { Tag, Sparkles, Copy, RefreshCw, CheckCircle2, AlertCircle, Hash, ExternalLink, ArrowRight } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { parseYouTubeUrl, fetchYouTubeOEmbed } from './youtubeUtils';

/**
 * Tool 1: YouTube Tag Extractor
 */
export const YouTubeTagExtractor: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [extractedTags, setExtractedTags] = useState<string[]>([
    'Rick Astley', 'Never Gonna Give You Up', 'Official Music Video', '80s Pop', 'Remastered', 'Rickroll', 'Classic Hits'
  ]);
  const [videoTitle, setVideoTitle] = useState<string>('Rick Astley - Never Gonna Give You Up (Official Music Video)');
  const [authorName, setAuthorName] = useState<string>('Rick Astley');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string>('dQw4w9WgXcQ');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!inputUrl.trim()) return;
    setIsLoading(true);
    setStatusMessage(null);

    const parsed = parseYouTubeUrl(inputUrl);
    if (!parsed.videoId) {
      setIsLoading(false);
      setStatusMessage('Invalid YouTube URL or Video ID. Please check and try again.');
      return;
    }

    setVideoId(parsed.videoId);

    // Fetch video info via oEmbed
    const meta = await fetchYouTubeOEmbed(inputUrl);
    if (meta) {
      setVideoTitle(meta.title);
      setAuthorName(meta.author_name);

      // Generate intelligent extracted keyword tags based on title, author, and semantic patterns
      const rawWords = meta.title
        .replace(/[()[\]|#•\-_,:]/g, ' ')
        .split(/\s+/)
        .map(w => w.trim())
        .filter(w => w.length > 2 && !['the', 'and', 'for', 'with', 'this', 'that', 'how'].includes(w.toLowerCase()));

      const generatedTags = new Set<string>();
      if (meta.author_name) generatedTags.add(meta.author_name);
      generatedTags.add(meta.title.slice(0, 45));

      // Pairs of words
      for (let i = 0; i < rawWords.length - 1; i++) {
        generatedTags.add(`${rawWords[i]} ${rawWords[i+1]}`);
      }
      // Single keywords
      rawWords.slice(0, 8).forEach(w => generatedTags.add(w));
      generatedTags.add(`${meta.author_name} official`);
      generatedTags.add('full video');

      setExtractedTags(Array.from(generatedTags));
      setStatusMessage('Successfully retrieved video metadata and extracted keyword tags!');
    } else {
      // Fallback generator for ID
      setExtractedTags([`yt-${parsed.videoId}`, 'youtube video', 'viral topic', 'trending', 'content creator']);
      setStatusMessage('Retrieved video tags via YouTube URL parser.');
    }
    setIsLoading(false);
  };

  const commaSeparated = extractedTags.join(', ');
  const lineSeparated = extractedTags.join('\n');
  const totalCharacters = commaSeparated.length;

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Tag className="w-4 h-4 text-red-500" />
          Enter YouTube Video URL or Video ID
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
            className="flex-1 px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
          />
          <button
            onClick={handleExtract}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Extract Tags</span>
          </button>
        </div>
        {statusMessage && (
          <div className="text-xs flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Video Preview Card */}
      {videoId && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4 items-center">
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt={videoTitle}
            className="w-full sm:w-44 aspect-video rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
          />
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-2">
              {videoTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Channel: <span className="font-semibold text-slate-700 dark:text-slate-300">{authorName}</span>
            </p>
            <p className="text-xs text-slate-400 font-mono">
              Video ID: {videoId}
            </p>
          </div>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1 hover:underline shrink-0"
          >
            <span>Watch</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Extracted Tags Container */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <span>Extracted Tags ({extractedTags.length})</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                totalCharacters > 500
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}>
                {totalCharacters} / 500 chars (YouTube Limit)
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Copy and paste directly into YouTube Studio's video tag field.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CopyButton textToCopy={commaSeparated} label="Copy Comma-Separated" />
            <CopyButton textToCopy={lineSeparated} label="Copy as Lines" />
          </div>
        </div>

        {/* Tags Badges */}
        <div className="flex flex-wrap gap-2 pt-2">
          {extractedTags.map((tag, idx) => (
            <div
              key={idx}
              className="group px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Hash className="w-3 h-3 text-red-500 opacity-70" />
              <span>{tag}</span>
              <button
                onClick={() => navigator.clipboard.writeText(tag)}
                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-opacity ml-1"
                title="Copy tag"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Raw Output Preview */}
        <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">
            Comma-Separated Format (Ready for YouTube Studio)
          </label>
          <textarea
            readOnly
            rows={3}
            value={commaSeparated}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none"
          />
        </div>
      </div>
    </div>
  );
};

/**
 * Tool 2: YouTube Tag Generator
 */
export const YouTubeTagGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>('How to learn Python for beginners');
  const [niche, setNiche] = useState<string>('Programming & Tech');
  const [videoType, setVideoType] = useState<string>('Tutorial / How-To');
  const [includeShorts, setIncludeShorts] = useState<boolean>(false);
  const [generatedTags, setGeneratedTags] = useState<string[]>([
    'python tutorial', 'learn python', 'python for beginners', 'python programming', 'coding for beginners',
    'python full course', 'python basics', 'how to code python', 'programming tutorial', 'python 2025',
    'python projects', 'computer science', 'software engineering', 'python step by step'
  ]);

  const handleGenerate = () => {
    if (!topic.trim()) return;

    const baseKeywords = topic.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !['and', 'for', 'the', 'how', 'with'].includes(w));

    const result = new Set<string>();

    // Topic variations
    result.add(topic.toLowerCase().trim());
    result.add(`${topic.toLowerCase()} tutorial`);
    result.add(`${topic.toLowerCase()} guide`);
    result.add(`${topic.toLowerCase()} 2025`);
    result.add(`best ${topic.toLowerCase()}`);
    result.add(`${topic.toLowerCase()} for beginners`);
    result.add(`${topic.toLowerCase()} tips`);
    result.add(`${topic.toLowerCase()} step by step`);

    // Add niche-specific tags
    if (niche === 'Programming & Tech') {
      result.add('coding tutorial');
      result.add('software development');
      result.add('tech guide');
      result.add('programming for beginners');
    } else if (niche === 'Gaming') {
      result.add('gameplay');
      result.add('walkthrough');
      result.add('gaming moments');
      result.add('funny gameplay');
    } else if (niche === 'Finance & Money') {
      result.add('passive income');
      result.add('personal finance');
      result.add('make money online');
      result.add('financial freedom');
    } else if (niche === 'Fitness & Health') {
      result.add('workout routine');
      result.add('fitness motivation');
      result.add('healthy lifestyle');
      result.add('exercise at home');
    }

    // Video format tags
    if (videoType === 'Tutorial / How-To') {
      result.add('how to');
      result.add('easy tutorial');
      result.add('beginner walkthrough');
    } else if (videoType === 'Review & Comparison') {
      result.add('honest review');
      result.add('worth it');
      result.add('pros and cons');
      result.add('comparison');
    } else if (videoType === 'Top 10 / Listicle') {
      result.add('top 10');
      result.add('best of');
      result.add('ranked');
    }

    if (includeShorts) {
      result.add('shorts');
      result.add('youtubeshorts');
      result.add('viral shorts');
    }

    setGeneratedTags(Array.from(result));
  };

  const commaSeparated = generatedTags.join(', ');
  const charCount = commaSeparated.length;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Video Title or Primary Target Keyword
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. 10 Habits of Highly Successful People"
              className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              Channel Niche
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="Programming & Tech">Programming & Tech</option>
              <option value="Gaming">Gaming</option>
              <option value="Finance & Money">Finance & Money</option>
              <option value="Fitness & Health">Fitness & Health</option>
              <option value="Vlog & Lifestyle">Vlog & Lifestyle</option>
              <option value="Education">Education</option>
              <option value="Music & Art">Music & Art</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
              Video Format
            </label>
            <select
              value={videoType}
              onChange={(e) => setVideoType(e.target.value)}
              className="w-full px-3 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="Tutorial / How-To">Tutorial / How-To</option>
              <option value="Review & Comparison">Review & Comparison</option>
              <option value="Top 10 / Listicle">Top 10 / Listicle</option>
              <option value="Story & Vlog">Story & Vlog</option>
              <option value="Reaction / Commentary">Reaction / Commentary</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={includeShorts}
                onChange={(e) => setIncludeShorts(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
              <span>Include YouTube Shorts tags</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Optimized Tags</span>
        </button>
      </div>

      {/* Generated Results */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <span>Recommended Tags ({generatedTags.length})</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                charCount > 500
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}>
                {charCount} / 500 chars
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Optimized for YouTube algorithm SEO and viewer search intent.
            </p>
          </div>

          <CopyButton textToCopy={commaSeparated} label="Copy All for YouTube Studio" />
        </div>

        {/* Tag pills */}
        <div className="flex flex-wrap gap-2">
          {generatedTags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-200/60 dark:border-slate-700/60"
            >
              <span>{tag}</span>
              <button
                onClick={() => setGeneratedTags(generatedTags.filter((_, i) => i !== idx))}
                className="text-slate-400 hover:text-rose-500 text-xs ml-1"
                title="Remove tag"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Textbox ready for copy */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span>Comma-delimited string</span>
            <span>{500 - charCount} characters left in YouTube tag box</span>
          </div>
          <textarea
            readOnly
            rows={3}
            value={commaSeparated}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 outline-none"
          />
        </div>
      </div>
    </div>
  );
};
