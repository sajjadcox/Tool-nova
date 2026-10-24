import React, { useState } from 'react';
import { Server, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const HttpHeaderAnalyzer: React.FC = () => {
  const [headers, setHeaders] = useState<string>(
    `HTTP/2 200 OK\ncontent-type: text/html; charset=UTF-8\ncache-control: public, max-age=31536000, immutable\ncontent-encoding: gzip\nvary: Accept-Encoding\nlink: <https://toolnova.app/>; rel="canonical"`
  );

  const analyze = () => {
    const lines = headers.split('\n');
    const map = new Map<string, string>();
    lines.forEach(l => {
      const idx = l.indexOf(':');
      if (idx > -1) {
        map.set(l.slice(0, idx).trim().toLowerCase(), l.slice(idx + 1).trim());
      }
    });

    const hasCache = map.has('cache-control');
    const hasEncoding = map.has('content-encoding');
    const hasVary = map.has('vary');
    const hasCanonical = map.has('link') && (map.get('link')?.includes('canonical') ?? false);

    return [
      { name: 'Cache-Control (Performance)', status: hasCache ? 'good' : 'bad', val: map.get('cache-control') || 'Missing (browser may not cache page efficiently)' },
      { name: 'Compression (Gzip / Brotli)', status: hasEncoding ? 'good' : 'warning', val: map.get('content-encoding') || 'Uncompressed response' },
      { name: 'Vary Header (CDN & Proxy caching)', status: hasVary ? 'good' : 'warning', val: map.get('vary') || 'Missing Vary header' },
      { name: 'HTTP Link Canonical Header', status: hasCanonical ? 'good' : 'neutral', val: hasCanonical ? map.get('link') : 'Not passed via HTTP header' },
    ];
  };

  const results = analyze();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">HTTP Response Header Analyzer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Inspect HTTP performance, caching headers, and canonical link headers.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="HTTP Header Analyzer"
            resultSummary="Analyzed HTTP headers for SEO & caching with ToolNova!"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Raw Response Headers</label>
          <textarea
            rows={5}
            value={headers}
            onChange={(e) => setHeaders(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">SEO & Caching Audit</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.map((r, i) => (
              <div key={i} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <div className="flex items-center gap-2">
                  {r.status === 'good' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {r.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {r.status === 'bad' && <AlertTriangle className="w-4 h-4 text-red-500" />}
                  {r.status === 'neutral' && <ShieldCheck className="w-4 h-4 text-slate-400" />}
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-100">{r.name}</span>
                </div>
                <p className="text-xs font-mono text-slate-600 dark:text-slate-300 mt-1 truncate">
                  {r.val}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
