import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CategoryDefinition } from '../../types';
import { IconResolver } from '../common/IconResolver';

interface CategoryCardProps {
  category: CategoryDefinition;
  toolCount: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, toolCount }) => {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group relative p-6 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800/80 hover:border-teal-500/60 dark:hover:border-teal-400/60 shadow-xs hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800/60 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:bg-teal-600 group-hover:text-white group-hover:scale-105 transition-all duration-200">
            <IconResolver name={category.icon} className="w-6 h-6" />
          </div>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {toolCount} tools
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors mb-2">
          {category.name}
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {category.description}
        </p>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <span>Browse tools</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};
