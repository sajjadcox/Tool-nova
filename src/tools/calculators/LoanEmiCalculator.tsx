import React, { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const LoanEmiCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<number | ''>(250000);
  const [interestRate, setInterestRate] = useState<number | ''>(6.5);
  const [tenureYears, setTenureYears] = useState<number | ''>(15);

  const P = loanAmount === '' ? 0 : loanAmount;
  const rateVal = interestRate === '' ? 0 : interestRate;
  const yearsVal = tenureYears === '' ? 0 : tenureYears;

  const calculateEmi = () => {
    const r = rateVal / (12 * 100); // monthly interest
    const n = yearsVal * 12; // total months

    if (P <= 0 || r <= 0 || n <= 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };

    // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment)
    };
  };

  const results = calculateEmi();

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
        <div>
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            <span>Loan Amount ($)</span>
            <input
              type="number"
              value={loanAmount}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onChange={(e) => setLoanAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-32 px-2.5 py-1 text-right font-mono text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>
          <input
            type="range"
            min="5000"
            max="1000000"
            step="5000"
            value={P}
            onChange={(e) => setLoanAmount(parseInt(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            <span>Interest Rate (% per year)</span>
            <input
              type="number"
              step="0.1"
              value={interestRate}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onChange={(e) => setInterestRate(e.target.value === '' ? '' : parseFloat(e.target.value))}
              className="w-24 px-2.5 py-1 text-right font-mono text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="0.1"
            value={rateVal}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            <span>Loan Tenure (Years)</span>
            <input
              type="number"
              value={tenureYears}
              placeholder="0"
              onFocus={(e) => e.target.select()}
              onChange={(e) => setTenureYears(e.target.value === '' ? '' : parseInt(e.target.value))}
              className="w-24 px-2.5 py-1 text-right font-mono text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
            />
          </div>
          <input
            type="range"
            min="1"
            max="30"
            value={yearsVal}
            onChange={(e) => setTenureYears(parseInt(e.target.value))}
            className="w-full accent-teal-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Results Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300 block">
            Monthly EMI
          </span>
          <span className="text-3xl font-extrabold font-mono text-teal-600 dark:text-teal-400">
            ${results.emi.toLocaleString()}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Interest
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            ${results.totalInterest.toLocaleString()}
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Total Payment
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100">
            ${results.totalPayment.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="flex justify-center">
        <ShareResultButton
          toolName="Loan EMI Calculator"
          resultSummary={`$${P.toLocaleString()} loan at ${rateVal}% for ${yearsVal} years = Monthly EMI: $${results.emi.toLocaleString()} (Total Payment: $${results.totalPayment.toLocaleString()})`}
        />
      </div>
    </div>
  );
};
