import React, { useState } from 'react';
import { Flame, TrendingUp, Search, ExternalLink, Sparkles, Filter, Globe } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

interface TrendItem {
  query: string;
  category: string;
  growth: string;
  volume: string;
  difficulty: 'Low' | 'Medium' | 'High';
  hookIdea: string;
}

/**
 * Tool 1: YouTube Trend Explorer & Viral Topic Radar
 */
export const YouTubeTrendFinder: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [country, setCountry] = useState<string>('US');

  const trendsData: TrendItem[] = [
    {
      query: 'AI Coding Tools 2025',
      category: 'Tech & AI',
      growth: '+420%',
      volume: '850K/mo',
      difficulty: 'Medium',
      hookIdea: 'I let AI code my entire app in 10 minutes without writing a single line...'
    },
    {
      query: 'Passive Income Strategies for Beginners',
      category: 'Finance',
      growth: '+180%',
      volume: '1.2M/mo',
      difficulty: 'High',
      hookIdea: '7 Passive income ideas that actually work in 2025 (Not dropshipping)'
    },
    {
      query: 'Morning Routine for High Dopamine',
      category: 'Lifestyle',
      growth: '+290%',
      volume: '620K/mo',
      difficulty: 'Low',
      hookIdea: 'The 15-minute morning routine that changed my productivity forever'
    },
    {
      query: 'GTA 6 Gameplay Breakdown & Secrets',
      category: 'Gaming',
      growth: '+650%',
      volume: '3.4M/mo',
      difficulty: 'High',
      hookIdea: '10 Hidden details everyone missed in the latest teaser trailer'
    },
    {
      query: 'Clean Architecture with React & TypeScript',
      category: 'Tech & AI',
      growth: '+140%',
      volume: '320K/mo',
      difficulty: 'Low',
      hookIdea: 'Stop writing spaghetti code: senior frontend architecture explained in 8 minutes'
    },
    {
      query: 'High Protein Meal Prep Under $20',
      category: 'Fitness & Food',
      growth: '+210%',
      volume: '940K/mo',
      difficulty: 'Low',
      hookIdea: 'How I meal prep 5 days of 150g protein meals for less than $20'
    },
    {
      query: 'Quantum Computing Explained Simply',
      category: 'Education',
      growth: '+160%',
      volume: '450K/mo',
      difficulty: 'Medium',
      hookIdea: 'Quantum computing explained to a 5-year-old, a teenager, and a computer scientist'
    },
    {
      query: 'Cyberpunk 2077 Best Builds 2025',
      category: 'Gaming',
      growth: '+95%',
      volume: '580K/mo',
      difficulty: 'Medium',
      hookIdea: 'The most overpowered stealth build that breaks the entire game'
    },
    {
      query: 'Zero to $10,000/Month Freelancing',
      category: 'Finance',
      growth: '+310%',
      volume: '710K/mo',
      difficulty: 'High',
      hookIdea: 'If I had to start over with $0 and no skills, here is my day 1 to day 30 plan'
    }
  ];

  const categories = ['All', 'Tech & AI', 'Finance', 'Lifestyle', 'Gaming', 'Fitness & Food', 'Education'];

  const filteredTrends = trendsData.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.query.toLowerCase().includes(searchFilter.toLowerCase()) ||
                          item.hookIdea.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Category Filter */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500" />
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              YouTube Viral Topic & Search Trend Radar
            </h4>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search topics or keywords..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-900 dark:text-slate-100"
              />
            </div>

            <a
              href="https://trends.google.com/trends/explore?gprop=youtube"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <span>Google Trends</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white border-red-600 shadow-xs'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Trends Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrends.map((t, idx) => (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 transition-all flex flex-col justify-between space-y-4 shadow-xs"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {t.category}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400 font-mono">
                  {t.growth} surge
                </span>
              </div>

              <h5 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                {t.query}
              </h5>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 italic">
                "{t.hookIdea}"
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Est. Search Volume: <strong className="text-slate-800 dark:text-slate-200">{t.volume}</strong></span>
                <span>Competition: <strong className={t.difficulty === 'Low' ? 'text-emerald-500' : 'text-amber-500'}>{t.difficulty}</strong></span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <CopyButton textToCopy={t.query} label="Copy Keyword" />
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(t.query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  <span>Search on YouTube</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
