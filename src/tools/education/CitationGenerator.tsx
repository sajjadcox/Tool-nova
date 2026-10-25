import React, { useState } from 'react';
import { BookOpen, Copy, Check, Quote, Globe, FileText } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const CitationGenerator: React.FC = () => {
  const [sourceType, setSourceType] = useState<'website' | 'book' | 'journal'>('website');
  const [style, setStyle] = useState<'apa' | 'mla' | 'harvard' | 'chicago'>('apa');

  // Fields
  const [authorLast, setAuthorLast] = useState<string>('Smith');
  const [authorFirst, setAuthorFirst] = useState<string>('John');
  const [title, setTitle] = useState<string>('Advances in Artificial Intelligence and Web Technologies');
  const [publisherOrSite, setPublisherOrSite] = useState<string>('Tech Science Press');
  const [year, setYear] = useState<string>('2024');
  const [url, setUrl] = useState<string>('https://example.com/ai-web');
  const [accessDate, setAccessDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const generateCitation = () => {
    const fInitial = authorFirst.charAt(0) ? `${authorFirst.charAt(0)}.` : '';
    const cleanYear = year || 'n.d.';

    if (style === 'apa') {
      // APA 7th
      if (sourceType === 'website') {
        return `${authorLast}, ${fInitial} (${cleanYear}). ${title}. ${publisherOrSite}. ${url}`;
      } else if (sourceType === 'book') {
        return `${authorLast}, ${fInitial} (${cleanYear}). ${title}. ${publisherOrSite}.`;
      } else {
        return `${authorLast}, ${fInitial} (${cleanYear}). ${title}. ${publisherOrSite}, 12(3), 45-60. ${url}`;
      }
    } else if (style === 'mla') {
      // MLA 9th
      if (sourceType === 'website') {
        return `${authorLast}, ${authorFirst}. "${title}." ${publisherOrSite}, ${cleanYear}, ${url}. Accessed ${accessDate}.`;
      } else if (sourceType === 'book') {
        return `${authorLast}, ${authorFirst}. ${title}. ${publisherOrSite}, ${cleanYear}.`;
      } else {
        return `${authorLast}, ${authorFirst}. "${title}." ${publisherOrSite}, vol. 12, no. 3, ${cleanYear}, pp. 45-60.`;
      }
    } else if (style === 'harvard') {
      // Harvard
      if (sourceType === 'website') {
        return `${authorLast}, ${fInitial} (${cleanYear}) ${title}. Available at: ${url} (Accessed: ${accessDate}).`;
      } else {
        return `${authorLast}, ${fInitial} (${cleanYear}) ${title}. ${publisherOrSite}.`;
      }
    } else {
      // Chicago Notes & Bibliography
      if (sourceType === 'website') {
        return `${authorLast}, ${authorFirst}. "${title}." ${publisherOrSite}. ${cleanYear}. ${url}.`;
      } else {
        return `${authorLast}, ${authorFirst}. ${title}. ${publisherOrSite}, ${cleanYear}.`;
      }
    }
  };

  const citation = generateCitation();

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Quote className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Academic Citation & Bibliography Generator
            </h3>
          </div>

          {/* Style Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            {(['apa', 'mla', 'harvard', 'chicago'] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={`px-3 py-1.5 rounded-lg uppercase transition-colors ${
                  style === s ? 'bg-violet-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Source Type Selector */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          {[
            { id: 'website', label: 'Website / Web Page', icon: Globe },
            { id: 'book', label: 'Book / Publication', icon: BookOpen },
            { id: 'journal', label: 'Journal / Research Article', icon: FileText }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSourceType(t.id as any)}
                className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
                  sourceType === t.id
                    ? 'border-violet-600 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Author Last Name / Surname:</label>
            <input
              type="text"
              value={authorLast}
              onChange={(e) => setAuthorLast(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Author First Name / Initial:</label>
            <input
              type="text"
              value={authorFirst}
              onChange={(e) => setAuthorFirst(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              {sourceType === 'website' ? 'Web Article Title' : sourceType === 'book' ? 'Book Title' : 'Journal Article Title'}:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              {sourceType === 'website' ? 'Website Name' : 'Publisher Name'}:
            </label>
            <input
              type="text"
              value={publisherOrSite}
              onChange={(e) => setPublisherOrSite(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Year Published:</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
            />
          </div>

          {sourceType === 'website' && (
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">URL / Link:</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono"
              />
            </div>
          )}
        </div>

        {/* Output Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-violet-800 dark:text-violet-300">
              Formatted {style.toUpperCase()} Reference:
            </span>
            <CopyButton textToCopy={citation} label="Copy Citation" />
          </div>
          <p className="font-serif text-sm sm:text-base text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900 p-4 rounded-xl border border-violet-100 dark:border-violet-900/50 leading-relaxed select-all">
            {citation}
          </p>
        </div>
      </div>
    </div>
  );
};
