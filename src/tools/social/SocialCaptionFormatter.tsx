import React, { useState } from 'react';
import { Type, Copy, Check, Hash, Sparkles } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const SocialCaptionFormatter: React.FC = () => {
  const [caption, setCaption] = useState<string>(
    'Stop wasting hours switching between 20 different single-purpose websites.\n\nHere is how top developers save time every single day:\n\n1. Keep all tools local in the browser\n2. Never upload private PDFs to random servers\n3. Format JSON and minify code in seconds\n\nWhat is your go-to productivity trick?'
  );
  const [hashtags, setHashtags] = useState<string>('#Tech #Developers #Productivity #Coding');
  const [copied, setCopied] = useState<boolean>(false);

  // Preserve line breaks using invisible whitespace (U+2800 Braille pattern blank or zero-width space)
  const formatCaptionForSocial = () => {
    const lines = caption.split('\n');
    const preserved = lines.map(line => (line.trim() === '' ? '⠀' : line)).join('\n');
    return `${preserved}\n\n.\n.\n.\n${hashtags.trim()}`;
  };

  const formattedOutput = formatCaptionForSocial();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    { name: 'Instagram', max: 2200, current: formattedOutput.length },
    { name: 'Twitter / X', max: 280, current: formattedOutput.length },
    { name: 'LinkedIn', max: 3000, current: formattedOutput.length },
    { name: 'TikTok', max: 2200, current: formattedOutput.length },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Type className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Social Caption & Line-Break Formatter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Prevent collapsed paragraphs on Instagram and LinkedIn with clean line-break spacers.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Social Caption Formatter"
            resultSummary="Formatted clean social media caption with preserved spacing on ToolNova!"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {platforms.map(p => (
            <div key={p.name} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.name}</span>
                <span className={`text-[10px] font-bold ${p.current > p.max ? 'text-red-500' : 'text-slate-400'}`}>
                  {p.current}/{p.max}
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full ${p.current > p.max ? 'bg-red-500' : 'bg-teal-500'}`}
                  style={{ width: `${Math.min(100, (p.current / p.max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Your Raw Caption</label>
              {caption && (
                <button type="button" onClick={() => setCaption('')} className="text-xs text-slate-400 hover:text-red-500">
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows={12}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write your post caption here..."
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
            />
            <div className="mt-2">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1">Hashtag Group</label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#Hashtag1 #Hashtag2"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Formatted Output (Intact Spacing)</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied with Spacers!' : 'Copy Formatted'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={14}
              value={formattedOutput}
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-sans text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none whitespace-pre-wrap"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
