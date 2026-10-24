import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-4">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Notice & Disclaimers</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Disclaimer
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Important disclosures concerning mathematical, financial, security, and document tools.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-10 space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">1. No Financial or Tax Advice</h2>
          <p>
            Calculators provided on ToolNova (including Loan EMI, Compound Interest, Profit & Loss, and Discount Calculators) are intended for educational and general estimation purposes only. Results should not be construed as certified financial, legal, investment, or tax advice. Always consult a qualified CPA or certified financial advisor for formal transactions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">2. Health & Fitness Calculations</h2>
          <p>
            The Body Mass Index (BMI) and Calorie/Fitness tools provide statistical approximations based on standard population formulas. They do not substitute for individual medical advice, clinical diagnostics, or personalized consultations with a licensed healthcare physician.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">3. Cryptographic and Password Generation</h2>
          <p>
            While our password and cryptographic token generators rely on cryptographically secure pseudorandom number generation (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-teal-600">window.crypto.getRandomValues</code>), users are ultimately responsible for implementing comprehensive security hygiene, multi-factor authentication (MFA), and secure storage vaults.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">4. File Integrity & Backups</h2>
          <p>
            Client-side transformations (such as PDF splitting, compression, image transcoding, and text deduplication) modify file buffers in RAM. Users should always retain an untouched backup copy of critical or sensitive files prior to applying transformations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">5. External Links</h2>
          <p>
            ToolNova may contain links to third-party references (e.g., official specifications, RFC documents, or external resources). We do not control or endorse the content of third-party websites.
          </p>
        </section>
      </div>
    </div>
  );
};
