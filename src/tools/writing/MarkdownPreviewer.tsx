import React, { useState } from 'react';
import { FileText, Copy, Download } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { DownloadButton } from '../../components/common/DownloadButton';

export const MarkdownPreviewer: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>(`# Welcome to ToolNova

Every Tool You Need. All in One Place.

## Core Highlights
- **100% Client-Side Processing**: Zero file uploads.
- **Fast and Lightweight**: Built on React and modern Web APIs.
- **Comprehensive Tool Directory**: Over 160 free utilities.

### Code Sample
\`\`\`javascript
const tool = "ToolNova";
console.log(\`Launching \${tool}!\`);
\`\`\`

> "Privacy and simplicity at your fingertips."

### Category Summary
| Category | Tools | Status |
| :--- | :---: | :--- |
| Image Tools | 15 | Active |
| PDF Tools | 15 | Active |
| Developer | 15 | Active |
`);

  // Basic safe markdown parser
  const renderMarkdown = (md: string) => {
    let html = md
      // Escape HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-base font-bold mt-4 mb-2 text-slate-800 dark:text-slate-100">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mt-5 mb-2 pb-1 border-b border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold mt-2 mb-3 text-slate-900 dark:text-white">$1</h1>')
      // Bold & Italic
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-bold text-teal-600 dark:text-teal-400">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      // Blockquotes
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-teal-500 pl-4 py-1 my-3 bg-teal-50/50 dark:bg-teal-950/20 italic text-slate-600 dark:text-slate-300 rounded-r-xl">$1</blockquote>')
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre class="p-3 my-3 rounded-xl bg-slate-900 text-teal-300 font-mono text-xs overflow-x-auto">$1</pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code class="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs text-rose-500 font-semibold">$1</code>')
      // Bullet lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300">$1</li>')
      // Line breaks
      .replace(/\n$/gim, '<br />');

    return html;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500">Live side-by-side Markdown editor & HTML rendered view</span>
        <div className="flex items-center gap-2">
          <CopyButton textToCopy={markdown} label="Copy Markdown" />
          <DownloadButton
            filename="document.md"
            content={markdown}
            label="Download .md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <div className="space-y-2 flex flex-col">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Markdown Editor</label>
          <textarea
            rows={18}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full flex-1 p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500 leading-relaxed"
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">Live Rendered Preview</label>
          <div
            className="w-full flex-1 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-y-auto prose dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
          />
        </div>
      </div>
    </div>
  );
};
