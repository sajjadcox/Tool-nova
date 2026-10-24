import React from 'react';
import { CATEGORIES } from '../data/categories';
import { TOOLS_REGISTRY } from '../data/tools';
import { CategoryCard } from '../components/cards/CategoryCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 sm:space-y-8">
      <Breadcrumbs items={[{ label: 'Categories' }]} />

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Tool Categories
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Explore our 15 specialized tool suites designed to help developers, creators, marketers, students, and power users.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
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
    </div>
  );
};
