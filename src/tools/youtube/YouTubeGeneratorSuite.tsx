import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Tag, 
  Hash, 
  Type, 
  FileText, 
  Flame, 
  Layers,
  ArrowRight
} from 'lucide-react';

export type GeneratorTab = 'tags' | 'hashtags' | 'titles' | 'description';

interface YouTubeGeneratorSuiteProps {
  initialTab?: GeneratorTab;
}

export const YouTubeGeneratorSuite: React.FC<YouTubeGeneratorSuiteProps> = ({ initialTab = 'tags' }) => {
  const [activeTab, setActiveTab] = useState<GeneratorTab>(initialTab);
  const [keyword, setKeyword] = useState<string>('Tech Review 2026');
  const [niche, setNiche] = useState<string>('Tech & Gadgets');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generated Tags based on keyword
  const baseKw = keyword.trim() || 'Video Tutorial';
  const generatedTags = [
    baseKw,
    `${baseKw} review`,
    `${baseKw} tutorial`,
    `best ${baseKw}`,
    `how to ${baseKw}`,
    `${baseKw} guide 2026`,
    `${baseKw} tips`,
    `${baseKw} for beginners`,
    `top 10 ${baseKw}`,
    `${baseKw} comparison`,
    `${baseKw} explained`,
    `${baseKw} tricks`,
    `ultimate ${baseKw}`,
    `${baseKw} walkthrough`,
    `${baseKw} secrets`,
    `${baseKw} pros and cons`,
    `${baseKw} update`,
    `${baseKw} full course`
  ];

  // Generated Hashtags
  const cleanTerm = baseKw.replace(/[^a-zA-Z0-9]/g, '');
  const generatedHashtags = [
    `#${cleanTerm}`,
    `#${cleanTerm}Tutorial`,
    `#${cleanTerm}Tips`,
    `#${cleanTerm}Guide`,
    `#${cleanTerm}Review`,
    `#YouTubeShorts`,
    `#ViralVideo`,
    `#TrendingNow`,
    `#TechTrends`,
    `#DailyShorts`,
    `#ContentCreator`,
    `#Subscribe`
  ];

  // Generated Click-Worthy Titles
  const generatedTitles = [
    `I Tested ${baseKw} for 30 Days (Here's What Happened)`,
    `How to Master ${baseKw} in 2026 (Full Step-by-Step Guide)`,
    `Don't Buy ${baseKw} Until You Watch This!`,
    `Top 10 ${baseKw} Tips You Probably Didn't Know`,
    `The Truth About ${baseKw}: Honest Review After 1 Month`,
    `Why Everyone Is Talking About ${baseKw}`,
    `${baseKw} vs The Competition: Is It Really Worth It?`,
    `The Ultimate Beginner's Guide to ${baseKw} (Zero to Pro)`,
    `5 Mistakes Everyone Makes With ${baseKw} (Avoid These!)`
  ];

  // Structured Description Template
  const structuredDescription = 
`In this video, we dive deep into ${baseKw}. You'll discover everything you need to know about ${baseKw}, key tips, and honest insights for 2026.

📌 TIMESTAMPS / CHAPTERS:
00:00 - Introduction to ${baseKw}
01:30 - Key Features & Overview
03:45 - Step-by-Step Walkthrough
06:20 - Pros & Cons You Should Know
08:50 - Final Verdict & Recommendation

🔗 HELPFUL RESOURCES & LINKS:
• Official Website: https://example.com/resource
• Get the Checklist: https://example.com/download
• Recommended Gear: https://amazon.com/shop/creator

📱 CONNECT ON SOCIALS:
• Twitter / X: https://twitter.com/yourhandle
• Instagram: https://instagram.com/yourhandle
• Join Discord: https://discord.gg/yourcommunity

🔔 Subscribe for weekly tutorials and in-depth tech insights!
Leave a comment below with your thoughts or questions.

⚠️ DISCLAIMER:
Some links above may be affiliate links, meaning I earn a small commission if you make a purchase at no extra cost to you.

${generatedHashtags.slice(0, 5).join(' ')}`;

  const tabs: { id: GeneratorTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'tags', label: 'Tag Generator', icon: Tag },
    { id: 'hashtags', label: 'Hashtag Generator', icon: Hash },
    { id: 'titles', label: 'Viral Title Generator', icon: Type },
    { id: 'description', label: 'Description Builder', icon: FileText }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YouTube SEO & Content Suite</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            YouTube Content & SEO Generator Suite
          </h1>
          <p className="text-red-100 text-xs sm:text-sm max-w-2xl">
            Generate high-ranking tags, viral hashtags, click-worthy titles, and professional description templates in seconds.
          </p>
        </div>
      </div>

      {/* Input controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Video Topic or Primary Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Python for Beginners, iPhone 16 Camera, Gym Workout"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Channel Niche
            </label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
            >
              <option value="Tech & Gadgets">Tech & Gadgets</option>
              <option value="Education & How-To">Education & How-To</option>
              <option value="Gaming & Esports">Gaming & Esports</option>
              <option value="Finance & Business">Finance & Business</option>
              <option value="Fitness & Health">Fitness & Health</option>
              <option value="Vlog & Lifestyle">Vlog & Lifestyle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
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

      {/* 1. TAGS */}
      {activeTab === 'tags' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Generated SEO Tags ({generatedTags.length})</h3>
              <p className="text-xs text-slate-500">Comma-separated keywords for YouTube Studio.</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(generatedTags.join(', '), 'all-gen-tags')}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedKey === 'all-gen-tags' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all-gen-tags' ? 'Copied All!' : 'Copy All Tags'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {generatedTags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <textarea
            readOnly
            rows={3}
            value={generatedTags.join(', ')}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          />
        </div>
      )}

      {/* 2. HASHTAGS */}
      {activeTab === 'hashtags' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Viral Hashtags ({generatedHashtags.length})</h3>
              <p className="text-xs text-slate-500">Optimized for search ranking & Shorts algorithm.</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(generatedHashtags.join(' '), 'all-gen-hash')}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedKey === 'all-gen-hash' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'all-gen-hash' ? 'Copied!' : 'Copy Hashtags'}</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {generatedHashtags.map((h, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-xs font-bold text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 3. TITLES */}
      {activeTab === 'titles' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Click-Worthy Title Ideas</h3>
            <p className="text-xs text-slate-500">Formulated using high CTR hooks (curiosity, how-to, lists, and tests).</p>
          </div>

          <div className="space-y-2.5">
            {generatedTitles.map((title, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{title}</p>
                  <p className="text-[11px] text-slate-400 font-mono">{title.length} characters</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(title, `t-${i}`)}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1"
                >
                  {copiedKey === `t-${i}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === `t-${i}` ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. DESCRIPTION */}
      {activeTab === 'description' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Structured Video Description Template</h3>
              <p className="text-xs text-slate-500">Includes hook, timestamps, socials, affiliate disclaimer, and hashtags.</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(structuredDescription, 'desc-template')}
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedKey === 'desc-template' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'desc-template' ? 'Copied' : 'Copy Template'}</span>
            </button>
          </div>

          <textarea
            readOnly
            rows={14}
            value={structuredDescription}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};
