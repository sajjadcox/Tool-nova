import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';
import { TOOLS_REGISTRY } from '../data/tools';
import { ToolCard } from '../components/cards/ToolCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { IconResolver } from '../components/common/IconResolver';
import { useFavorites } from '../hooks/useFavorites';
import { EmptyState } from '../components/common/EmptyState';

export const CategoryDetailPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();

  const category = CATEGORIES.find(c => c.slug === categorySlug);
  const tools = TOOLS_REGISTRY.filter(t => t.categorySlug === categorySlug);

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          title="Category Not Found"
          description="The category you are looking for does not exist."
          actionLabel="View All Categories"
          actionPath="/categories"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 sm:space-y-8">
      <Breadcrumbs
        items={[
          { label: 'All Categories', path: '/categories' },
          { label: category.name }
        ]}
      />

      {/* Category Header Banner */}
      <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
          <IconResolver name={category.icon} className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
              Category
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs font-semibold text-slate-500">
              {tools.length} Tools Available
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {category.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {tools.map(tool => (
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
