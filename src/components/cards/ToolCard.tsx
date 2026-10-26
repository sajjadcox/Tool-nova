import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { ToolDefinition } from '../../types';
import { IconResolver } from '../common/IconResolver';

interface ToolCardProps {
  tool: ToolDefinition;
  isFavorite?: boolean;
  onToggleFavorite?: (toolId: string) => void;
  compact?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFavorite = false,
  onToggleFavorite,
  compact = false
}) => {
  return (
    <Link
      to={tool.route}
      className="group relative block bg-white dark:bg-[#131C31] rounded-xl sm:rounded-2xl border border-slate-200/90 dark:border-slate-800/80 hover:border-teal-500/60 dark:hover:border-teal-400/60 p-3.5 sm:p-4 shadow-2xs hover:shadow-lg hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top category & favorite row */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase truncate">
            {tool.category}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
              Free
            </span>
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(tool.id);
                }}
                className={`p-1 rounded-md transition-colors z-10 ${
                  isFavorite
                    ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                    : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
                aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Tool Icon & Name */}
        <div className="flex items-start gap-2.5 sm:gap-3 mb-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-800/60 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0 group-hover:bg-teal-600 group-hover:text-white group-hover:scale-105 transition-all">
            <IconResolver name={tool.icon} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors text-xs sm:text-sm flex items-center gap-1 leading-snug">
              <span className="truncate">{tool.name}</span>
              {tool.featured && (
                <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              )}
            </h3>
          </div>
        </div>

        {/* Short Description */}
        {!compact && (
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {tool.description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] mt-1">
        <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-teal-700 dark:text-teal-400 font-medium">
          <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          <span>Local</span>
        </div>

        <div className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          <span>Open Tool</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
