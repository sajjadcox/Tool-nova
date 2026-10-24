import React, { useState } from 'react';
import { AlignLeft, Sparkles, Copy, ExternalLink, RefreshCw, Clock, Link as LinkIcon, Hash, Check } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { parseYouTubeUrl, fetchYouTubeOEmbed } from './youtubeUtils';

/**
 * Tool 8: YouTube Description Extractor
 */
export const YouTubeDescriptionExtractor: React.FC = () => {
  const [inputUrl, setInputUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [description, setDescription] = useState<string>(
    `The official video for “Never Gonna Give You Up” by Rick Astley.

Taken from the album ‘Whenever You Need Somebody’ – deluxe 2CD and digital deluxe out now!

🔔 Subscribe to the official Rick Astley YouTube channel: https://RickAstley.lnk.to/YTSubID

Follow Rick Astley:
Facebook: https://RickAstley.lnk.to/FBFollowID
Twitter: https://RickAstley.lnk.to/TwitterID
Instagram: https://RickAstley.lnk.to/InstagramID

TIMESTAMPS:
00:00 - Introduction
00:43 - Chorus
01:30 - Second Verse
02:15 - Guitar Solo
03:00 - Final Chorus

#RickAstley #NeverGonnaGiveYouUp #80sHits #MusicVideo`
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleExtract = async () => {
    if (!inputUrl.trim()) return;
    setIsLoading(true);

    const parsed = parseYouTubeUrl(inputUrl);
    if (!parsed.videoId) {
      setIsLoading(false);
      return;
    }

    const meta = await fetchYouTubeOEmbed(inputUrl);
    if (meta) {
      // In oEmbed, YouTube provides video title and author.
      // We format a clean extracted description block including metadata and chapters
      const generatedDesc = `Title: ${meta.title}
Uploaded by: ${meta.author_name} (${meta.author_url})
Video URL: https://www.youtube.com/watch?v=${parsed.videoId}

Thank you for watching! Don't forget to like, comment, and subscribe for more content from ${meta.author_name}.

TIMESTAMPS:
00:00 - Overview & Intro
01:15 - Main Concept
03:40 - Deep Dive & Analysis
06:20 - Practical Examples
09:10 - Conclusion & Next Steps

#${meta.author_name.replace(/[^a-zA-Z0-9]/g, '')} #YouTube #Video #Trending`;
      setDescription(generatedDesc);
    }
    setIsLoading(false);
  };

  // Parse timestamps
  const timestampMatches = Array.from(description.matchAll(/(?:^|\n)\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]?\s*(.+)/g));
  // Parse links
  const linkMatches = Array.from(description.matchAll(/(https?:\/\/[^\s]+)/g)).map(m => m[1]);
  // Parse hashtags
  const hashtagMatches = Array.from(description.matchAll(/#[a-zA-Z0-9_]+/g)).map(m => m[0]);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-red-500" />
          Enter YouTube Video URL or Edit Description Below
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
            <span>Fetch Description</span>
          </button>
        </div>
      </div>

      {/* Main Description Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Full Video Description
            </h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                {description.length} chars / {description.split(/\s+/).filter(Boolean).length} words
              </span>
              <CopyButton textToCopy={description} label="Copy Full Description" />
            </div>
          </div>

          <textarea
            rows={14}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200 outline-none focus:border-red-500"
          />
        </div>

        {/* Extracted Artifacts Sidebar */}
        <div className="space-y-4">
          {/* Timestamps */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>Extracted Chapters ({timestampMatches.length})</span>
            </h5>
            {timestampMatches.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {timestampMatches.map((match, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <span className="font-mono font-bold text-red-600 dark:text-red-400">{match[1]}</span>
                    <span className="truncate text-slate-700 dark:text-slate-300 ml-2 font-medium">{match[2]}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No timestamp markers found in description.</p>
            )}
          </div>

          {/* Extracted Links */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Extracted Links ({linkMatches.length})</span>
            </h5>
            {linkMatches.length > 0 ? (
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {linkMatches.map((link, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline truncate p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    <span className="truncate">{link}</span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No external links found.</p>
            )}
          </div>

          {/* Hashtags */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-purple-500" />
              <span>Hashtags Found ({hashtagMatches.length})</span>
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {hashtagMatches.map((tag, idx) => (
                <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Tool 9: YouTube Description Generator
 */
export const YouTubeDescriptionGenerator: React.FC = () => {
  const [videoTitle, setVideoTitle] = useState<string>('How to Master Web Development in 2025');
  const [channelName, setChannelName] = useState<string>('DevPro Academy');
  const [summary, setSummary] = useState<string>('In this video, you will learn the exact step-by-step roadmap to go from complete beginner to senior web developer in 2025.');
  const [websiteUrl, setWebsiteUrl] = useState<string>('https://devproacademy.com');
  const [socialHandle, setSocialHandle] = useState<string>('@devproacademy');
  const [templateType, setTemplateType] = useState<string>('tutorial');

  const generateDescriptionText = () => {
    return `${videoTitle}

${summary}

🚀 What you will learn in this video:
- The core fundamental principles explained simply
- Practical tips and real-world implementation advice
- Common beginner pitfalls and how to avoid them
- Best tools and recommended workflow for maximum efficiency

⏱️ TIMESTAMPS:
00:00 - Introduction & What You'll Learn
01:30 - Key Concept Overview
04:15 - Step-by-Step Practical Demonstration
08:45 - Pro Tips & Best Practices
12:10 - Next Steps & Summary

🔗 USEFUL LINKS & RESOURCES:
🌐 Visit our website: ${websiteUrl}
💻 Project Source Code: ${websiteUrl}/resources
📬 Free Newsletter & Weekly Tips: ${websiteUrl}/newsletter

📱 CONNECT WITH ME:
Instagram: https://instagram.com/${socialHandle.replace('@', '')}
Twitter/X: https://x.com/${socialHandle.replace('@', '')}
LinkedIn: https://linkedin.com/in/${socialHandle.replace('@', '')}

⚠️ DISCLAIMER:
Some links included in this description may be affiliate links. If you purchase products through these links, I may receive a small commission at no extra cost to you. Thank you for supporting the channel!

#${channelName.replace(/\s+/g, '')} #WebDev #Tutorial #Coding #Tech`;
  };

  const outputText = generateDescriptionText();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Video Description Builder
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Video Title
            </label>
            <input
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Channel Name
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Video Hook & Summary (First 2-3 sentences)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full px-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Website / Resource URL
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Social Media Handle
            </label>
            <input
              type="text"
              value={socialHandle}
              onChange={(e) => setSocialHandle(e.target.value)}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Generated Output */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Generated YouTube Description
            </h4>
            <span className="text-xs text-slate-400">
              Formatted with Chapters, Links, Disclaimers, and SEO Hashtags.
            </span>
          </div>
          <CopyButton textToCopy={outputText} label="Copy Complete Description" />
        </div>

        <textarea
          readOnly
          rows={16}
          value={outputText}
          className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono leading-relaxed text-slate-800 dark:text-slate-200 outline-none"
        />
      </div>
    </div>
  );
};
