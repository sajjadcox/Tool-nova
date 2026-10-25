import React, { useState } from 'react';
import { Globe, Download, Copy, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

interface UrlEntry {
  id: string;
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const XmlSitemapGenerator: React.FC = () => {
  const [urls, setUrls] = useState<UrlEntry[]>([
    { id: '1', loc: 'https://example.com/', lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: '1.0' },
    { id: '2', loc: 'https://example.com/about', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.8' },
    { id: '3', loc: 'https://example.com/contact', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.7' },
  ]);

  const [bulkInput, setBulkInput] = useState<string>('');

  const addUrl = () => {
    setUrls(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        loc: 'https://example.com/new-page',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.8'
      }
    ]);
  };

  const removeUrl = (id: string) => {
    setUrls(prev => prev.filter(u => u.id !== id));
  };

  const updateUrl = (id: string, field: keyof UrlEntry, val: string) => {
    setUrls(prev => prev.map(u => u.id === id ? { ...u, [field]: val } : u));
  };

  const handleBulkAdd = () => {
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;
    const newItems: UrlEntry[] = lines.map(l => ({
      id: Math.random().toString(),
      loc: l.startsWith('http') ? l : `https://${l}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.8'
    }));
    setUrls(prev => [...prev, ...newItems]);
    setBulkInput('');
  };

  const generateXml = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    urls.forEach(u => {
      xml += `  <url>\n`;
      xml += `    <loc>${u.loc.replace(/&/g, '&amp;')}</loc>\n`;
      xml += `    <lastmod>${u.lastmod}</lastmod>\n`;
      xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
      xml += `    <priority>${u.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;
    return xml;
  };

  const xmlContent = generateXml();

  const handleDownload = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>XML Sitemap Generator</span>
          </h3>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download sitemap.xml</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-4">
            {/* Quick Bulk Import */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Bulk Paste URLs (One per line):
              </label>
              <textarea
                rows={3}
                value={bulkInput}
                onChange={(e) => setBulkInput(e.target.value)}
                placeholder="https://example.com/products&#10;https://example.com/blog"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs"
              />
              <button
                type="button"
                onClick={handleBulkAdd}
                className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold text-xs"
              >
                Add URLs to List
              </button>
            </div>

            {/* Individual Entries */}
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {urls.map((u) => (
                <div key={u.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    value={u.loc}
                    onChange={(e) => updateUrl(u.id, 'loc', e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                  />
                  <select
                    value={u.changefreq}
                    onChange={(e) => updateUrl(u.id, 'changefreq', e.target.value)}
                    className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value="daily">daily</option>
                    <option value="weekly">weekly</option>
                    <option value="monthly">monthly</option>
                    <option value="yearly">yearly</option>
                  </select>
                  <select
                    value={u.priority}
                    onChange={(e) => updateUrl(u.id, 'priority', e.target.value)}
                    className="w-16 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  >
                    <option value="1.0">1.0</option>
                    <option value="0.9">0.9</option>
                    <option value="0.8">0.8</option>
                    <option value="0.7">0.7</option>
                    <option value="0.5">0.5</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeUrl(u.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addUrl}
              className="w-full py-2 rounded-xl border border-dashed border-teal-500/50 text-teal-600 font-bold text-xs hover:bg-teal-50/20 flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Another URL</span>
            </button>
          </div>

          {/* XML Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Generated XML Code ({urls.length} URLs):
              </span>
              <CopyButton textToCopy={xmlContent} label="Copy XML" />
            </div>
            <pre className="p-4 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs h-96 overflow-y-auto leading-relaxed border border-slate-800">
              {xmlContent}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
