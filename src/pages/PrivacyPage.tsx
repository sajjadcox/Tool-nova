import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, HardDrive, CheckCircle } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy-First Architecture</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Last updated: January 2026 • Effective immediately
        </p>
      </div>

      {/* Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20 text-center">
          <Lock className="w-6 h-6 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">No Server File Uploads</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Your files remain in your browser memory</p>
        </div>
        <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-center">
          <EyeOff className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Zero Personal Tracking</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">No cross-site trackers or intrusive analytics</p>
        </div>
        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
          <HardDrive className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Local Storage Only</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Favorites & recent tools stay on your device</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold">1</span>
            Core Privacy Principle
          </h2>
          <p>
            ToolNova was specifically designed on a client-first, zero-knowledge premise. The vast majority of our tools execute 100% locally on your computer or smartphone via browser capabilities like the HTML5 Canvas API, Web Audio API, Web Cryptography API (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-teal-600">window.crypto.subtle</code>), and local WebAssembly binaries.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold">2</span>
            Data Collection & Handling
          </h2>
          <p className="mb-2">
            <strong>Files & Documents:</strong> When you select or drop a PDF, image, audio file, or text file into a ToolNova tool, the data is buffered strictly in your browser's private memory heap (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-teal-600">Blob / ArrayBuffer</code>). We do NOT transmit, inspect, retain, or back up your files on any remote server. Once you close the tab, the memory is purged.
          </p>
          <p>
            <strong>Local Storage:</strong> If you bookmark tools ("Favorite") or use tools (appearing in "Recently Used"), this preference data is saved strictly inside your browser's <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-teal-600">localStorage</code>. You can purge this at any time by clearing your browser cache.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold">3</span>
            Cookies and Tracking
          </h2>
          <p>
            ToolNova does not utilize invasive profiling cookies, behavior advertising beacons, or fingerprinting scripts. We do not sell, rent, or monetize your usage data with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold">4</span>
            Security Best Practices
          </h2>
          <p>
            All network communication with ToolNova is strictly enforced over Hypertext Transfer Protocol Secure (HTTPS) using TLS encryption.
          </p>
        </section>

        <section className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            If you have questions about how a particular algorithm handles memory or security, contact our team through the Contact page.
          </p>
        </section>
      </div>
    </div>
  );
};
