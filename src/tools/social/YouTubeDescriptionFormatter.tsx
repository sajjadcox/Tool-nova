import React, { useState } from 'react';
import { Youtube, Copy, Check, Plus, Trash2, Clock, Hash } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

interface Chapter {
  time: string;
  title: string;
}

export const YouTubeDescriptionFormatter: React.FC = () => {
  const [intro, setIntro] = useState<string>(
    'In this video, we explore the best productivity workflows and tools you need to streamline your everyday tasks.'
  );
  const [chapters, setChapters] = useState<Chapter[]>([
    { time: '00:00', title: 'Introduction' },
    { time: '01:15', title: 'Overview of Toolkit' },
    { time: '03:45', title: 'Step-by-Step Walkthrough' },
    { time: '07:20', title: 'Final Thoughts & Summary' }
  ]);
  const [socialLinks, setSocialLinks] = useState<string>(
    '🌐 Website: https://toolnova.app\n🐦 Twitter/X: https://x.com/toolnova\n📸 Instagram: https://instagram.com/toolnova'
  );
  const [hashtags, setHashtags] = useState<string>('#Productivity #Tools #Workflow #ToolNova');
  const [copied, setCopied] = useState<boolean>(false);

  const addChapter = () => {
    setChapters([...chapters, { time: '00:00', title: 'New Chapter' }]);
  };

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const updateChapter = (index: number, field: keyof Chapter, val: string) => {
    const copy = [...chapters];
    copy[index][field] = val;
    setChapters(copy);
  };

  const generateFullDescription = () => {
    let out = `${intro.trim()}\n\n`;

    if (chapters.length > 0) {
      out += `⏱️ TIMESTAMPS / CHAPTERS:\n`;
      chapters.forEach(c => {
        out += `${c.time} - ${c.title}\n`;
      });
      out += `\n`;
    }

    if (socialLinks.trim()) {
      out += `🔗 CONNECT WITH US:\n${socialLinks.trim()}\n\n`;
    }

    if (hashtags.trim()) {
      out += `${hashtags.trim()}\n`;
    }

    return out.trim();
  };

  const fullText = generateFullDescription();
  const maxLimit = 5000;
  const charsUsed = fullText.length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 dark:bg-red-950/50 rounded-xl text-red-600 dark:text-red-400">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">YouTube Description Formatter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Format chapters, social links, timestamps, and hashtags to boost SEO ranking.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ShareResultButton
              toolName="YouTube Description Formatter"
              resultSummary="Formatted SEO-friendly YouTube description with timestamps using ToolNova!"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Video Summary & Intro</label>
                {intro && (
                  <button type="button" onClick={() => setIntro('')} className="text-xs text-slate-400 hover:text-red-500">
                    Clear
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                placeholder="Brief summary of your video..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Timestamps & Video Chapters</span>
                </label>
                <button
                  type="button"
                  onClick={addChapter}
                  className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Chapter</span>
                </button>
              </div>

              <div className="space-y-2">
                {chapters.map((chap, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chap.time}
                      onChange={(e) => updateChapter(i, 'time', e.target.value)}
                      placeholder="00:00"
                      className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-center text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="text"
                      value={chap.title}
                      onChange={(e) => updateChapter(i, 'title', e.target.value)}
                      placeholder="Chapter title"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeChapter(i)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Social & External Links</label>
              <textarea
                rows={3}
                value={socialLinks}
                onChange={(e) => setSocialLinks(e.target.value)}
                placeholder="Social links, merch, or download references..."
                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 font-mono focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-teal-600" />
                <span>Hashtags (Space separated)</span>
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                placeholder="#Coding #Tech #Software"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Formatted YouTube Preview</span>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono ${charsUsed > maxLimit ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                  {charsUsed.toLocaleString()} / {maxLimit.toLocaleString()} chars
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Description'}</span>
                </button>
              </div>
            </div>
            <textarea
              readOnly
              rows={18}
              value={fullText}
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
