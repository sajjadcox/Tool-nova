import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, XCircle, Globe, ExternalLink } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const MetaTagAnalyzer: React.FC = () => {
  const [htmlInput, setHtmlInput] = useState<string>(
    `<title>ToolNova - 150+ Free Client-Side Developer & Productivity Tools</title>\n<meta name="description" content="All-in-one privacy-first toolkit. Compress PDFs, resize photos, format code, test 2FA, and crunch numbers in your browser.">\n<link rel="canonical" href="https://toolnova.app/">\n<meta name="robots" content="index, follow">\n<meta property="og:title" content="ToolNova Toolkit">\n<meta property="og:description" content="Every tool you need, all in one place.">\n<meta property="og:image" content="https://toolnova.app/og-banner.png">\n<meta name="twitter:card" content="summary_large_image">`
  );

  const analyzeMetaTags = () => {
    const titleMatch = htmlInput.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const getMetaContent = (nameOrProperty: string) => {
      const regex = new RegExp(`<meta\\s+(?:name|property)=["']${nameOrProperty}["']\\s+content=["']([^"']*)["']`, 'i');
      const match = htmlInput.match(regex);
      if (match) return match[1];
      const reverseRegex = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+(?:name|property)=["']${nameOrProperty}["']`, 'i');
      const reverseMatch = htmlInput.match(reverseRegex);
      return reverseMatch ? reverseMatch[1] : '';
    };

    const description = getMetaContent('description');
    const ogTitle = getMetaContent('og:title');
    const ogDescription = getMetaContent('og:description');
    const ogImage = getMetaContent('og:image');
    const twitterCard = getMetaContent('twitter:card');

    const canonicalMatch = htmlInput.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : '';

    const robots = getMetaContent('robots');

    let score = 100;
    const checks: { label: string; status: 'good' | 'warning' | 'bad'; detail: string }[] = [];

    // Title checks
    if (!title) {
      score -= 25;
      checks.push({ label: 'Page Title', status: 'bad', detail: 'Missing <title> tag. Critical for search engines.' });
    } else if (title.length < 30 || title.length > 65) {
      score -= 10;
      checks.push({ label: 'Title Length', status: 'warning', detail: `${title.length} characters (Optimal is 50-60 characters to avoid truncation).` });
    } else {
      checks.push({ label: 'Title Length', status: 'good', detail: `Perfect length (${title.length} characters).` });
    }

    // Description checks
    if (!description) {
      score -= 25;
      checks.push({ label: 'Meta Description', status: 'bad', detail: 'Missing meta description. Search engines will generate an arbitrary snippet.' });
    } else if (description.length < 120 || description.length > 165) {
      score -= 10;
      checks.push({ label: 'Description Length', status: 'warning', detail: `${description.length} characters (Optimal is 140-160 characters).` });
    } else {
      checks.push({ label: 'Description Length', status: 'good', detail: `Optimal length (${description.length} characters).` });
    }

    // Canonical check
    if (!canonical) {
      score -= 15;
      checks.push({ label: 'Canonical URL', status: 'warning', detail: 'Missing canonical link. Recommended to prevent duplicate content penalties.' });
    } else {
      checks.push({ label: 'Canonical URL', status: 'good', detail: `Configured: ${canonical}` });
    }

    // OpenGraph image
    if (!ogImage) {
      score -= 15;
      checks.push({ label: 'Social Share Image (og:image)', status: 'warning', detail: 'Missing og:image. Links will display without rich media previews.' });
    } else {
      checks.push({ label: 'Social Share Image', status: 'good', detail: 'og:image is defined.' });
    }

    return {
      title,
      description,
      canonical,
      robots: robots || 'Not specified (defaults to index, follow)',
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      score: Math.max(0, score),
      checks
    };
  };

  const analysis = analyzeMetaTags();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Meta Tag & SEO Analyzer</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Audit Title length, Meta Description, Open Graph tags, and SERP health.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Meta Tag Analyzer"
            resultSummary={`SEO Health Score: ${analysis.score}/100 analyzed with ToolNova Meta Tag Analyzer!`}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Paste HTML Header or Meta Tags</label>
            {htmlInput && (
              <button type="button" onClick={() => setHtmlInput('')} className="text-xs text-slate-400 hover:text-red-500">
                Clear
              </button>
            )}
          </div>
          <textarea
            rows={5}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="<title>Your Page Title</title>&#10;<meta name='description' content='...'>"
            className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">SEO Meta Health Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-4xl sm:text-5xl font-black font-mono ${
                analysis.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : analysis.score >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {analysis.score}
              </span>
              <span className="text-slate-400 font-bold">/ 100</span>
            </div>
          </div>

          {/* Google SERP Snippet Preview */}
          <div className="flex-1 max-w-lg bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Google Search Result Preview</span>
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{analysis.canonical || 'https://example.com'}</span>
            </div>
            <h4 className="text-base text-blue-700 dark:text-blue-400 font-medium hover:underline truncate cursor-pointer">
              {analysis.title || 'Untitled Document'}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {analysis.description || 'No description provided. Add a meta description tag to control how your page appears in search results.'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 tracking-wider">SEO Audit Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.checks.map((chk, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3"
              >
                <div className="mt-0.5 shrink-0">
                  {chk.status === 'good' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {chk.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                  {chk.status === 'bad' && <XCircle className="w-4 h-4 text-red-500" />}
                </div>
                <div>
                  <p className="font-semibold text-xs text-slate-800 dark:text-slate-100">{chk.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{chk.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
