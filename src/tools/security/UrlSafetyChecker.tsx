import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

interface SafetyCheck {
  title: string;
  status: 'safe' | 'warning' | 'danger';
  detail: string;
}

export const UrlSafetyChecker: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string>('https://google.com/search?q=toolnova');
  const [analyzed, setAnalyzed] = useState<boolean>(true);

  const analyzeUrl = (input: string): { score: number; checks: SafetyCheck[]; hostname: string; protocol: string } => {
    let clean = input.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }

    try {
      const parsed = new URL(clean);
      const checks: SafetyCheck[] = [];
      let score = 100;

      // Check protocol
      if (parsed.protocol === 'https:') {
        checks.push({ title: 'SSL / HTTPS Encryption', status: 'safe', detail: 'Connection uses secure TLS/SSL encryption.' });
      } else {
        checks.push({ title: 'Insecure Protocol', status: 'danger', detail: 'URL uses plain unencrypted HTTP. Data can be intercepted.' });
        score -= 30;
      }

      // Check IP address hostname
      const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(parsed.hostname);
      if (isIp) {
        checks.push({ title: 'Raw IP Hostname', status: 'danger', detail: 'Domain uses a raw numeric IP address instead of a recognized domain name.' });
        score -= 40;
      } else {
        checks.push({ title: 'Domain Format', status: 'safe', detail: 'Standard qualified domain name structure.' });
      }

      // Check for userinfo / credentials in URL (@ symbol)
      if (clean.includes('@')) {
        checks.push({ title: 'Obfuscated Authority (@)', status: 'danger', detail: 'URL contains "@" symbol, commonly used in phishing to spoof target domains.' });
        score -= 35;
      }

      // Check suspicious subdomains
      const parts = parsed.hostname.split('.');
      if (parts.length > 4) {
        checks.push({ title: 'Excessive Subdomains', status: 'warning', detail: `Domain contains ${parts.length} segments, often used to disguise real domains.` });
        score -= 15;
      }

      // Check suspicious TLDs
      const suspiciousTlds = ['top', 'xyz', 'tk', 'ml', 'ga', 'cf', 'gq', 'fit', 'work', 'click'];
      const tld = parts[parts.length - 1]?.toLowerCase();
      if (suspiciousTlds.includes(tld)) {
        checks.push({ title: 'High-Risk TLD', status: 'warning', detail: `The ".${tld}" top-level domain has statistically higher spam rates.` });
        score -= 15;
      } else {
        checks.push({ title: 'Reputable TLD', status: 'safe', detail: `Standard top-level domain (.${tld}).` });
      }

      // Check URL length
      if (clean.length > 150) {
        checks.push({ title: 'Excessive URL Length', status: 'warning', detail: `URL is ${clean.length} characters long, which may hide suspicious redirects.` });
        score -= 10;
      }

      return {
        score: Math.max(0, score),
        checks,
        hostname: parsed.hostname,
        protocol: parsed.protocol
      };
    } catch {
      return {
        score: 0,
        checks: [{ title: 'Invalid URL Format', status: 'danger', detail: 'Could not parse the provided text as a valid web address.' }],
        hostname: 'Unknown',
        protocol: 'Unknown'
      };
    }
  };

  const results = analyzeUrl(urlInput);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">URL Safety & Phishing Checker</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Analyze URLs for phishing patterns, suspicious redirects, IP hostnames, and risk factors.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="URL Safety Checker"
            resultSummary={`Analyzed ${urlInput} (Safety Score: ${results.score}/100) with ToolNova!`}
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Enter URL to Inspect</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="e.g. https://example.com/login"
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono"
            />
            {urlInput && (
              <button
                type="button"
                onClick={() => setUrlInput('')}
                className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Heuristic Safety Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl sm:text-5xl font-black font-mono ${
                results.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : results.score >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {results.score}
              </span>
              <span className="text-slate-400 font-bold">/ 100</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {results.score >= 80 ? 'Standard low-risk URL indicators.' : results.score >= 50 ? 'Medium risk: review destination carefully.' : 'High risk: suspicious indicators detected.'}
            </p>
          </div>

          <div className="w-full sm:w-auto flex-1 max-w-sm space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Analyzed Domain:</span>
              <span className="font-mono">{results.hostname}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span className="font-semibold">Security Protocol:</span>
              <span className="font-mono uppercase">{results.protocol.replace(':', '')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">Detailed Security Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {results.checks.map((chk, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  {chk.status === 'safe' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {chk.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {chk.status === 'danger' && <ShieldAlert className="w-4 h-4 text-red-500" />}
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-800 dark:text-slate-100">{chk.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{chk.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
