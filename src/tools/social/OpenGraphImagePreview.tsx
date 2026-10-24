import React, { useState } from 'react';
import { Share2, Image as ImageIcon, Globe, Monitor, Smartphone } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const OpenGraphImagePreview: React.FC = () => {
  const [title, setTitle] = useState<string>('ToolNova Toolkit - 150+ Free High Performance Developer & Everyday Utilities');
  const [description, setDescription] = useState<string>('The modern privacy-first utility station. Compress PDFs, edit images, format JSON, test 2FA, and crunch numbers without leaving your browser.');
  const [siteName, setSiteName] = useState<string>('toolnova.app');
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop');
  const [activePlatform, setActivePlatform] = useState<'facebook' | 'twitter' | 'linkedin' | 'discord'>('facebook');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Open Graph & Social Share Preview</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Preview how links appear across Facebook, Twitter/X, LinkedIn, and Discord.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Open Graph Image Preview"
            resultSummary={`Checked social link preview for ${siteName} on ToolNova!`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">og:title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">og:description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Domain / og:site_name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">og:image URL</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              {(['facebook', 'twitter', 'linkedin', 'discord'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setActivePlatform(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    activePlatform === p
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Preview Card */}
            {activePlatform === 'facebook' && (
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm max-w-md mx-auto">
                <div className="aspect-[1.91/1] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img src={imageUrl} alt="OG" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{siteName}</p>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1 mt-0.5">{title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">{description}</p>
                </div>
              </div>
            )}

            {activePlatform === 'twitter' && (
              <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-black text-white shadow-sm max-w-md mx-auto">
                <div className="aspect-[1.91/1] w-full bg-slate-900 overflow-hidden relative">
                  <img src={imageUrl} alt="OG" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[11px] font-medium text-white">
                    {siteName}
                  </span>
                </div>
                <div className="p-3 bg-zinc-900">
                  <h4 className="font-bold text-sm text-white line-clamp-1">{title}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{description}</p>
                </div>
              </div>
            )}

            {activePlatform === 'linkedin' && (
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800 shadow-sm max-w-md mx-auto">
                <div className="aspect-[1.91/1] w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img src={imageUrl} alt="OG" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-1">{title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{siteName} &middot; 1 min read</p>
                </div>
              </div>
            )}

            {activePlatform === 'discord' && (
              <div className="bg-[#2f3136] text-white p-3.5 rounded-lg border-l-4 border-teal-500 max-w-md mx-auto space-y-2 text-xs">
                <span className="text-[11px] text-[#00b0f4] hover:underline font-semibold block">{siteName}</span>
                <h4 className="font-bold text-sm text-[#00b0f4] line-clamp-1">{title}</h4>
                <p className="text-[#dcddde] line-clamp-2 leading-relaxed">{description}</p>
                <div className="rounded-lg overflow-hidden aspect-[1.91/1] w-full mt-2">
                  <img src={imageUrl} alt="OG" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
