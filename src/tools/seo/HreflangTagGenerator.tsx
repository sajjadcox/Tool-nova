import React, { useState } from 'react';
import { Globe, Plus, Trash2, Copy, Check, Code } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

interface HreflangEntry {
  lang: string;
  url: string;
}

export const HreflangTagGenerator: React.FC = () => {
  const [entries, setEntries] = useState<HreflangEntry[]>([
    { lang: 'x-default', url: 'https://example.com/' },
    { lang: 'en-us', url: 'https://example.com/en/' },
    { lang: 'bn-bd', url: 'https://example.com/bn/' },
    { lang: 'es-es', url: 'https://example.com/es/' }
  ]);
  const [copied, setCopied] = useState<boolean>(false);

  const addEntry = () => {
    setEntries([...entries, { lang: 'fr-fr', url: 'https://example.com/fr/' }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: keyof HreflangEntry, val: string) => {
    const copy = [...entries];
    copy[index][field] = val;
    setEntries(copy);
  };

  const generatedTags = entries
    .map(e => `<link rel="alternate" hreflang="${e.lang.trim().toLowerCase()}" href="${e.url.trim()}" />`)
    .join('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Hreflang Tag Generator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Generate valid multi-language and regional SEO alternate tags with x-default.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Hreflang Tag Generator"
            resultSummary="Generated multi-language hreflang tags with ToolNova!"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Languages & Regional URLs</label>
              <button
                type="button"
                onClick={addEntry}
                className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add Language
              </button>
            </div>

            <div className="space-y-2">
              {entries.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={entry.lang}
                    onChange={(e) => updateEntry(idx, 'lang', e.target.value)}
                    placeholder="en, bn-bd, x-default"
                    className="w-28 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100"
                  />
                  <input
                    type="text"
                    value={entry.url}
                    onChange={(e) => updateEntry(idx, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => removeEntry(idx)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Generated HTML &lt;head&gt; Tags</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Tags'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={10}
              value={generatedTags}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
