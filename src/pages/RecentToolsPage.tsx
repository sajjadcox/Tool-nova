import React from 'react';
import { TOOLS_REGISTRY } from '../data/tools';
import { ToolCard } from '../components/cards/ToolCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { useRecentTools } from '../hooks/useRecentTools';
import { useFavorites } from '../hooks/useFavorites';
import { Clock, Trash2 } from 'lucide-react';

export const RecentToolsPage: React.FC = () => {
  const { recentToolIds, clearRecentTools } = useRecentTools();
  const { isFavorite, toggleFavorite } = useFavorites();

  const recentTools = recentToolIds
    .map(id => TOOLS_REGISTRY.find(t => t.id === id))
    .filter((t): t is typeof TOOLS_REGISTRY[0] => !!t);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 sm:space-y-8">
      <Breadcrumbs items={[{ label: 'Recently Used Tools' }]} />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-bold text-xs uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Recent History</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Recently Visited Tools ({recentTools.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Quickly resume work on utilities you've recently used in this browser session.
          </p>
        </div>

        {recentTools.length > 0 && (
          <button
            type="button"
            onClick={clearRecentTools}
            className="self-start px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-rose-500 flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {recentTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {recentTools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={isFavorite(tool.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No recent tools visited"
          description="Tools you open will automatically appear here for quick access next time."
          actionLabel="Explore All Tools"
          actionPath="/tools"
        />
      )}
    </div>
  );
};
