import React, { useState } from 'react';
import { Bot, Copy, Download } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { DownloadButton } from '../../components/common/DownloadButton';

export const RobotsTxtGenerator: React.FC = () => {
  const [allowAll, setAllowAll] = useState<boolean>(true);
  const [crawlDelay, setCrawlDelay] = useState<string>('0');
  const [sitemapUrl, setSitemapUrl] = useState<string>('https://toolnova.dev/sitemap.xml');
  const [disallowedPaths, setDisallowedPaths] = useState<string>('/api/\n/admin/\n/checkout/');

  const generateRobotsTxt = () => {
    let content = 'User-agent: *\n';
    if (allowAll) {
      content += 'Allow: /\n';
    }

    const paths = disallowedPaths
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    paths.forEach(p => {
      content += `Disallow: ${p}\n`;
    });

    if (parseInt(crawlDelay) > 0) {
      content += `Crawl-delay: ${crawlDelay}\n`;
    }

    if (sitemapUrl.trim()) {
      content += `\nSitemap: ${sitemapUrl.trim()}\n`;
    }

    return content;
  };

  const output = generateRobotsTxt();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={allowAll}
              onChange={(e) => setAllowAll(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500"
            />
            <span>Allow All Search Engine Spiders by default (Allow: /)</span>
          </label>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Disallowed Directories / Paths (One per line)
            </label>
            <textarea
              rows={4}
              value={disallowedPaths}
              onChange={(e) => setDisallowedPaths(e.target.value)}
              className="w-full p-3 text-xs font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Sitemap.xml URL
            </label>
            <input
              type="url"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-700 dark:text-teal-400">Generated robots.txt</label>
            <div className="flex items-center gap-2">
              <CopyButton textToCopy={output} />
              <DownloadButton
                filename="robots.txt"
                content={output}
                label="Download robots.txt"
              />
            </div>
          </div>
          <textarea
            rows={12}
            readOnly
            value={output}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
