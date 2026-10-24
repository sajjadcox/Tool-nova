import React, { useState } from 'react';
import { Type, Sparkles, Copy, ExternalLink, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { parseYouTubeUrl, fetchYouTubeOEmbed } from './youtubeUtils';

/**
 * Tool 5: YouTube Title Extractor
 */
export const YouTubeTitleExtractor: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [title, setTitle] = useState<string>('Rick Astley - Never Gonna Give You Up (Official Music Video)');
  const [authorName, setAuthorName] = useState<string>('Rick Astley');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [videoId, setVideoId] = useState<string>('dQw4w9WgXcQ');

  const handleExtract = async () => {
    if (!inputUrl.trim()) return;
    setIsLoading(true);

    const parsed = parseYouTubeUrl(inputUrl);
    if (!parsed.videoId) {
      setIsLoading(false);
      return;
    }

    setVideoId(parsed.videoId);
    const meta = await fetchYouTubeOEmbed(inputUrl);
    if (meta) {
      setTitle(meta.title);
      setAuthorName(meta.author_name);
    }
    setIsLoading(false);
  };

  const charLength = title.length;
  const wordCount = title.trim().split(/\s+/).filter(Boolean).length;
  const isOptimalLength = charLength >= 40 && charLength <= 65;

  // Title formatting options
  const uppercaseTitle = title.toUpperCase();
  const lowercaseTitle = title.toLowerCase();
  const titlecaseTitle = title.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Type className="w-4 h-4 text-red-500" />
          Enter YouTube Video URL
        </label>
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
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Extract Title</span>
          </button>
        </div>
      </div>

      {/* Main Extracted Title Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Exact Extracted Title
            </span>
            <CopyButton textToCopy={title} label="Copy Title" />
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
              {title}
            </p>
          </div>
        </div>

        {/* SEO Metrics & Audit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-xs text-slate-500 block mb-1">Character Count</span>
            <span className={`text-xl font-black ${isOptimalLength ? 'text-emerald-600' : 'text-amber-500'}`}>
              {charLength}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Recommended: 40-65</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-xs text-slate-500 block mb-1">Word Count</span>
            <span className="text-xl font-black text-slate-900 dark:text-slate-100">
              {wordCount}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Optimal: 6-10 words</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-xs text-slate-500 block mb-1">Mobile Cutoff</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${
              charLength <= 60 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {charLength <= 60 ? 'Fully Visible' : 'May Truncate'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-xs text-slate-500 block mb-1">Channel</span>
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate block mt-1">
              {authorName}
            </span>
          </div>
        </div>

        {/* Case Formatting Alternatives */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
            Capitalization Variations
          </span>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-700 dark:text-slate-300 truncate mr-3 font-medium">
                {titlecaseTitle}
              </span>
              <CopyButton textToCopy={titlecaseTitle} label="Title Case" />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-700 dark:text-slate-300 truncate mr-3 font-medium">
                {uppercaseTitle}
              </span>
              <CopyButton textToCopy={uppercaseTitle} label="UPPERCASE" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Tool 6: YouTube Title Generator
 */
export const YouTubeTitleGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>('Make Money with AI');
  const [category, setCategory] = useState<string>('Finance & AI');
  const [generatedTitles, setGeneratedTitles] = useState<Array<{ title: string; type: string; ctrScore: number }>>([
    { title: 'I Tried Making Money with AI for 30 Days (Here is What Happened)', type: 'Case Study / Story', ctrScore: 96 },
    { title: 'The Secret AI Side Hustle Nobody is Talking About in 2025', type: 'Curiosity Gap', ctrScore: 94 },
    { title: 'How to Make Money with AI: Step-by-Step for Complete Beginners', type: 'How-To Guide', ctrScore: 91 },
    { title: '7 AI Tools That Will Make You Rich (And 3 to Avoid)', type: 'Listicle / Warning', ctrScore: 95 },
    { title: 'Stop Making This Huge Mistake When Trying to Make Money with AI', type: 'Fear of Missing Out', ctrScore: 89 },
    { title: 'Make Money with AI in 2025: The Ultimate Free Masterclass', type: 'Authority / Value', ctrScore: 88 },
  ]);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    const cleanTopic = topic.trim();

    const formulas = [
      {
        title: `I Tried ${cleanTopic} for 30 Days (Shocking Results)`,
        type: 'Real Experiment / Curiosity',
        ctrScore: 97
      },
      {
        title: `How to ${cleanTopic} in 2025 (Step-by-Step Tutorial)`,
        type: 'Beginner Friendly Guide',
        ctrScore: 93
      },
      {
        title: `The Secret Way to ${cleanTopic} Nobody Tells You`,
        type: 'Exclusive Insider',
        ctrScore: 95
      },
      {
        title: `7 Mistakes Everyone Makes With ${cleanTopic} (Don't Do This!)`,
        type: 'Warning / High CTR',
        ctrScore: 94
      },
      {
        title: `${cleanTopic}: From Zero to Hero (Full Walkthrough)`,
        type: 'Transformation Blueprint',
        ctrScore: 90
      },
      {
        title: `Why 99% Fail at ${cleanTopic} (And How to Succeed)`,
        type: 'Contrarian / Psychology',
        ctrScore: 92
      },
      {
        title: `Stop Doing This if You Want to ${cleanTopic}!`,
        type: 'Direct Urgency',
        ctrScore: 89
      },
      {
        title: `The Ultimate Guide to ${cleanTopic} (Everything You Need)`,
        type: 'Authority Pillar',
        ctrScore: 88
      }
    ];

    setGeneratedTitles(formulas);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Video Topic or Main Idea
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Build a Web App with React"
              className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Niche Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
            >
              <option value="Finance & AI">Finance & AI</option>
              <option value="Tech & Coding">Tech & Coding</option>
              <option value="Gaming">Gaming</option>
              <option value="Education">Education</option>
              <option value="Fitness & Health">Fitness & Health</option>
              <option value="Vlog & Lifestyle">Vlog & Lifestyle</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate High-CTR Titles</span>
        </button>
      </div>

      {/* Generated Titles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Viral Title Options ({generatedTitles.length})
          </h4>
          <span className="text-xs text-slate-500">
            Formulas proven to maximize YouTube Click-Through Rate (CTR)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {generatedTitles.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {item.ctrScore}% CTR Score
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {item.title.length} chars
                  </span>
                </div>
                <p className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {item.title}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <CopyButton textToCopy={item.title} label="Copy Title" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
