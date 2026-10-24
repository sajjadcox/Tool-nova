import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-semibold mb-4">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms & Conditions
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Last updated: January 2026
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ToolNova ("the Platform", "we", "us"), you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Platform.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Permitted Use</h2>
          <p className="mb-2">
            ToolNova provides online web tools for personal, educational, commercial, and professional utility purposes. You agree to use the services only for lawful purposes and in accordance with these Terms.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>You agree not to use the tools to process malicious code, viruses, or illegal material.</li>
            <li>You agree not to attempt to disrupt or overwhelm our infrastructure with denial of service attacks.</li>
            <li>You are responsible for retaining backups of any original files transformed through our tools.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Intellectual Property Rights</h2>
          <p>
            You retain 100% full ownership, copyright, and intellectual property rights in and to any files, text, images, or content you process with our tools. ToolNova does not claim any rights to your input data or generated outputs. The ToolNova trademark, branding, and user interface code are protected under intellectual property laws.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. Disclaimer of Warranties</h2>
          <p>
            ToolNova is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. Limitation of Liability</h2>
          <p>
            In no event shall ToolNova or its operators be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, profits, or goodwill, arising out of your access to or use of the tools.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">6. Modifications to Service</h2>
          <p>
            We reserve the right to modify, replace, or discontinue tools or features at any time without notice. Continued use following changes implies acceptance.
          </p>
        </section>
      </div>
    </div>
  );
};
