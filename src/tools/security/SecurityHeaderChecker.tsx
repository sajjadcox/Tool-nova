import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

interface HeaderRule {
  header: string;
  name: string;
  description: string;
  recommendation: string;
}

const SECURITY_HEADERS: HeaderRule[] = [
  {
    header: 'strict-transport-security',
    name: 'Strict-Transport-Security (HSTS)',
    description: 'Enforces secure HTTPS connections and blocks protocol downgrades.',
    recommendation: 'max-age=31536000; includeSubDomains; preload'
  },
  {
    header: 'content-security-policy',
    name: 'Content-Security-Policy (CSP)',
    description: 'Prevents Cross-Site Scripting (XSS) and arbitrary resource injection.',
    recommendation: "default-src 'self'; script-src 'self' 'nonce-...'"
  },
  {
    header: 'x-frame-options',
    name: 'X-Frame-Options',
    description: 'Defends against UI redress attacks and clickjacking in iframes.',
    recommendation: 'DENY or SAMEORIGIN'
  },
  {
    header: 'x-content-type-options',
    name: 'X-Content-Type-Options',
    description: 'Blocks MIME type sniffing vulnerabilities.',
    recommendation: 'nosniff'
  },
  {
    header: 'referrer-policy',
    name: 'Referrer-Policy',
    description: 'Controls referrer information leaked on outbound navigation.',
    recommendation: 'strict-origin-when-cross-origin'
  },
  {
    header: 'permissions-policy',
    name: 'Permissions-Policy',
    description: 'Restricts camera, microphone, and geolocation device APIs.',
    recommendation: 'geolocation=(), camera=(), microphone=()'
  }
];

export const SecurityHeaderChecker: React.FC = () => {
  const [headersText, setHeadersText] = useState<string>(
    `HTTP/2 200 OK\nstrict-transport-security: max-age=31536000; includeSubDomains\nx-content-type-options: nosniff\nx-frame-options: SAMEORIGIN\nreferrer-policy: strict-origin-when-cross-origin\ncontent-type: text/html; charset=UTF-8`
  );

  const analyzeHeaders = () => {
    const lines = headersText.split('\n');
    const headerMap = new Map<string, string>();

    lines.forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim().toLowerCase();
        const value = parts.slice(1).join(':').trim();
        headerMap.set(key, value);
      }
    });

    let passedCount = 0;
    const results = SECURITY_HEADERS.map(rule => {
      const foundValue = headerMap.get(rule.header);
      const isPresent = !!foundValue;
      if (isPresent) passedCount++;
      return {
        ...rule,
        present: isPresent,
        value: foundValue || 'Missing'
      };
    });

    const percent = Math.round((passedCount / SECURITY_HEADERS.length) * 100);
    let grade = 'F';
    if (percent === 100) grade = 'A+';
    else if (percent >= 80) grade = 'A';
    else if (percent >= 60) grade = 'B';
    else if (percent >= 40) grade = 'C';
    else if (percent >= 20) grade = 'D';

    return { results, grade, passedCount, total: SECURITY_HEADERS.length, percent };
  };

  const analysis = analyzeHeaders();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">HTTP Security Header Analyzer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Audit CSP, HSTS, X-Frame-Options, and security headers against OWASP benchmarks.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Security Header Checker"
            resultSummary={`Security Header Grade: ${analysis.grade} (${analysis.passedCount}/${analysis.total} headers verified) on ToolNova!`}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Paste HTTP Response Headers</label>
            <button
              type="button"
              onClick={() => setHeadersText('')}
              className="text-xs text-slate-500 hover:text-red-500"
            >
              Clear
            </button>
          </div>
          <textarea
            rows={5}
            value={headersText}
            onChange={(e) => setHeadersText(e.target.value)}
            placeholder="Paste raw HTTP response headers here..."
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-3xl font-mono ${
              analysis.grade.startsWith('A')
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                : analysis.grade === 'B'
                ? 'bg-teal-100 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              {analysis.grade}
            </div>
            <div>
              <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">Security Score</p>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {analysis.passedCount} of {analysis.total} Best-Practice Headers Implemented
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {analysis.percent}% coverage according to modern web application hardening standards.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">Header Audit Breakdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.results.map((res, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-100">{res.name}</span>
                    {res.present ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-md">
                        <XCircle className="w-3 h-3" /> Missing
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{res.description}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <span className="text-slate-400">Recommended: </span>
                  <code className="text-teal-600 dark:text-teal-400 font-mono">{res.recommendation}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
