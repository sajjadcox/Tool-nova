import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Lock, 
  ArrowRight, 
  Flame, 
  Layers, 
  CheckCircle2, 
  ChevronDown,
  X,
  Search,
  Grid,
  Youtube,
  FileText,
  Image as ImageIcon,
  Type,
  Code,
  Calculator,
  ShieldAlert,
  Globe,
  SlidersHorizontal
} from 'lucide-react';
import { TOOLS_REGISTRY } from '../data/tools';
import { CATEGORIES } from '../data/categories';
import { SearchBar } from '../components/search/SearchBar';
import { ToolCard } from '../components/cards/ToolCard';
import { useFavorites } from '../hooks/useFavorites';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { isFavorite, toggleFavorite } = useFavorites();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const searchResultsRef = useRef<HTMLDivElement | null>(null);

  // Filter tools for instant search & category selection
  const filteredTools = TOOLS_REGISTRY.filter(tool => {
    const matchesSearch = !searchQuery.trim() || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || tool.categorySlug === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const isSearchActive = searchQuery.trim() !== '';

  const handleKeywordClick = (kw: string) => {
    setSearchQuery(kw);
    setSelectedCategory('all');
  };

  const handleCategoryPillClick = (catId: string) => {
    setSelectedCategory(catId);
    if (catId !== 'all') {
      const el = document.getElementById(`cat-section-${catId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Featured High-Demand Tools for Quick Access
  const featuredTools = [
    TOOLS_REGISTRY.find(t => t.id === 'youtube-all-in-one') || TOOLS_REGISTRY[0],
    TOOLS_REGISTRY.find(t => t.id === 'pdf-merger') || TOOLS_REGISTRY[1],
    TOOLS_REGISTRY.find(t => t.id === 'image-compressor') || TOOLS_REGISTRY[2],
    TOOLS_REGISTRY.find(t => t.id === 'word-counter') || TOOLS_REGISTRY[3],
    TOOLS_REGISTRY.find(t => t.id === 'qr-code-generator') || TOOLS_REGISTRY[4],
    TOOLS_REGISTRY.find(t => t.id === 'youtube-money-calculator') || TOOLS_REGISTRY[5],
    TOOLS_REGISTRY.find(t => t.id === 'json-formatter') || TOOLS_REGISTRY[6],
    TOOLS_REGISTRY.find(t => t.id === 'password-generator') || TOOLS_REGISTRY[7],
  ].filter(Boolean);

  const popularKeywords = [
    'YouTube Multi-Extractor',
    'PDF Merger',
    'Image Compressor',
    'YouTube Tags',
    'YouTube Money Calculator',
    'Word Counter',
    'JSON Formatter',
    'QR Code',
    'Password Generator'
  ];

  const faqs = [
    {
      q: 'Are files or YouTube URLs uploaded or stored on any server?',
      a: 'Never. ToolNova operates with a 100% private, client-side model. All image processing, PDF operations, audio conversions, and YouTube metadata analysis happen directly in your browser. No files or personal inputs are uploaded to external servers.'
    },
    {
      q: 'Is ToolNova free to use with all tools available?',
      a: 'Yes, ToolNova (built in ToolkitBD style) is 100% free with unlimited usage, zero file size restrictions, and no registration or account required.'
    },
    {
      q: 'How does the YouTube All-in-One Multi-Extractor work?',
      a: 'Simply paste any YouTube video link or Shorts URL. In one screen, it extracts high-resolution 1080p thumbnails, SEO tags, viral hashtags, casing-optimized titles, timestamp chapters, embed code, channel ID, and engagement statistics.'
    },
    {
      q: 'Can I use these tools on mobile and tablet devices?',
      a: 'Absolutely! The entire platform is fully responsive and optimized for smartphones, tablets, laptops, and desktop screens with instant dark and light mode support.'
    }
  ];

  return (
    <div className="space-y-10 sm:space-y-14 pb-20">
      {/* Hero Section */}
      <section className="text-center pt-8 sm:pt-12 pb-2 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-4 sm:space-y-5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] sm:text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>ToolkitBD Style • 150+ Free Web Tools • Unlimited File Size • 100% Private</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.18] max-w-4xl mx-auto">
          Every Tool You Need.{' '}
          <span className="text-teal-600 dark:text-teal-400 block sm:inline">
            All in One Place.
          </span>
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Explore YouTube multi-extractors, PDF utilities, image editors, developer tools, text converters, and calculators. Zero upload limits, processed safely in your browser.
        </p>

        {/* Central Search Bar */}
        <div className="max-w-3xl mx-auto pt-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categories={CATEGORIES}
            resultCount={isSearchActive || selectedCategory !== 'all' ? filteredTools.length : undefined}
          />

          {/* Popular Search Keywords */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Quick Searches:</span>
            {popularKeywords.map(kw => (
              <button
                key={kw}
                type="button"
                onClick={() => handleKeywordClick(kw)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors text-[11px] sm:text-xs font-medium"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category Navigation Pills (ToolkitBD Style Sticky / Scrollable Filter) */}
      <section className="sticky top-16 z-30 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-md border-y border-slate-200/80 dark:border-slate-800/80 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleCategoryPillClick('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>All Tools ({TOOLS_REGISTRY.length})</span>
          </button>

          {CATEGORIES.map(cat => {
            const count = TOOLS_REGISTRY.filter(t => t.categorySlug === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryPillClick(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* When Search or Specific Category Filter is Active: Render Flat Results Grid */}
      {(isSearchActive || selectedCategory !== 'all') && (
        <section ref={searchResultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {searchQuery ? `Search Results for "${searchQuery}"` : `${CATEGORIES.find(c => c.slug === selectedCategory)?.name || selectedCategory}`} ({filteredTools.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-semibold py-1 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isFavorite(tool.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 sm:p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No tools matched your search query.</p>
              <p className="text-xs mt-1 text-slate-400">Try searching for "YouTube", "PDF", "Image", "Audio", "Password", or "Video".</p>
            </div>
          )}
        </section>
      )}

      {/* When Normal Home View (All Tools): Show Featured Tools + Full Category Tool Sections (ToolkitBD Layout) */}
      {!isSearchActive && selectedCategory === 'all' && (
        <div className="space-y-12 sm:space-y-16">
          {/* Featured / Trending Quick Access */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 fill-current" />
                <span>Trending & High Demand Tools</span>
              </div>
              <Link
                to="/popular"
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <span>View all popular</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {featuredTools.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isFavorite(tool.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>

          {/* ToolkitBD Core: All Tools Categorized Directly on Homepage */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-14">
            {CATEGORIES.map(category => {
              const toolsInCat = TOOLS_REGISTRY.filter(t => t.categorySlug === category.slug);
              if (toolsInCat.length === 0) return null;

              return (
                <section
                  key={category.id}
                  id={`cat-section-${category.slug}`}
                  className="space-y-4 scroll-mt-28"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-xs"
                        style={{ backgroundColor: category.color }}
                      >
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                            {category.name}
                          </h2>
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {toolsInCat.length} Tools
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/categories/${category.slug}`}
                      className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>Explore category</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {toolsInCat.map(tool => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        isFavorite={isFavorite(tool.id)}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {/* Why Choose ToolkitBD Style Platform */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              ToolkitBD Design Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Fast, Modern & Completely Free
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Everything in one view. Zero hidden fees, no upload quotas, and instant in-browser execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Unlimited File Size</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Work with gigabyte-sized video clips, high-res photos, and large multi-page PDF files locally without arbitrary 50MB caps.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Youtube className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Consolidated YouTube Suite</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Paste a single link to inspect tags, viral hashtags, 1080p thumbnails, descriptions, embed codes, and video statistics together.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Day & Night Mode</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Seamless instant toggle between light and dark themes with persistent memory and high readability across all cards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Common Questions
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 hover:text-teal-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-teal-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
