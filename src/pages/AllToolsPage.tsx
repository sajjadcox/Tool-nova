import React, { useState } from 'react';
import { TOOLS_REGISTRY } from '../data/tools';
import { CATEGORIES } from '../data/categories';
import { ToolCard } from '../components/cards/ToolCard';
import { SearchBar } from '../components/search/SearchBar';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { EmptyState } from '../components/common/EmptyState';
import { useFavorites } from '../hooks/useFavorites';

export const AllToolsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { isFavorite, toggleFavorite } = useFavorites();

  const filteredTools = TOOLS_REGISTRY.filter(tool => {
    const matchesSearch = !searchQuery.trim() ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || tool.categorySlug === selectedCategory;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 sm:space-y-8">
      <Breadcrumbs items={[{ label: 'All Tools' }]} />

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          All Online Tools Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Browse and search our full directory of free online web tools. Fast in-browser processing with zero server uploads.
        </p>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={CATEGORIES}
          resultCount={filteredTools.length}
        />
      </div>

      {/* Grid of Tools */}
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
        <EmptyState
          title="No tools found"
          description={`No tools found matching "${searchQuery}". Please check your spelling or clear your filters.`}
          actionLabel="Clear Filters"
          onAction={() => { setSearchQuery(''); setSelectedCategory('all'); }}
        />
      )}
    </div>
  );
};
