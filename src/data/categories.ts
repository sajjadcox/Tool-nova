import { CategoryDefinition } from '../types';

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'image-tools',
    slug: 'image-tools',
    name: 'Image Tools',
    description: 'Compress, resize, convert, crop, and edit images right in your browser.',
    icon: 'Image',
    color: '#0ea5e9',
    gradient: 'from-sky-500 to-blue-600'
  },
  {
    id: 'pdf-tools',
    slug: 'pdf-tools',
    name: 'PDF Tools',
    description: 'Merge, split, compress, watermark, and manipulate PDF documents securely.',
    icon: 'FileText',
    color: '#ef4444',
    gradient: 'from-rose-500 to-red-600'
  },
  {
    id: 'text-tools',
    slug: 'text-tools',
    name: 'Text Tools',
    description: 'Count words, convert casing, diff text, remove whitespace, and format strings.',
    icon: 'Type',
    color: '#8b5cf6',
    gradient: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'seo-tools',
    slug: 'seo-tools',
    name: 'SEO Tools',
    description: 'Generate meta tags, sitemaps, robots.txt, schema markup, and preview SERPs.',
    icon: 'Globe',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'developer-tools',
    slug: 'developer-tools',
    name: 'Developer Tools',
    description: 'Format JSON, minify HTML/CSS/JS, test regex, encode Base64, and generate UUIDs.',
    icon: 'Code',
    color: '#6366f1',
    gradient: 'from-indigo-500 to-violet-600'
  },
  {
    id: 'calculators',
    slug: 'calculators',
    name: 'Calculators & Math',
    description: 'Calculate percentages, discounts, loan EMIs, age, BMI, and convert units.',
    icon: 'Calculator',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600'
  },
  {
    id: 'color-design',
    slug: 'color-design',
    name: 'Color & Design Tools',
    description: 'Color pickers, gradient creators, contrast checker, shadow and button generators.',
    icon: 'Palette',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    id: 'security-privacy',
    slug: 'security-privacy',
    name: 'Security & Privacy',
    description: 'Generate cryptographically strong passwords, hashes, tokens, and inspect JWTs.',
    icon: 'ShieldCheck',
    color: '#14b8a6',
    gradient: 'from-teal-500 to-cyan-600'
  },
  {
    id: 'social-media',
    slug: 'social-media',
    name: 'Social Media Tools',
    description: 'YouTube thumbnail extractors, caption formatters, hashtags, and post previews.',
    icon: 'Share2',
    color: '#f43f5e',
    gradient: 'from-rose-500 to-pink-600'
  },
  {
    id: 'file-tools',
    slug: 'file-tools',
    name: 'File Tools',
    description: 'Inspect MIME types, convert CSV to JSON, view tabular data, and analyze sizes.',
    icon: 'FolderArchive',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'date-time',
    slug: 'date-time',
    name: 'Date & Time Tools',
    description: 'Calculate days between dates, convert time zones, parse timestamps, and countdowns.',
    icon: 'Clock',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-sky-600'
  },
  {
    id: 'writing-language',
    slug: 'writing-language',
    name: 'Writing & Language',
    description: 'Markdown previewer, reading time calculator, text summarizer, and formatters.',
    icon: 'BookOpen',
    color: '#a855f7',
    gradient: 'from-purple-500 to-fuchsia-600'
  },
  {
    id: 'audio-tools',
    slug: 'audio-tools',
    name: 'Audio Tools',
    description: 'Inspect audio metadata, view waveforms, trim, and adjust speed/volume.',
    icon: 'Volume2',
    color: '#eab308',
    gradient: 'from-yellow-500 to-amber-600'
  },
  {
    id: 'video-tools',
    slug: 'video-tools',
    name: 'Video Tools',
    description: 'Inspect video metadata, extract frames, check resolutions, and generate thumbnails.',
    icon: 'Video',
    color: '#84cc16',
    gradient: 'from-lime-500 to-green-600'
  },
  {
    id: 'productivity',
    slug: 'productivity',
    name: 'Productivity Tools',
    description: 'QR code generator & reader, barcodes, stopwatch, countdown timer, and quick notes.',
    icon: 'CheckSquare',
    color: '#10b981',
    gradient: 'from-emerald-500 to-teal-600'
  }
];

export const categories = CATEGORIES;
