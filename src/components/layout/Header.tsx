import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sun, 
  Moon, 
  Heart, 
  Clock, 
  Grid, 
  Layers, 
  Flame, 
  Menu, 
  X,
  Search,
  Sparkles,
  HelpCircle,
  Mail,
  Home
} from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useFavorites } from '../../hooks/useFavorites';
import { TOOLS_REGISTRY } from '../../data/tools';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'All Tools', path: '/tools', icon: Grid, badge: TOOLS_REGISTRY.length },
    { label: 'Categories', path: '/categories', icon: Layers },
    { label: 'Popular', path: '/popular', icon: Flame },
    { label: 'Favorites', path: '/favorites', icon: Heart, badge: favorites.length > 0 ? favorites.length : undefined },
    { label: 'Recent', path: '/recent', icon: Clock },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-[#0B1220]/95 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          {/* Custom Modern Nova Prism Logo */}
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 via-teal-600 to-indigo-600 p-0.5 shadow-sm shadow-teal-500/25 group-hover:shadow-teal-500/40 group-hover:scale-105 transition-all">
            <div className="w-full h-full rounded-[10px] bg-[#0B1220] flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5 text-teal-400">
                <path
                  d="M16 2L20.2 11.8L30 16L20.2 20.2L16 30L11.8 20.2L2 16L11.8 11.8L16 2Z"
                  fill="url(#nova-grad)"
                />
                <circle cx="16" cy="16" r="3" fill="#ffffff" />
                <defs>
                  <linearGradient id="nova-grad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#14b8a6" />
                    <stop offset="0.5" stopColor="#06b6d4" />
                    <stop offset="1" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
              Tool<span className="text-teal-600 dark:text-teal-400">Nova</span>
            </span>
            <span className="font-medium text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80">
              Tool Kit
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold flex items-center gap-1.5 transition-all ${
                  active
                    ? 'text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
                {link.badge !== undefined && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-600 text-white dark:bg-teal-500">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Search link */}
          <Link
            to="/tools"
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title="Search tools"
            aria-label="Search tools"
          >
            <Search className="w-4 h-4" />
          </Link>

          {/* Theme switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Mobile menu hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-teal-600" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#0B1220]/98 backdrop-blur-md px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'text-teal-700 bg-teal-50 dark:text-teal-300 dark:bg-teal-950/50'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-600 text-white">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 px-3">
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-teal-600 dark:hover:text-teal-400 py-1"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-teal-600 dark:hover:text-teal-400 py-1"
            >
              Contact
            </Link>
            <Link
              to="/privacy-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="hover:text-teal-600 dark:hover:text-teal-400 py-1"
            >
              Privacy
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
