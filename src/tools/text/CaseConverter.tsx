import React, { useState } from 'react';
import { CaseSensitive, Copy, RefreshCw } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const CaseConverter: React.FC = () => {
  const [text, setText] = useState<string>('The quick brown fox jumps over the lazy dog.');

  const toUpperCase = (str: string) => str.toUpperCase();
  const toLowerCase = (str: string) => str.toLowerCase();

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
  };

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const toCamelCase = (str: string) => {
    return str
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
      .replace(/^([A-Z])/, (_, chr) => chr.toLowerCase());
  };

  const toKebabCase = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '')
      .toLowerCase();
  };

  const toSnakeCase = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase();
  };

  const toConstantCase = (str: string) => {
    return toSnakeCase(str).toUpperCase();
  };

  const cases = [
    { name: 'Sentence case', fn: toSentenceCase },
    { name: 'UPPERCASE', fn: toUpperCase },
    { name: 'lowercase', fn: toLowerCase },
    { name: 'Title Case', fn: toTitleCase },
    { name: 'camelCase', fn: toCamelCase },
    { name: 'kebab-case', fn: toKebabCase },
    { name: 'snake_case', fn: toSnakeCase },
    { name: 'CONSTANT_CASE', fn: toConstantCase },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <label className="font-semibold text-slate-700 dark:text-slate-300">Input Text</label>
          <button
            type="button"
            onClick={() => setText('')}
            className="text-red-500 hover:underline"
          >
            Clear
          </button>
        </div>

        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to convert..."
          className="w-full p-4 text-sm font-sans rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500"
        />
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Instant Case Conversions
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cases.map((c) => {
            const converted = c.fn(text);
            return (
              <div
                key={c.name}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                    {c.name}
                  </span>
                  <CopyButton textToCopy={converted} />
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                  {converted || <span className="text-slate-400 italic">Empty output</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
