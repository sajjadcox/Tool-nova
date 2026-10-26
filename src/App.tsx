/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';

const AllToolsPage = lazy(() => import('./pages/AllToolsPage').then(m => ({ default: m.AllToolsPage })));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage').then(m => ({ default: m.CategoryDetailPage })));
const ToolDetailPage = lazy(() => import('./pages/ToolDetailPage').then(m => ({ default: m.ToolDetailPage })));
const PopularToolsPage = lazy(() => import('./pages/PopularToolsPage').then(m => ({ default: m.PopularToolsPage })));
const FavoritesPage = lazy(() => import('./pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const RecentToolsPage = lazy(() => import('./pages/RecentToolsPage').then(m => ({ default: m.RecentToolsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const AccessibilityPage = lazy(() => import('./pages/AccessibilityPage').then(m => ({ default: m.AccessibilityPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const RouteLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center py-16">
    <div className="w-10 h-10 border-3 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mb-4" />
    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading page...</span>
  </div>
);

// Scroll to top helper when navigating routes
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
};

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#0B1220] dark:text-slate-100 transition-colors duration-200">
        <Header />
        <main className="flex-1">
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/index.html" element={<HomePage />} />
              <Route path="/tools" element={<AllToolsPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/:categorySlug" element={<CategoryDetailPage />} />
              <Route path="/tools/:toolSlug" element={<ToolDetailPage />} />
              <Route path="/popular" element={<PopularToolsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/recent" element={<RecentToolsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}
