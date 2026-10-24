import React from 'react';
import { Eye, Keyboard, Monitor, Sparkles, Check } from 'lucide-react';

export const AccessibilityPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-4">
          <Eye className="w-3.5 h-3.5" />
          <span>Universal Access</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Accessibility Statement
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Our commitment to digital accessibility for all users worldwide.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Our Standards & Goal</h2>
          <p>
            ToolNova strives to ensure that its services are accessible to people with disabilities. We actively invest design and technical resources to ensure our site adheres to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA benchmarks.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Implemented Accessibility Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                <Keyboard className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Keyboard Navigability</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Full Tab, Shift+Tab, and Enter navigation across buttons, form inputs, and directory filters. Quick search activation with <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">Ctrl + K</code> or <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">/</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                <Monitor className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>High Contrast Themes</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Carefully tested color ratios in both light and dark modes to avoid low-contrast readability barriers.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Screen Reader Labels</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Aria labels, proper HTML5 landmark regions, and descriptive input titles for assistive technologies.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
              <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white mb-1">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Reduced Motion</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Strict adherence to <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">prefers-reduced-motion</code> media queries to eliminate vestibular discomfort.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Feedback & Reporting Barriers</h2>
          <p>
            We welcome ongoing feedback. If you encounter any accessibility barrier or have difficulty operating any tool, please let us know through our Contact page with details about your device and assistive technology.
          </p>
        </section>
      </div>
    </div>
  );
};
