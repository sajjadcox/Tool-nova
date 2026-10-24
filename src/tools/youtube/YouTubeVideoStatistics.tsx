import React, { useState } from 'react';
import { BarChart3, TrendingUp, ThumbsUp, MessageSquare, Eye, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { parseYouTubeUrl } from './youtubeUtils';

/**
 * Tool 12: YouTube Video Statistics & Performance Audit
 */
export const YouTubeVideoStatistics: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [views, setViews] = useState<number>(1450000);
  const [likes, setLikes] = useState<number>(75000);
  const [comments, setComments] = useState<number>(12400);
  const [durationMinutes, setDurationMinutes] = useState<number>(12);
  const [daysSinceUpload, setDaysSinceUpload] = useState<number>(14);

  // Calculations
  const engagementTotal = likes + comments;
  const engagementRate = views > 0 ? (engagementTotal / views) * 100 : 0;
  const likeToViewRatio = views > 0 ? (likes / views) * 100 : 0;
  const commentToViewRatio = views > 0 ? (comments / views) * 100 : 0;
  const viewsPerDay = daysSinceUpload > 0 ? Math.round(views / daysSinceUpload) : views;

  // Rating
  const getRating = () => {
    if (engagementRate >= 5) return { grade: 'A+', label: 'Viral / Exceptional Engagement', color: 'text-emerald-500' };
    if (engagementRate >= 3) return { grade: 'A', label: 'High Performer (Above Average)', color: 'text-teal-500' };
    if (engagementRate >= 1.5) return { grade: 'B', label: 'Solid Average Performance', color: 'text-blue-500' };
    return { grade: 'C', label: 'Below Average Engagement', color: 'text-amber-500' };
  };

  const rating = getRating();

  return (
    <div className="space-y-6">
      {/* Video URL & Metrics Inputs */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-red-500" />
          Video Metrics Audit
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Views</label>
            <input
              type="number"
              min="0"
              value={views}
              onChange={(e) => setViews(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Likes</label>
            <input
              type="number"
              min="0"
              value={likes}
              onChange={(e) => setLikes(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Comments</label>
            <input
              type="number"
              min="0"
              value={comments}
              onChange={(e) => setComments(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Video Duration (min)</label>
            <input
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Days Since Upload</label>
            <input
              type="number"
              min="1"
              value={daysSinceUpload}
              onChange={(e) => setDaysSinceUpload(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-bold"
            />
          </div>
        </div>
      </div>

      {/* Main Scorecard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-red-500" />
            <span>Engagement Rate</span>
          </span>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {engagementRate.toFixed(2)}%
            </span>
          </div>
          <span className="text-xs text-slate-500">Benchmark: 2.0% - 4.5%</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Like-to-View</span>
          </span>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {likeToViewRatio.toFixed(2)}%
            </span>
          </div>
          <span className="text-xs text-slate-500">1 like per ~{Math.round(100 / (likeToViewRatio || 1))} views</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
            <span>Comment Rate</span>
          </span>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              {commentToViewRatio.toFixed(2)}%
            </span>
          </div>
          <span className="text-xs text-slate-500">1 comment per ~{Math.round(100 / (commentToViewRatio || 1))} views</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Velocity Score</span>
          </span>
          <div className="my-2 flex items-baseline gap-2">
            <span className={`text-3xl font-black ${rating.color}`}>
              {rating.grade}
            </span>
            <span className="text-xs font-semibold text-slate-500">{viewsPerDay.toLocaleString()} views/day</span>
          </div>
          <span className="text-[11px] text-slate-500 truncate">{rating.label}</span>
        </div>
      </div>

      {/* SEO & Optimization Audit */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
          Algorithm Optimization Checklist
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Mid-Roll Ad Eligibility</span>
              <span className="text-slate-500">
                {durationMinutes >= 8 ? 'Eligible for multiple mid-roll monetization ads (Video is >= 8 minutes).' : 'Under 8 minutes. Only pre-roll and post-roll ads supported.'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Community Engagement</span>
              <span className="text-slate-500">
                Pinned comment & hearting first 20 comments boosts YouTube algorithm comment velocity by 40%.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
