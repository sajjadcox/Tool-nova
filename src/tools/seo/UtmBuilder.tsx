import React, { useState } from 'react';
import { Share2, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const UtmBuilder: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState<string>('https://toolnova.dev');
  const [source, setSource] = useState<string>('newsletter');
  const [medium, setMedium] = useState<string>('email');
  const [campaign, setCampaign] = useState<string>('launch_promo');
  const [term, setTerm] = useState<string>('web_tools');
  const [content, setContent] = useState<string>('cta_button');

  const buildUrl = () => {
    try {
      if (!baseUrl.trim()) return '';
      const parsed = new URL(baseUrl.trim());
      if (source.trim()) parsed.searchParams.set('utm_source', source.trim());
      if (medium.trim()) parsed.searchParams.set('utm_medium', medium.trim());
      if (campaign.trim()) parsed.searchParams.set('utm_campaign', campaign.trim());
      if (term.trim()) parsed.searchParams.set('utm_term', term.trim());
      if (content.trim()) parsed.searchParams.set('utm_content', content.trim());
      return parsed.toString();
    } catch {
      return baseUrl;
    }
  };

  const finalUrl = buildUrl();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 text-xs font-semibold">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-1">Website URL *</label>
          <input
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Campaign Source (utm_source) *</label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g. google, newsletter, twitter"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Campaign Medium (utm_medium) *</label>
            <input
              type="text"
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="e.g. cpc, banner, email"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Campaign Name (utm_campaign) *</label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="e.g. spring_sale, brand_awareness"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 mb-1">Campaign Term (utm_term)</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="e.g. running+shoes"
              className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 mb-1">Campaign Content (utm_content)</label>
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="e.g. logolink, textlink"
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 flex items-center justify-between gap-4">
        <div className="overflow-hidden">
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Generated Campaign Tracking URL</span>
          <span className="text-xs font-bold font-mono text-teal-600 dark:text-teal-400 truncate block">
            {finalUrl}
          </span>
        </div>
        <CopyButton textToCopy={finalUrl} label="Copy URL" />
      </div>
    </div>
  );
};
