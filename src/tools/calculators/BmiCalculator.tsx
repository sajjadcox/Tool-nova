import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export const BmiCalculator: React.FC = () => {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(9);
  const [weightLbs, setWeightLbs] = useState<number>(154);

  const calculateBmi = () => {
    let bmi = 0;
    if (unitSystem === 'metric') {
      const hM = heightCm / 100;
      if (hM > 0) bmi = weightKg / (hM * hM);
    } else {
      const totalInches = feet * 12 + inches;
      if (totalInches > 0) bmi = (weightLbs / (totalInches * totalInches)) * 703;
    }
    return parseFloat(bmi.toFixed(1));
  };

  const bmi = calculateBmi();

  const getCategory = (b: number) => {
    if (b < 18.5) return { label: 'Underweight', color: 'text-amber-500', barPos: 'w-[20%]' };
    if (b < 25) return { label: 'Normal / Healthy Weight', color: 'text-emerald-600', barPos: 'w-[45%]' };
    if (b < 30) return { label: 'Overweight', color: 'text-orange-500', barPos: 'w-[70%]' };
    return { label: 'Obese', color: 'text-rose-600', barPos: 'w-[95%]' };
  };

  const category = getCategory(bmi);

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Unit system toggle */}
      <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex text-xs font-semibold">
        <button
          type="button"
          onClick={() => setUnitSystem('metric')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            unitSystem === 'metric' ? 'bg-white dark:bg-slate-900 shadow-xs text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Metric (cm / kg)
        </button>
        <button
          type="button"
          onClick={() => setUnitSystem('imperial')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            unitSystem === 'imperial' ? 'bg-white dark:bg-slate-900 shadow-xs text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Imperial (ft, in / lbs)
        </button>
      </div>

      {/* Input Fields */}
      <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        {unitSystem === 'metric' ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Height (cm)</label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Feet</label>
              <input
                type="number"
                value={feet}
                onChange={(e) => setFeet(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Inches</label>
              <input
                type="number"
                value={inches}
                onChange={(e) => setInches(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Weight (lbs)</label>
              <input
                type="number"
                value={weightLbs}
                onChange={(e) => setWeightLbs(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm font-mono rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        )}
      </div>

      {/* Result Card */}
      <div className="p-8 rounded-3xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-300">
          Your Body Mass Index (BMI)
        </span>
        <div className="text-5xl font-black text-teal-600 dark:text-teal-400 font-mono">
          {bmi}
        </div>
        <div className={`text-sm font-bold ${category.color}`}>
          Category: {category.label}
        </div>

        {/* Reference Range */}
        <div className="pt-4 border-t border-teal-200/60 dark:border-teal-900/60 grid grid-cols-4 gap-1 text-[10px] font-semibold text-slate-500">
          <div className="p-1 rounded bg-amber-100/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">&lt; 18.5 Underweight</div>
          <div className="p-1 rounded bg-emerald-100/60 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300">18.5 - 24.9 Normal</div>
          <div className="p-1 rounded bg-orange-100/60 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300">25 - 29.9 Overweight</div>
          <div className="p-1 rounded bg-rose-100/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300">&gt; 30 Obese</div>
        </div>
      </div>
    </div>
  );
};
