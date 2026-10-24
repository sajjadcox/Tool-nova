import React, { useState } from 'react';
import { Search, ExternalLink, Users, Youtube, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

interface ChannelResult {
  name: string;
  handle: string;
  subscribers: string;
  niche: string;
  description: string;
  avatar: string;
}

/**
 * Tool 18: YouTube Channel Search & Competitor Discovery
 */
export const YouTubeChannelSearch: React.FC = () => {
  const [query, setQuery] = useState<string>('web development coding');
  const [filterType, setFilterType] = useState<string>('all');

  const popularChannels: ChannelResult[] = [
    {
      name: 'freeCodeCamp.org',
      handle: '@freecodecamp',
      subscribers: '10.2M',
      niche: 'Education & Tech',
      description: 'Learn to code for free. Build projects. Earn certifications. Since 2014.',
      avatar: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Fireship',
      handle: '@Fireship',
      subscribers: '3.3M',
      niche: 'Tech & Code',
      description: 'High-intensity code tutorials and tech news to help you ship apps faster.',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Traversy Media',
      handle: '@TraversyMedia',
      subscribers: '2.2M',
      niche: 'Web Development',
      description: 'Practical tutorials on HTML, CSS, JavaScript, React, Node.js, Python and modern frameworks.',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Kevin Powell',
      handle: '@KevinPowell',
      subscribers: '980K',
      niche: 'CSS & Design',
      description: 'Helping you learn how to make the web, and make it look good with modern CSS.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Web Dev Simplified',
      handle: '@WebDevSimplified',
      subscribers: '1.6M',
      niche: 'Web Development',
      description: 'Web Dev Simplified is all about teaching you web development in a clean, straightforward way.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAg%253D%253D`; // sp parameter filters strictly for channels

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-500" />
          Search & Discover YouTube Channels
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic, keyword, or creator name..."
              className="w-full pl-10 pr-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          <a
            href={youtubeSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0"
          >
            <span>Search Channels on YouTube</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-xs text-slate-500">
          The button automatically applies YouTube's channel-only filter flag so you view creator accounts instead of individual videos.
        </p>
      </div>

      {/* Featured / Benchmark Creators */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-red-500" />
            <span>Top Featured Channels in this Niche</span>
          </h4>
          <span className="text-xs text-slate-400">Competitor benchmark directory</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {popularChannels.map((c, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex gap-4 items-start hover:border-red-500/40 transition-colors"
            >
              <img
                src={c.avatar}
                alt={c.name}
                className="w-12 h-12 rounded-full object-cover shrink-0 bg-slate-200"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                    {c.name}
                  </h5>
                  <span className="text-[11px] font-bold text-slate-500 font-mono">
                    {c.subscribers}
                  </span>
                </div>
                <p className="text-xs text-red-600 dark:text-red-400 font-mono font-medium">
                  {c.handle}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {c.description}
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`https://www.youtube.com/${c.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1"
                  >
                    <span>View Channel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
