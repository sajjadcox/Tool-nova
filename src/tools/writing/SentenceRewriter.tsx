import React, { useState } from 'react';
import { RefreshCw, Copy, Check, Sparkles, Feather } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

type ToneStyle = 'professional' | 'casual' | 'concise' | 'persuasive';

export const SentenceRewriter: React.FC = () => {
  const [inputSentence, setInputSentence] = useState<string>(
    'I want to let you know that we are really looking forward to working on this project together.'
  );
  const [activeTone, setActiveTone] = useState<ToneStyle>('professional');
  const [copied, setCopied] = useState<boolean>(false);

  const rewriteTone = (text: string, tone: ToneStyle): string => {
    const trimmed = text.trim();
    if (!trimmed) return '';

    switch (tone) {
      case 'professional':
        return trimmed
          .replace(/i want to let you know that/gi, 'Please be advised that')
          .replace(/really looking forward to/gi, 'eagerly anticipate')
          .replace(/working on this project together/gi, 'our upcoming project collaboration')
          .replace(/thanks a lot/gi, 'Thank you for your consideration')
          .replace(/can you please/gi, 'We kindly request that you');

      case 'casual':
        return trimmed
          .replace(/please be advised that/gi, 'Just a quick heads-up:')
          .replace(/eagerly anticipate/gi, "super excited about")
          .replace(/really looking forward to/gi, "can't wait to")
          .replace(/our upcoming project collaboration/gi, 'teaming up on this project')
          .replace(/we kindly request that you/gi, 'could you please');

      case 'concise':
        return trimmed
          .replace(/i want to let you know that /gi, '')
          .replace(/we are really looking forward to working on this project together/gi, 'We look forward to collaborating with you.')
          .replace(/in order to/gi, 'to')
          .replace(/due to the fact that/gi, 'because')
          .replace(/at the present moment/gi, 'currently');

      case 'persuasive':
        return trimmed
          .replace(/i want to let you know that/gi, 'You will be delighted to discover that')
          .replace(/really looking forward to/gi, 'committed to delivering extraordinary results in')
          .replace(/working on this project together/gi, 'accelerating our joint success');

      default:
        return trimmed;
    }
  };

  const rewrittenResult = rewriteTone(inputSentence, activeTone);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rewrittenResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Feather className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">Sentence & Tone Rewriter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Paraphrase and adjust sentence tone between professional, casual, concise, and persuasive.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="Sentence Rewriter"
            resultSummary="Rewrote sentences with ToolNova Sentence & Tone Rewriter!"
          />
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          {(['professional', 'casual', 'concise', 'persuasive'] as const).map(tone => (
            <button
              key={tone}
              type="button"
              onClick={() => setActiveTone(tone)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTone === tone
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tone}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Original Sentence</label>
              {inputSentence && (
                <button type="button" onClick={() => setInputSentence('')} className="text-xs text-slate-400 hover:text-red-500">
                  Clear
                </button>
              )}
            </div>
            <textarea
              rows={6}
              value={inputSentence}
              onChange={(e) => setInputSentence(e.target.value)}
              placeholder="Enter sentence to paraphrase..."
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Rewritten ({activeTone})</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              readOnly
              rows={6}
              value={rewrittenResult}
              className="w-full p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
