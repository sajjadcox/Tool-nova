import React, { useState } from 'react';
import { FileType, Search } from 'lucide-react';

const MIME_DATABASE = [
  { ext: '.png', mime: 'image/png', desc: 'Portable Network Graphics lossless image' },
  { ext: '.jpg / .jpeg', mime: 'image/jpeg', desc: 'JPEG compressed photographic image' },
  { ext: '.webp', mime: 'image/webp', desc: 'WebP modern compressed web image format' },
  { ext: '.pdf', mime: 'application/pdf', desc: 'Adobe Portable Document Format' },
  { ext: '.json', mime: 'application/json', desc: 'JavaScript Object Notation data interchange format' },
  { ext: '.csv', mime: 'text/csv', desc: 'Comma-Separated Values tabular spreadsheet format' },
  { ext: '.txt', mime: 'text/plain', desc: 'Standard unformatted plain text' },
  { ext: '.html', mime: 'text/html', desc: 'HyperText Markup Language web document' },
  { ext: '.css', mime: 'text/css', desc: 'Cascading Style Sheets web layout style' },
  { ext: '.js / .mjs', mime: 'text/javascript', desc: 'JavaScript executable source code' },
  { ext: '.zip', mime: 'application/zip', desc: 'ZIP compressed archive container' },
  { ext: '.mp3', mime: 'audio/mpeg', desc: 'MPEG Layer-3 compressed audio' },
  { ext: '.wav', mime: 'audio/wav', desc: 'Waveform Audio uncompressed PCM sound' },
  { ext: '.mp4', mime: 'video/mp4', desc: 'MPEG-4 Part 14 video container' },
  { ext: '.webm', mime: 'video/webm', desc: 'WebM open web video format' },
  { ext: '.svg', mime: 'image/svg+xml', desc: 'Scalable Vector Graphics XML vector drawing' },
  { ext: '.woff2', mime: 'font/woff2', desc: 'Web Open Font Format 2.0 web font' },
  { ext: '.xml', mime: 'application/xml', desc: 'Extensible Markup Language document' }
];

export const MimeTypeInspector: React.FC = () => {
  const [query, setQuery] = useState<string>('');

  const filtered = MIME_DATABASE.filter(item =>
    item.ext.toLowerCase().includes(query.toLowerCase()) ||
    item.mime.toLowerCase().includes(query.toLowerCase()) ||
    item.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by file extension (e.g. .pdf, .webp) or MIME type (e.g. application/json)..."
          className="w-full pl-12 pr-4 py-3 text-sm rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 outline-none focus:border-teal-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">
                {item.ext}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {item.mime}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
