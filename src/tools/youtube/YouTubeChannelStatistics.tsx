import React, { useState } from 'react';
import { Users, Video, Eye, Award, Target, CheckCircle2, TrendingUp } from 'lucide-react';

/**
 * Tool 13: YouTube Channel Statistics & Benchmark Tracker
 */
export const YouTubeChannelStatistics: React.FC = () => {
  const [subscribers, setSubscribers] = useState<number>(45000);
  const [totalViews, setTotalViews] = useState<number>(3800000);
  const [videoCount, setVideoCount] = useState<number>(120);
  const [uploadFreqWeekly, setUploadFreqWeekly] = useState<number>(2);

  const avgViewsPerVideo = videoCount > 0 ? Math.round(totalViews / videoCount) : 0;
  const viewsPerSubscriber = subscribers > 0 ? (totalViews / subscribers).toFixed(1) : '0';

  // Next Play Button Milestone
  const milestones = [
    { target: 1000, name: 'YouTube Partner Program (1K Subs)', reward: 'Monetization Unlock' },
    { target: 10000, name: '10K Community Tab', reward: 'Merch Shelf & Community' },
    { target: 100000, name: 'Silver Creator Award (100K Subs)', reward: 'Silver Play Button' },
    { target: 1000000, name: 'Gold Creator Award (1M Subs)', reward: 'Gold Play Button' },
    { target: 10000000, name: 'Diamond Creator Award (10M Subs)', reward: 'Diamond Play Button' },
  ];

  const nextMilestone = milestones.find(m => m.target > subscribers) || milestones[milestones.length - 1];
  const subsRemaining = Math.max(0, nextMilestone.target - subscribers);
  const progressPercent = Math.min(100, Math.max(0, (subscribers / nextMilestone.target) * 100));

  // Channel Tier
  const getChannelTier = () => {
    if (subscribers >= 1000000) return { name: 'Mega Creator', color: 'text-amber-500' };
    if (subscribers >= 100000) return { name: 'Macro Creator', color: 'text-purple-500' };
    if (subscribers >= 10000) return { name: 'Mid-Tier Creator', color: 'text-blue-500' };
    if (subscribers >= 1000) return { name: 'Micro Creator', color: 'text-emerald-500' };
    return { name: 'Nano Creator', color: 'text-slate-500' };
  };

  const tier = getChannelTier();

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Users className="w-4 h-4 text-red-500" />
          Enter Channel Benchmarks
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Subscribers</label>
            <input
              type="number"
              min="0"
              value={subscribers}
              onChange={(e) => setSubscribers(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Lifetime Channel Views</label>
            <input
              type="number"
              min="0"
              value={totalViews}
              onChange={(e) => setTotalViews(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Public Videos</label>
            <input
              type="number"
              min="1"
              value={videoCount}
              onChange={(e) => setVideoCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Uploads Per Week</label>
            <input
              type="number"
              min="1"
              max="14"
              value={uploadFreqWeekly}
              onChange={(e) => setUploadFreqWeekly(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Average Views / Video</span>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {avgViewsPerVideo.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Based on {videoCount} uploads</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Views to Sub Ratio</span>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {viewsPerSubscriber}x
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Audience multiplier</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Creator Tier</span>
          <div className="my-2">
            <span className={`text-2xl font-black ${tier.color}`}>
              {tier.name}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">Industry classification</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Annual Content Target</span>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">
              ~{uploadFreqWeekly * 52}
            </span>
          </div>
          <span className="text-[11px] text-slate-400">{uploadFreqWeekly} videos weekly</span>
        </div>
      </div>

      {/* Play Button Milestone Progress Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                Next Milestone: {nextMilestone.name}
              </h4>
              <p className="text-xs text-slate-500">Reward: {nextMilestone.reward}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-red-600 dark:text-red-400">
            {subsRemaining.toLocaleString()} subscribers needed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>{subscribers.toLocaleString()}</span>
            <span>{progressPercent.toFixed(1)}%</span>
            <span>{nextMilestone.target.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
