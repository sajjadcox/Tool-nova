import React, { useState } from 'react';
import { Link, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const SlugGenerator: React.FC = () => {
  const [input, setInput] = useState<string>('ToolNova: Every Tool You Need. All in One Place! (2026 Edition)');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState<boolean>(true);

  const generateSlug = (str: string) => {
    let s = str
      .normalize('NFD') // decompose combined graphemes
      .replace(/[\u0300-\u036f]/g, '') // remove diacritics
      .replace(/[^a-zA-Z0-9\s-_]/g, '') // remove special characters
      .trim()
      .replace(/[\s-_]+/g, separator);

    if (lowercase) s = s.toLowerCase();
    return s;
  };

  const slug = generateSlug(input);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Article Title or Headline
        </label>
        <textarea
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-4 text-sm rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        />
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-3">
          <span>Separator:</span>
          <button
            type="button"
            onClick={() => setSeparator('-')}
            className={`px-3 py-1.5 rounded-xl ${separator === '-' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 border'}`}
          >
            Hyphen (-)
          </button>
          <button
            type="button"
            onClick={() => setSeparator('_')}
            className={`px-3 py-1.5 rounded-xl ${separator === '_' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 border'}`}
          >
            Underscore (_)
          </button>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lowercase}
            onChange={(e) => setLowercase(e.target.checked)}
            className="rounded text-teal-600 focus:ring-teal-500"
          />
          <span>Lowercase</span>
        </label>
      </div>

      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">Generated Permalink Slug</span>
          <span className="text-base font-bold font-mono text-teal-600 dark:text-teal-400 break-all select-all">
            {slug}
          </span>
        </div>
        <CopyButton textToCopy={slug} label="Copy Slug" />
      </div>
    </div>
  );
};
