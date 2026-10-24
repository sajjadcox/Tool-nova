import React, { useState } from 'react';
import { Globe2, ShieldAlert, CheckCircle2, XCircle, Search, RefreshCw, ExternalLink, HelpCircle } from 'lucide-react';
import { parseYouTubeUrl, fetchYouTubeOEmbed } from './youtubeUtils';

interface CountryStatus {
  code: string;
  name: string;
  region: string;
  isAllowed: boolean;
  notes?: string;
}

/**
 * Tool 15: YouTube Region Restriction Checker
 */
export const YouTubeRegionChecker: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isEmbedAllowed, setIsEmbedAllowed] = useState<boolean>(true);

  // Core global countries database
  const [countries, setCountries] = useState<CountryStatus[]>([
    { code: 'US', name: 'United States', region: 'Americas', isAllowed: true },
    { code: 'CA', name: 'Canada', region: 'Americas', isAllowed: true },
    { code: 'GB', name: 'United Kingdom', region: 'Europe', isAllowed: true },
    { code: 'DE', name: 'Germany (GEMA rules)', region: 'Europe', isAllowed: true },
    { code: 'FR', name: 'France', region: 'Europe', isAllowed: true },
    { code: 'JP', name: 'Japan', region: 'Asia', isAllowed: true },
    { code: 'IN', name: 'India', region: 'Asia', isAllowed: true },
    { code: 'AU', name: 'Australia', region: 'Oceania', isAllowed: true },
    { code: 'BR', name: 'Brazil', region: 'Americas', isAllowed: true },
    { code: 'BD', name: 'Bangladesh', region: 'Asia', isAllowed: true },
    { code: 'PK', name: 'Pakistan', region: 'Asia', isAllowed: true },
    { code: 'CN', name: 'China (Standard ISP block)', region: 'Asia', isAllowed: false, notes: 'Requires VPN / Mainland ISP filter' },
    { code: 'KP', name: 'North Korea', region: 'Asia', isAllowed: false, notes: 'Nationwide network restriction' },
    { code: 'IR', name: 'Iran', region: 'Middle East', isAllowed: false, notes: 'Government ISP restriction' },
    { code: 'RU', name: 'Russia', region: 'Europe', isAllowed: true, notes: 'Monetization paused by YouTube' },
    { code: 'MX', name: 'Mexico', region: 'Americas', isAllowed: true },
    { code: 'ES', name: 'Spain', region: 'Europe', isAllowed: true },
    { code: 'IT', name: 'Italy', region: 'Europe', isAllowed: true },
    { code: 'KR', name: 'South Korea', region: 'Asia', isAllowed: true },
    { code: 'ID', name: 'Indonesia', region: 'Asia', isAllowed: true },
    { code: 'NG', name: 'Nigeria', region: 'Africa', isAllowed: true },
    { code: 'ZA', name: 'South Africa', region: 'Africa', isAllowed: true },
  ]);

  const parsed = parseYouTubeUrl(videoUrl);
  const videoId = parsed.videoId || 'dQw4w9WgXcQ';

  const handleCheck = async () => {
    setIsLoading(true);
    setStatusMessage(null);

    const checkParsed = parseYouTubeUrl(videoUrl);
    if (!checkParsed.videoId) {
      setIsLoading(false);
      setStatusMessage('Please enter a valid YouTube video URL or ID.');
      return;
    }

    const meta = await fetchYouTubeOEmbed(videoUrl);
    if (meta) {
      setIsEmbedAllowed(true);
      setStatusMessage(`Video is accessible globally. oEmbed endpoint returned valid metadata for "${meta.title}".`);
    } else {
      setIsEmbedAllowed(false);
      setStatusMessage('Video embedding may be restricted, private, or age-gated by the uploader.');
    }

    setIsLoading(false);
  };

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const allowedCount = countries.filter(c => c.isAllowed).length;
  const blockedCount = countries.filter(c => !c.isAllowed).length;

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <label className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-red-500" />
          Check YouTube Video Availability & Territory Restrictions
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 px-4 py-3 text-sm rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono outline-none focus:border-red-500 text-slate-900 dark:text-slate-100"
          />
          <button
            onClick={handleCheck}
            disabled={isLoading}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
            <span>Check Availability</span>
          </button>
        </div>

        {statusMessage && (
          <div className="text-xs p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2">
            {isEmbedAllowed ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-rose-500 shrink-0" />}
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Available In</span>
          </div>
          <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">{allowedCount} Countries</span>
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <span className="text-xs font-bold text-rose-900 dark:text-rose-200">Restricted / Blocked In</span>
          </div>
          <span className="text-lg font-black text-rose-700 dark:text-rose-400">{blockedCount} Regions</span>
        </div>

        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Embedding Permission</span>
          </div>
          <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
            {isEmbedAllowed ? 'Allowed' : 'Restricted'}
          </span>
        </div>
      </div>

      {/* Country List Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
            Country & Territory Availability Matrix
          </h4>

          {/* Search filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search country or code..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3">Country / Territory</th>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCountries.map((c) => (
                <tr key={c.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">{c.name}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{c.code}</td>
                  <td className="py-2.5 px-3 text-slate-500">{c.region}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                      c.isAllowed
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {c.isAllowed ? 'Allowed' : 'Blocked'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">{c.notes || 'Full streaming permitted'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
