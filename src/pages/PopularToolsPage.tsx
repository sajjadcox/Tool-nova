import React from 'react';
import { TOOLS_REGISTRY } from '../data/tools';
import { ToolCard } from '../components/cards/ToolCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { useFavorites } from '../hooks/useFavorites';
import { Flame } from 'lucide-react';

export const PopularToolsPage: React.FC = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const popularTools = TOOLS_REGISTRY.filter(t => t.popular);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 sm:space-y-8">
      <Breadcrumbs items={[{ label: 'Popular Tools' }]} />

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
          <Flame className="w-4 h-4 fill-current" />
          <span>Curated Picks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Most Popular Web Tools
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          The most frequently used tools for daily tasks: image compression, audio trimming, screen recording, PDF manipulation, and developer utilities.
        </p>
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
    </div>
  );
};
