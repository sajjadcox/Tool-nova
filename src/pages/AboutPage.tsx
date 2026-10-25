import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Lock, Sparkles, Layers, Globe, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Mission & Story</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About <span className="text-teal-600 dark:text-teal-400">ToolNova</span>
        </h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Every tool you need, engineered for performance, precision, and uncompromised privacy.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">100% Client-Side Privacy</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Your files, documents, and code never leave your machine. All transformations happen directly in your browser using modern WebAssembly, Canvas, and Web Crypto APIs.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Lightning Fast Execution</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Zero upload latency, zero queue waiting times, and no artificial file size throttles. Processing executes immediately at local hardware speeds.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Clean, Ad-Free Focus</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We avoid annoying popups, deceitful download buttons, and intrusive ad networks. Every tool is clean, direct, and distraction-free.
          </p>
        </div>
      </div>

      {/* Main Narrative */}
      <div className="prose prose-slate dark:prose-invert max-w-none mb-16 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why We Built ToolNova</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          The modern web is full of tool websites, but most of them are frustrating: cluttered with deceptive banner ads, slow server uploads that put private data at risk, paywalls after single uses, or broken dummy forms.
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          ToolNova was born out of a desire for a clean, trustworthy utility belt that software developers, digital marketers, designers, students, and professionals can bookmark with confidence. Whether compressing confidential contract PDFs, calculating financial figures, formatting SQL queries, or generating cryptographic tokens, you know your work remains entirely confidential.
        </p>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-6 mb-3">Core Platform Pillars</h3>
        <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc pl-5">
          <li><strong>Authentic Utilities:</strong> No pseudo-interfaces. If a tool is listed, its algorithms perform the actual operation.</li>
          <li><strong>Modern Design:</strong> Consistent UI components, responsive layout, dark/light modes, keyboard shortcuts (like Ctrl+K navigation).</li>
          <li><strong>Accessible & Intuitive:</strong> High contrast, clear input/output inspection, one-click copy, and automatic download actions.</li>
        </ul>
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl p-8 sm:p-10 bg-gradient-to-r from-teal-500 to-indigo-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg shadow-teal-500/10">
        <div>
          <h3 className="text-2xl font-bold">Ready to streamline your workflow?</h3>
          <p className="mt-1 text-teal-100 text-sm">
            Explore our curated directory of 255+ web tools across 15 categories today.
          </p>
        </div>
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-teal-700 font-semibold text-sm hover:bg-teal-50 transition-colors shadow-sm whitespace-nowrap"
        >
          <span>Explore All Tools</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
