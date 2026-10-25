import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  Check, 
  ShieldCheck, 
  HelpCircle, 
  Info,
  Sparkles,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { ToolDefinition } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { IconResolver } from '../common/IconResolver';
import { ToolCard } from '../cards/ToolCard';
import { TOOLS_REGISTRY } from '../../data/tools';
import { useFavorites } from '../../hooks/useFavorites';
import { useRecentTools } from '../../hooks/useRecentTools';
import { ShareResultButton } from '../common/ShareResultButton';

import { useSEO } from '../../hooks/useSEO';

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: React.ReactNode;
  instructions?: string[];
  faq?: { question: string; answer: string }[];
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({
  tool,
  children,
  instructions,
  faq
}) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addRecentTool } = useRecentTools();

  // Full SEO Optimization (Page Title, Meta Description, OpenGraph, Canonical, Schema.org JSON-LD)
  useSEO({ tool });

  useEffect(() => {
    // Record as recently used
    addRecentTool(tool.id);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tool.id]);

  const relatedTools = (tool.relatedToolIds || [])
    .map(id => TOOLS_REGISTRY.find(t => t.id === id))
    .filter((t): t is ToolDefinition => !!t)
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 sm:space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'All Tools', path: '/tools' },
          { label: tool.category, path: `/categories/${tool.categorySlug}` },
          { label: tool.name }
        ]}
      />

      {/* Tool Header Card */}
      <div className="bg-white dark:bg-[#131C31] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 shadow-xs">
              <IconResolver name={tool.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <Link
                  to={`/categories/${tool.categorySlug}`}
                  className="font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 hover:underline text-[11px]"
                >
                  {tool.category}
                </Link>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Client-Side Fast
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {tool.name}
              </h1>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => toggleFavorite(tool.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold border transition-all ${
                isFavorite(tool.id)
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite(tool.id) ? 'fill-current' : ''}`} />
              <span>{isFavorite(tool.id) ? 'Favorited' : 'Favorite'}</span>
            </button>

            <ShareResultButton
              toolName={tool.name}
              resultSummary={`Check out ${tool.name} on ToolNova Tool Kit: ${tool.description}`}
            />
          </div>
        </div>

        {/* Privacy Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-teal-700 dark:text-teal-400 font-medium text-[11px] sm:text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{tool.privacyInfo}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px] font-mono">
            <span>Runs in browser RAM</span>
            <span>•</span>
            <span>Zero server upload</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Tool Body */}
      <div className="bg-white dark:bg-[#131C31] rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 md:p-8 shadow-xs transition-colors">
        {children}
      </div>

      {/* Rich Informational & Explanatory Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* What is this tool & use cases */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Info className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3>What is {tool.name} used for?</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            <strong>{tool.name}</strong> is designed to solve common digital workflow tasks quickly and privately. Whether you are optimizing content for website speed, converting file formats, calculating essential formulas, or formatting code for development, this tool provides instant results without software installation or cloud uploads.
          </p>

          <div className="pt-1 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              Key Advantages:
            </span>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc pl-4">
              <li>Immediate client-side execution with zero wait time.</li>
              <li>Complete data privacy: inputs remain in local browser RAM.</li>
              <li>Free and unlimited usage across mobile, tablet, and desktop devices.</li>
            </ul>
          </div>
        </div>

        {/* Step by Step Instructions */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <HelpCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3>How to use {tool.name}</h3>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {instructions && instructions.length > 0 ? (
              instructions.map((inst, idx) => (
                <li key={idx} className="pl-1">
                  <span>{inst}</span>
                </li>
              ))
            ) : (
              <>
                <li className="pl-1">Select, enter, or upload your file or data into the tool above.</li>
                <li className="pl-1">Adjust preferences, output parameters, or compression settings.</li>
                <li className="pl-1">View the live results and metrics generated immediately.</li>
                <li className="pl-1">Use the <strong>Copy</strong> or <strong>Download</strong> button to save your output.</li>
              </>
            )}
          </ol>
        </div>
      </div>

      {/* Related Tools Grid */}
      {relatedTools.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Related Tools in {tool.category}
            </h3>
            <Link
              to={`/categories/${tool.categorySlug}`}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {relatedTools.map(relTool => (
              <ToolCard key={relTool.id} tool={relTool} compact />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
