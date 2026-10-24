import React, { useState } from 'react';
import { DollarSign, TrendingUp, HelpCircle, Briefcase, Globe, Sparkles } from 'lucide-react';

/**
 * Tool 14: YouTube Money Calculator (AdSense & Sponsorships)
 */
export const YouTubeMoneyCalculator: React.FC = () => {
  const [dailyViews, setDailyViews] = useState<number>(50000);
  const [nicheCpm, setNicheCpm] = useState<number>(6.5);
  const [monetizedPlaybacksPct, setMonetizedPlaybacksPct] = useState<number>(65); // 65% of views have ads
  const [sponsorEstimate, setSponsorEstimate] = useState<boolean>(true);

  // Niche presets
  const niches = [
    { name: 'Finance & Crypto', cpm: 18.0 },
    { name: 'Tech & Software', cpm: 12.0 },
    { name: 'Business & Marketing', cpm: 14.0 },
    { name: 'Health & Fitness', cpm: 7.5 },
    { name: 'Lifestyle & Vlogs', cpm: 4.5 },
    { name: 'Gaming', cpm: 3.0 },
    { name: 'Entertainment & Comedy', cpm: 3.5 },
  ];

  // AdSense standard split: Creator gets 55%, YouTube keeps 45%
  // RPM = (CPM * monetizedViewsFraction) * 0.55
  const rpm = (nicheCpm * (monetizedPlaybacksPct / 100)) * 0.55;

  const dailyAdRevenue = (dailyViews / 1000) * rpm;
  const monthlyAdRevenue = dailyAdRevenue * 30.4;
  const yearlyAdRevenue = dailyAdRevenue * 365;

  // Sponsorship rate formula based on typical $20-$35 CPM per dedicated sponsor integration
  const monthlyViews = dailyViews * 30.4;
  const sponsorPerVideoRate = Math.round((dailyViews * 2.5 / 1000) * 25);
  const estimatedSponsorshipMonthly = sponsorEstimate ? sponsorPerVideoRate * 4 : 0; // assuming 4 sponsored videos/mo

  return (
    <div className="space-y-6">
      {/* Configuration & Sliders */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-500" />
          Revenue Parameters
        </h4>

        {/* Daily Views Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Daily Video Views</span>
            <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm">
              {dailyViews.toLocaleString()} views/day
            </span>
          </div>
          <input
            type="range"
            min="1000"
            max="1000000"
            step="1000"
            value={dailyViews}
            onChange={(e) => setDailyViews(parseInt(e.target.value))}
            className="w-full accent-red-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>1K</span>
            <span>100K</span>
            <span>500K</span>
            <span>1M views/day</span>
          </div>
        </div>

        {/* Niche Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block">
            Select Niche or Industry (Sets Industry Benchmark CPM)
          </label>
          <div className="flex flex-wrap gap-2">
            {niches.map((n) => (
              <button
                key={n.name}
                onClick={() => setNicheCpm(n.cpm)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  nicheCpm === n.cpm
                    ? 'bg-red-50 text-red-600 border-red-500 dark:bg-red-950/40 dark:text-red-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-white'
                }`}
              >
                {n.name} (${n.cpm} CPM)
              </button>
            ))}
          </div>
        </div>

        {/* CPM & Playback percentage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Gross CPM ($ per 1K impressions)</span>
              <span className="font-bold font-mono">${nicheCpm.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="35.0"
              step="0.5"
              value={nicheCpm}
              onChange={(e) => setNicheCpm(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Monetized Playback Rate</span>
              <span className="font-bold font-mono">{monetizedPlaybacksPct}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              step="5"
              value={monetizedPlaybacksPct}
              onChange={(e) => setMonetizedPlaybacksPct(parseInt(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Earnings Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Estimated Daily Earnings
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">
              ${Math.round(dailyAdRevenue).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">/ day</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Based on calculated RPM of ${rpm.toFixed(2)}
          </p>
        </div>

        {/* Monthly */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-red-500/30 dark:border-red-500/30 shadow-md space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">
            MONTHLY
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Estimated Monthly Earnings
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-red-600 dark:text-red-400">
              ${Math.round(monthlyAdRevenue).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">/ mo</span>
          </div>
          <p className="text-[11px] text-slate-500">
            ~{Math.round(monthlyViews).toLocaleString()} views / month
          </p>
        </div>

        {/* Yearly */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Estimated Yearly Earnings
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              ${Math.round(yearlyAdRevenue).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">/ year</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Annual YouTube AdSense payout
          </p>
        </div>
      </div>

      {/* Brand Sponsorship & Merch Estimator */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-red-500" />
            <span>Brand Deal & Sponsorship Valuation</span>
          </h4>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            ${sponsorPerVideoRate.toLocaleString()} per integrated segment
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          At {dailyViews.toLocaleString()} daily views, brands typically pay between <strong className="text-slate-900 dark:text-slate-100">${Math.round(sponsorPerVideoRate * 0.8).toLocaleString()}</strong> and <strong className="text-slate-900 dark:text-slate-100">${Math.round(sponsorPerVideoRate * 1.3).toLocaleString()}</strong> for a 60-second dedicated mid-roll integration.
        </p>
      </div>
    </div>
  );
};
