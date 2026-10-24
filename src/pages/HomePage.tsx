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
  Search
} from 'lucide-react';
import { TOOLS_REGISTRY } from '../data/tools';
import { CATEGORIES } from '../data/categories';
import { SearchBar } from '../components/search/SearchBar';
import { ToolCard } from '../components/cards/ToolCard';
import { CategoryCard } from '../components/cards/CategoryCard';
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

  const isSearchOrFilterActive = searchQuery.trim() !== '' || selectedCategory !== 'all';

  useEffect(() => {
    if (isSearchOrFilterActive) {
      const timer = setTimeout(() => {
        searchResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, selectedCategory, isSearchOrFilterActive]);

  const handleKeywordClick = (kw: string) => {
    setSearchQuery(kw);
    setSelectedCategory('all');
  };

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId);
  };

  const popularTools = TOOLS_REGISTRY.filter(t => t.popular).slice(0, 8);

  const popularKeywords = [
    'YouTube Tools',
    'Image Compressor',
    'PDF Merger',
    'YouTube Tag Extractor',
    'Audio Trimmer',
    'Word Counter',
    'YouTube Money Calculator',
    'JSON Formatter',
    'Password Generator',
    'QR Code',
    'Screen Recorder'
  ];

  const faqs = [
    {
      q: 'Are my files and documents uploaded to any remote servers?',
      a: 'Never. ToolNova operates with a strict 100% client-side privacy architecture. All image transformations, audio processing, PDF merging, text diffing, and cryptographic operations execute directly inside your browser memory using HTML5, Web Audio, Web Crypto, and Canvas APIs. No file data is ever transmitted or stored remotely.'
    },
    {
      q: 'Is ToolNova free to use?',
      a: 'Yes, ToolNova is 100% free with unlimited usage and zero registration required. There are no paywalls, hidden limits, or credit card requirements.'
    },
    {
      q: 'Can I use ToolNova offline?',
      a: 'Yes! Once you load the ToolNova web application in your browser, the tools continue to execute entirely client-side even if your internet connection disconnects.'
    },
    {
      q: 'Does ToolNova require any third-party API keys?',
      a: 'No. All utilities run natively in your browser using standardized Web APIs and WebAssembly. No external API keys or subscriptions are needed.'
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="text-center pt-8 sm:pt-14 pb-4 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-5 sm:space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 text-[11px] sm:text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>100% Client-Side Privacy • Zero Server Uploads • Fast & Free</span>
        </div>

        {/* Hero Headline with Clean, Vibrant Styling */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.18] max-w-4xl mx-auto">
          Every Tool You Need.{' '}
          <span className="text-teal-600 dark:text-teal-400 block sm:inline">
            All in One Place.
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Discover high-performance, private web tools for images, audio, video, documents, coding, security, and productivity. Runs locally in your browser.
        </p>

        {/* Central Search Bar */}
        <div className="max-w-3xl mx-auto pt-2">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
            categories={CATEGORIES}
            resultCount={isSearchOrFilterActive ? filteredTools.length : undefined}
          />

          {/* Popular Search Keywords */}
          <div className="flex items-center justify-center gap-1.5 flex-wrap pt-3 text-xs text-slate-500">
            <span className="font-semibold text-slate-400">Popular:</span>
            {popularKeywords.map(kw => (
              <button
                key={kw}
                type="button"
                onClick={() => handleKeywordClick(kw)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 hover:bg-teal-50 hover:text-teal-600 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors text-[11px] sm:text-xs"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Zero Uploads</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Instant Speed</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <Lock className="w-4 h-4 text-indigo-500" />
            <span>100% Private</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Free Forever</span>
          </div>
        </div>
      </section>

      {/* Instant Search / Filter Results */}
      {isSearchOrFilterActive && (
        <section ref={searchResultsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {searchQuery ? `Results for "${searchQuery}"` : `Category: ${CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory}`} ({filteredTools.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold py-1 px-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
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
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No tools matched your search criteria.</p>
              <p className="text-xs mt-1 text-slate-400">Try searching for "PDF", "Image", "Audio", "Password", or "Video".</p>
            </div>
          )}
        </section>
      )}

      {/* Featured / Most Popular Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>Most Popular</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Essential Tools
            </h2>
          </div>

          <Link
            to="/popular"
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {popularTools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={isFavorite(tool.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-[11px] sm:text-xs uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Browse by Category</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tool Suites & Categories
            </h2>
          </div>

          <Link
            to="/categories"
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
          >
            <span>All categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {CATEGORIES.map(category => {
            const count = TOOLS_REGISTRY.filter(t => t.categorySlug === category.slug).length;
            return (
              <CategoryCard
                key={category.id}
                category={category}
                toolCount={count}
              />
            );
          })}
        </div>
      </section>

      {/* Why Choose ToolNova */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
              Built For Speed & Security
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Why Choose ToolNova Tool Kit?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Designed from the ground up to respect digital privacy, run immediately with zero queue time, and execute locally in browser memory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your images, audio tracks, PDFs, and code never leave your browser. Zero cloud uploads and zero risk of data leaks.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Instant Hardware Processing</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Leverages your device's native GPU, Canvas, and Web Audio APIs for high-speed file manipulation and calculations.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% Tested & Functional</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                No fake mockups or non-working buttons. Every tool in ToolNova performs real computations with immediate copy and file download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            Help & Answers
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

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-teal-600 via-teal-700 to-indigo-700 text-white text-center space-y-4 shadow-lg shadow-teal-500/10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Streamline Your Daily Workflow?
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 max-w-lg mx-auto leading-relaxed">
            Save time and protect your confidential documents with private, client-side tools designed for modern creators.
          </p>
          <div className="pt-2">
            <Link
              to="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-900 font-bold text-xs sm:text-sm hover:bg-teal-50 transition-all shadow-md active:scale-98"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
