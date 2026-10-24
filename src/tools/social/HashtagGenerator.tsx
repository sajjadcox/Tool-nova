import React, { useState } from 'react';
import { Hash, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const HashtagGenerator: React.FC = () => {
  const [topic, setTopic] = useState<string>('productivity tools developer tech');

  const generateHashtags = () => {
    if (!topic.trim()) return [];
    const words = topic
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 1);

    const relatedSfx = ['tips', 'hacks', 'guide', 'daily', 'life', 'trends', 'community', 'inspiration'];
    const tags = new Set<string>();

    words.forEach(w => {
      tags.add(`#${w}`);
      relatedSfx.slice(0, 3).forEach(s => {
        tags.add(`#${w}${s}`);
      });
    });

    return Array.from(tags);
  };

  const hashtags = generateHashtags();
  const allTagsString = hashtags.join(' ');

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Enter Keywords or Topic
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. fitness workout health motivation"
          className="w-full px-4 py-3 text-sm rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
        />
      </div>

      {hashtags.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Generated Hashtags ({hashtags.length})
            </span>
            <CopyButton textToCopy={allTagsString} label="Copy All Hashtags" />
          </div>

          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-teal-700 dark:text-teal-300 font-semibold"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
