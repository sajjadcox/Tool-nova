import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Compass, AlertCircle } from 'lucide-react';
import { categories } from '../data/categories';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
        <span className="text-3xl font-black">404</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
        Page Not Found
      </h1>
      <p className="text-base text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-8">
        The tool or page you're looking for doesn't exist, has been renamed, or has moved to a new route.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm transition-colors shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Go to Homepage</span>
        </Link>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm transition-colors"
        >
          <Search className="w-4 h-4" />
          <span>Browse All 160+ Tools</span>
        </Link>
      </div>

      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-left">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white mb-3">
          <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <span>Or explore by popular category:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/categories/${cat.slug}`}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-900/30 hover:text-teal-600 dark:hover:text-teal-400 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
