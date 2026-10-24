import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Server, Download } from 'lucide-react';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const RedirectRuleGenerator: React.FC = () => {
  const [sourcePath, setSourcePath] = useState<string>('/old-blog-post');
  const [targetUrl, setTargetUrl] = useState<string>('/blog/new-guide');
  const [redirectType, setRedirectType] = useState<'301' | '302'>('301');
  const [serverType, setServerType] = useState<'apache' | 'nginx' | 'netlify' | 'vercel'>('apache');
  const [copied, setCopied] = useState<boolean>(false);

  const generateRule = () => {
    const src = sourcePath.trim();
    const dst = targetUrl.trim();
    const is301 = redirectType === '301';

    switch (serverType) {
      case 'apache':
        return `# Apache .htaccess redirect\nRedirect ${is301 ? '301' : '302'} ${src} ${dst}`;
      case 'nginx':
        return `# Nginx server block redirect\nrewrite ^${src}$ ${dst} ${is301 ? 'permanent' : 'redirect'};`;
      case 'netlify':
        return `# Netlify _redirects file\n${src}  ${dst}  ${is301 ? '301' : '302'}`;
      case 'vercel':
        return `// vercel.json configuration\n{\n  "redirects": [\n    {\n      "source": "${src}",\n      "destination": "${dst}",\n      "permanent": ${is301}\n    }\n  ]\n}`;
      default:
        return '';
    }
  };

  const ruleOutput = generateRule();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(ruleOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">301 & 302 Redirect Rule Generator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Create clean redirect syntax for Apache, Nginx, Netlify, and Vercel.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Redirect Rule Generator"
            resultSummary="Generated 301/302 redirects with ToolNova!"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Old URL / Source Path</label>
            <input
              type="text"
              value={sourcePath}
              onChange={(e) => setSourcePath(e.target.value)}
              placeholder="/old-path"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">New URL / Destination</label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="/new-path"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Redirect Type</label>
            <select
              value={redirectType}
              onChange={(e) => setRedirectType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
            >
              <option value="301">301 - Permanent (Transfers SEO authority)</option>
              <option value="302">302 - Temporary (Temporary move)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Server / Platform</label>
            <select
              value={serverType}
              onChange={(e) => setServerType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
            >
              <option value="apache">Apache (.htaccess)</option>
              <option value="nginx">Nginx (nginx.conf)</option>
              <option value="netlify">Netlify (_redirects)</option>
              <option value="vercel">Vercel (vercel.json)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Generated Configuration Syntax</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Syntax'}</span>
            </button>
          </div>
          <textarea
            readOnly
            rows={6}
            value={ruleOutput}
            className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
