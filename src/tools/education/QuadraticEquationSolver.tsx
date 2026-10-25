import React, { useState } from 'react';
import { FunctionSquare, CheckCircle2, AlertCircle } from 'lucide-react';

export const QuadraticEquationSolver: React.FC = () => {
  const [a, setA] = useState<number>(1);
  const [b, setB] = useState<number>(-5);
  const [c, setC] = useState<number>(6);

  // Solve ax^2 + bx + c = 0
  const discriminant = (b * b) - (4 * a * c);

  let root1 = '';
  let root2 = '';
  let nature = '';

  if (a === 0) {
    nature = 'Linear equation (a cannot be zero for quadratic)';
  } else if (discriminant > 0) {
    const r1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const r2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    root1 = r1.toFixed(4);
    root2 = r2.toFixed(4);
    nature = 'Two distinct real roots';
  } else if (discriminant === 0) {
    const r = -b / (2 * a);
    root1 = r.toFixed(4);
    root2 = r.toFixed(4);
    nature = 'Two equal real roots (Single repeated root)';
  } else {
    const realPart = (-b / (2 * a)).toFixed(4);
    const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
    root1 = `${realPart} + ${imagPart}i`;
    root2 = `${realPart} - ${imagPart}i`;
    nature = 'Two complex / imaginary conjugate roots';
  }

  // Vertex coordinates (h, k)
  const h = a !== 0 ? (-b / (2 * a)).toFixed(4) : '0';
  const k = a !== 0 ? (c - (b * b) / (4 * a)).toFixed(4) : '0';

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 text-xs font-bold">
            <FunctionSquare className="w-4 h-4" />
            <span>Algebra & Polynomial Solver</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Quadratic Equation Solver
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            ax&sup2; + bx + c = 0
          </p>
        </div>

        {/* Coefficient Inputs */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Coefficient a:</label>
            <input
              type="number"
              step="any"
              value={a}
              onChange={(e) => setA(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-mono font-bold text-base"
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Coefficient b:</label>
            <input
              type="number"
              step="any"
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-mono font-bold text-base"
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">Constant c:</label>
            <input
              type="number"
              step="any"
              value={c}
              onChange={(e) => setC(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-center font-mono font-bold text-base"
            />
          </div>
        </div>

        {/* Current Equation Display */}
        <div className="p-3 text-center bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-sm font-bold text-violet-600 dark:text-violet-400">
          {a}x&sup2; {b >= 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`} {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`} = 0
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Root 1 (x₁)
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-200 font-mono">
              x₁ = {root1 || 'N/A'}
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              Root 2 (x₂)
            </span>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-200 font-mono">
              x₂ = {root2 || 'N/A'}
            </p>
          </div>
        </div>

        {/* Math Details */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <span className="font-semibold text-slate-500">Discriminant (&Delta; = b&sup2; - 4ac):</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{discriminant}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <span className="font-semibold text-slate-500">Nature of Roots:</span>
            <span className="font-semibold text-violet-600 dark:text-violet-400">{nature}</span>
          </div>
          <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
            <span className="font-semibold text-slate-500">Parabola Vertex (h, k):</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">({h}, {k})</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-slate-500">Axis of Symmetry:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">x = {h}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
