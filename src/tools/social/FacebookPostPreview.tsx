import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Share, Globe, MoreHorizontal, Smartphone, Monitor } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const FacebookPostPreview: React.FC = () => {
  const [pageName, setPageName] = useState<string>('ToolNova Toolkit');
  const [postText, setPostText] = useState<string>(
    '🚀 Excited to announce our newest release! Over 150+ free client-side privacy-first web utilities: Compress PDFs, resize photos, format code, and much more without downloading anything!'
  );
  const [linkDomain, setLinkDomain] = useState<string>('TOOLNOVA.APP');
  const [linkTitle, setLinkTitle] = useState<string>('ToolNova - Every Tool You Need. All In One Place.');
  const [linkImage, setLinkImage] = useState<string>('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop');
  const [likes, setLikes] = useState<number>(342);
  const [comments, setComments] = useState<number>(28);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">Facebook Post Preview Simulator</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">See how your Facebook post and link thumbnail look before publishing.</p>
          </div>
          <ShareResultButton
            toolName="Facebook Post Preview"
            resultSummary={`Simulated Facebook feed post for ${pageName} with ToolNova!`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Page / Profile Name</label>
              <input
                type="text"
                value={pageName}
                onChange={(e) => setPageName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Post Copy</label>
                {postText && (
                  <button type="button" onClick={() => setPostText('')} className="text-xs text-slate-400 hover:text-red-500">
                    Clear
                  </button>
                )}
              </div>
              <textarea
                rows={4}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Domain Label</label>
                <input
                  type="text"
                  value={linkDomain}
                  onChange={(e) => setLinkDomain(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Link Title</label>
                <input
                  type="text"
                  value={linkTitle}
                  onChange={(e) => setLinkTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Thumbnail Image URL</label>
              <input
                type="text"
                value={linkImage}
                onChange={(e) => setLinkImage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Live Simulator</span>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setDevice('desktop')}
                  className={`p-1.5 rounded text-xs flex items-center gap-1 ${device === 'desktop' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600' : 'text-slate-500'}`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDevice('mobile')}
                  className={`p-1.5 rounded text-xs flex items-center gap-1 ${device === 'mobile' ? 'bg-white dark:bg-slate-700 shadow-sm text-teal-600' : 'text-slate-500'}`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Facebook Card Mockup */}
            <div className={`mx-auto bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl shadow-md overflow-hidden ${device === 'mobile' ? 'max-w-xs' : 'max-w-md'}`}>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {pageName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">{pageName}</h5>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span>Just now</span>
                      <span>&middot;</span>
                      <Globe className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>

              <div className="px-3 pb-3 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {postText}
              </div>

              {/* Link Card Attachment */}
              <div className="border-t border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                <div className="aspect-[1.91/1] w-full overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img src={linkImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 bg-slate-100/70 dark:bg-slate-800/60">
                  <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">{linkDomain}</p>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1 mt-0.5">{linkTitle}</p>
                </div>
              </div>

              {/* Reaction Bar */}
              <div className="p-2.5 flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">👍</span>
                  <span>{likes}</span>
                </div>
                <div>{comments} comments</div>
              </div>

              <div className="grid grid-cols-3 py-1.5 text-center text-xs text-slate-600 dark:text-slate-400 font-semibold">
                <button
                  type="button"
                  onClick={() => setLikes(l => l + 1)}
                  className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Like
                </button>
                <div className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">
                  <MessageSquare className="w-3.5 h-3.5" /> Comment
                </div>
                <div className="flex items-center justify-center gap-1.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer">
                  <Share className="w-3.5 h-3.5" /> Share
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
