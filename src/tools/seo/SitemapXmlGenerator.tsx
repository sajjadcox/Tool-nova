import React, { useState } from 'react';
import { FileCode, Download, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { DownloadButton } from '../../components/common/DownloadButton';

export const SitemapXmlGenerator: React.FC = () => {
  const [urls, setUrls] = useState<string>(
    'https://toolnova.dev/\nhttps://toolnova.dev/tools\nhttps://toolnova.dev/categories\nhttps://toolnova.dev/popular'
  );
  const [frequency, setFrequency] = useState<string>('weekly');
  const [priority, setPriority] = useState<string>('0.8');

  const generateXml = () => {
    const list = urls.split('\n').map(u => u.trim()).filter(u => u.length > 0);
    const dateStr = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    list.forEach(url => {
      xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${dateStr}</lastmod>\n    <changefreq>${frequency}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  };

  const output = generateXml();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              List of URLs (One per line)
            </label>
            <textarea
              rows={8}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="w-full p-3 text-xs font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Change Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">Default Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              >
                <option value="1.0">1.0 (Highest)</option>
                <option value="0.8">0.8 (High)</option>
                <option value="0.5">0.5 (Default)</option>
                <option value="0.3">0.3 (Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-700 dark:text-teal-400">Generated XML Sitemap</label>
            <div className="flex items-center gap-2">
              <CopyButton textToCopy={output} />
              <DownloadButton
                filename="sitemap.xml"
                content={output}
                mimeType="application/xml"
                label="Download sitemap.xml"
              />
            </div>
          </div>
          <textarea
            rows={14}
            readOnly
            value={output}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
