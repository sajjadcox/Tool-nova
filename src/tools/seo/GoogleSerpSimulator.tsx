import React, { useState } from 'react';
import { Search, Globe, Smartphone, Monitor, CheckCircle2, AlertTriangle } from 'lucide-react';

export const GoogleSerpSimulator: React.FC = () => {
  const [title, setTitle] = useState<string>('ToolNova - Every Tool You Need. All in One Place.');
  const [description, setDescription] = useState<string>(
    'Discover 250+ free online web tools for images, PDF files, video, audio, developer code, and SEO. Processed 100% private in-browser.'
  );
  const [url, setUrl] = useState<string>('https://example.com/tools/image-compressor');
  const [viewDevice, setViewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Title max ~60 chars or ~600px
  const titleCharLimit = 60;
  // Description max ~155-160 chars or ~960px
  const descCharLimit = 160;

  const isTitleOver = title.length > titleCharLimit;
  const isDescOver = description.length > descCharLimit;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>Google SERP Simulator & Snippet Previewer</span>
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewDevice('desktop')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewDevice === 'desktop' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewDevice('mobile')}
              className={`px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors ${
                viewDevice === 'mobile' ? 'bg-white dark:bg-slate-700 text-teal-600 shadow-xs' : 'text-slate-500'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        </div>

        {/* Input Controls */}
        <div className="space-y-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
              <label>SEO Meta Title:</label>
              <span className={`font-mono ${isTitleOver ? 'text-amber-500' : 'text-slate-400'}`}>
                {title.length} / {titleCharLimit} characters
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-medium"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
              <label>Target URL / Canonical:</label>
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
              <label>SEO Meta Description:</label>
              <span className={`font-mono ${isDescOver ? 'text-amber-500' : 'text-slate-400'}`}>
                {description.length} / {descCharLimit} characters
              </span>
            </div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs"
            />
          </div>
        </div>

        {/* Live Google Search Result Simulation */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Live Google SERP Snippet Preview:
          </span>

          <div className={`p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm ${
            viewDevice === 'mobile' ? 'max-w-sm mx-auto' : 'max-w-2xl'
          }`}>
            <div className="space-y-1">
              {/* Breadcrumb URL */}
              <div className="flex items-center gap-2 text-[12px] text-[#202124]">
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500">
                  🌐
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-medium text-[#202124] text-[12px] truncate max-w-xs">
                    {new URL(url || 'https://example.com').hostname}
                  </span>
                  <span className="text-[#5f6368] text-[11px] truncate max-w-xs font-mono">
                    {url}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h4 className="text-[18px] sm:text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-[1.3] font-normal pt-1 break-words">
                {title || 'Page Title Goes Here'}
              </h4>

              {/* Description */}
              <p className="text-[13px] sm:text-[14px] text-[#4d5156] leading-[1.4] break-words pt-0.5">
                {description || 'Your meta description will appear here in Google search results.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
