import React from 'react';
import { TOOLS_REGISTRY } from '../data/tools';
import { ToolCard } from '../components/cards/ToolCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { useFavorites } from '../hooks/useFavorites';
import { Heart } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteTools = favorites
    .map(id => TOOLS_REGISTRY.find(t => t.id === id))
    .filter((t): t is typeof TOOLS_REGISTRY[0] => !!t);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 sm:space-y-8">
      <Breadcrumbs items={[{ label: 'Saved Favorites' }]} />

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider">
          <Heart className="w-4 h-4 fill-current" />
          <span>My Collection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Your Saved Favorite Tools ({favoriteTools.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Quickly access your bookmarked tools. Saved in your local browser storage for easy everyday access.
        </p>
      </div>

      {favoriteTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {favoriteTools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No favorites saved yet"
          description="Click the heart icon on any tool card or tool page to save your frequently used utilities here."
          actionLabel="Explore Tools Directory"
          actionPath="/tools"
        />
      )}
    </div>
  );
};
