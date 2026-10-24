import React, { useState } from 'react';
import { FileText, Copy, RefreshCw } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export const LoremIpsumGenerator: React.FC = () => {
  const [count, setCount] = useState<number>(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);

  const generate = () => {
    const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

    const generateSentence = () => {
      const len = Math.floor(Math.random() * 8) + 6;
      const sentenceWords = [];
      for (let i = 0; i < len; i++) {
        sentenceWords.push(getRandomWord());
      }
      const raw = sentenceWords.join(' ');
      return raw.charAt(0).toUpperCase() + raw.slice(1) + '.';
    };

    const generateParagraph = () => {
      const sentenceCount = Math.floor(Math.random() * 4) + 4;
      const sentences = [];
      for (let i = 0; i < sentenceCount; i++) {
        sentences.push(generateSentence());
      }
      return sentences.join(' ');
    };

    if (type === 'words') {
      const res = [];
      for (let i = 0; i < count; i++) {
        res.push(getRandomWord());
      }
      let output = res.join(' ');
      if (startWithLorem && output.length > 5) {
        output = 'Lorem ipsum ' + output.slice(output.indexOf(' ') + 1);
      }
      return output;
    }

    if (type === 'sentences') {
      const res = [];
      for (let i = 0; i < count; i++) {
        res.push(generateSentence());
      }
      let output = res.join(' ');
      if (startWithLorem) {
        output = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' + output;
      }
      return output;
    }

    // Paragraphs
    const paras = [];
    for (let i = 0; i < count; i++) {
      let p = generateParagraph();
      if (i === 0 && startWithLorem) {
        p = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' + p;
      }
      paras.push(p);
    }
    return paras.join('\n\n');
  };

  const [output, setOutput] = useState<string>(() => generate());

  const handleRegenerate = () => {
    setOutput(generate());
  };

  return (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Generate Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Quantity: {count}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 mt-4">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span>Start with "Lorem ipsum..."</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={handleRegenerate}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Generate Dummy Text</span>
          </button>
          <CopyButton textToCopy={output} />
        </div>
      </div>

      <div>
        <textarea
          rows={12}
          readOnly
          value={output}
          className="w-full p-4 text-xs font-sans rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 leading-relaxed"
        />
      </div>
    </div>
  );
};
