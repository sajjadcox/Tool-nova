import React, { useState } from 'react';
import { Search, Globe, Smartphone, Monitor } from 'lucide-react';

export const SerpSnippetPreview: React.FC = () => {
  const [title, setTitle] = useState<string>('ToolNova - Free Professional Online Web Tools Suite');
  const [description, setDescription] = useState<string>('Discover powerful, private in-browser tools for compressing images, merging PDFs, counting words, formatting JSON, and generating secure passwords.');
  const [url, setUrl] = useState<string>('https://toolnova.dev/tools');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-6">
      {/* Device Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('desktop')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
              viewMode === 'desktop' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop SERP</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 ${
              viewMode === 'mobile' ? 'bg-teal-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile SERP</span>
          </button>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span>Title: {title.length}/60 chars</span>
          <span>•</span>
          <span>Description: {description.length}/160 chars</span>
        </div>
      </div>

      {/* Google Preview Snippet */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 max-w-2xl">
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-950 flex items-center justify-center text-teal-600">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col truncate">
            <span className="font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">ToolNova</span>
            <span className="text-[11px] text-slate-400 truncate">{url}</span>
          </div>
        </div>

        <h3 className="text-lg text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-snug line-clamp-1 pt-1">
          {title}
        </h3>

        <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      {/* Edit Inputs */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">SERP Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Snippet Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Web URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          />
        </div>
      </div>
    </div>
  );
};
