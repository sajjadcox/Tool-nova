import React, { useState } from 'react';
import { Scale, ArrowRightLeft } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temperature' | 'digital' | 'area' | 'speed';

const CONVERSION_FACTORS: Record<UnitCategory, { units: string[]; toBase: (v: number, u: string) => number; fromBase: (v: number, u: string) => number }> = {
  length: {
    units: ['Meters (m)', 'Kilometers (km)', 'Centimeters (cm)', 'Millimeters (mm)', 'Miles (mi)', 'Yards (yd)', 'Feet (ft)', 'Inches (in)'],
    toBase: (v, u) => {
      if (u.startsWith('Kilometers')) return v * 1000;
      if (u.startsWith('Centimeters')) return v * 0.01;
      if (u.startsWith('Millimeters')) return v * 0.001;
      if (u.startsWith('Miles')) return v * 1609.344;
      if (u.startsWith('Yards')) return v * 0.9144;
      if (u.startsWith('Feet')) return v * 0.3048;
      if (u.startsWith('Inches')) return v * 0.0254;
      return v;
    },
    fromBase: (v, u) => {
      if (u.startsWith('Kilometers')) return v / 1000;
      if (u.startsWith('Centimeters')) return v / 0.01;
      if (u.startsWith('Millimeters')) return v / 0.001;
      if (u.startsWith('Miles')) return v / 1609.344;
      if (u.startsWith('Yards')) return v / 0.9144;
      if (u.startsWith('Feet')) return v / 0.3048;
      if (u.startsWith('Inches')) return v / 0.0254;
      return v;
    }
  },
  weight: {
    units: ['Kilograms (kg)', 'Grams (g)', 'Milligrams (mg)', 'Pounds (lb)', 'Ounces (oz)', 'Metric Tons (t)'],
    toBase: (v, u) => {
      if (u.startsWith('Grams')) return v * 0.001;
      if (u.startsWith('Milligrams')) return v * 0.000001;
      if (u.startsWith('Pounds')) return v * 0.45359237;
      if (u.startsWith('Ounces')) return v * 0.02834952;
      if (u.startsWith('Metric Tons')) return v * 1000;
      return v;
    },
    fromBase: (v, u) => {
      if (u.startsWith('Grams')) return v / 0.001;
      if (u.startsWith('Milligrams')) return v / 0.000001;
      if (u.startsWith('Pounds')) return v / 0.45359237;
      if (u.startsWith('Ounces')) return v / 0.02834952;
      if (u.startsWith('Metric Tons')) return v / 1000;
      return v;
    }
  },
  temperature: {
    units: ['Celsius (°C)', 'Fahrenheit (°F)', 'Kelvin (K)'],
    toBase: (v, u) => {
      if (u.startsWith('Fahrenheit')) return (v - 32) * (5 / 9);
      if (u.startsWith('Kelvin')) return v - 273.15;
      return v;
    },
    fromBase: (v, u) => {
      if (u.startsWith('Fahrenheit')) return (v * 9) / 5 + 32;
      if (u.startsWith('Kelvin')) return v + 273.15;
      return v;
    }
  },
  digital: {
    units: ['Bytes (B)', 'Kilobytes (KB)', 'Megabytes (MB)', 'Gigabytes (GB)', 'Terabytes (TB)'],
    toBase: (v, u) => {
      if (u.startsWith('Kilobytes')) return v * 1024;
      if (u.startsWith('Megabytes')) return v * 1024 * 1024;
      if (u.startsWith('Gigabytes')) return v * 1024 * 1024 * 1024;
      if (u.startsWith('Terabytes')) return v * 1024 * 1024 * 1024 * 1024;
      return v;
    },
    fromBase: (v, u) => {
      if (u.startsWith('Kilobytes')) return v / 1024;
      if (u.startsWith('Megabytes')) return v / (1024 * 1024);
      if (u.startsWith('Gigabytes')) return v / (1024 * 1024 * 1024);
      if (u.startsWith('Terabytes')) return v / (1024 * 1024 * 1024 * 1024);
      return v;
    }
  },
  area: {
    units: ['Square Meters (m²)', 'Square Kilometers (km²)', 'Square Feet (ft²)', 'Acres', 'Hectares'],
    toBase: (v, u) => {
      if (u.startsWith('Square Kilometers')) return v * 1000000;
      if (u.startsWith('Square Feet')) return v * 0.092903;
      if (u.startsWith('Acres')) return v * 4046.86;
      if (u.startsWith('Hectares')) return v * 10000;
      return v;
    },
    fromBase: (v, u) => {
      if (u.startsWith('Square Kilometers')) return v / 1000000;
      if (u.startsWith('Square Feet')) return v / 0.092903;
      if (u.startsWith('Acres')) return v / 4046.86;
      if (u.startsWith('Hectares')) return v / 10000;
      return v;
    }
  },
  speed: {
    units: ['Kilometers per hour (km/h)', 'Miles per hour (mph)', 'Meters per second (m/s)', 'Knots'],
    toBase: (v, u) => {
      if (u.startsWith('Miles per hour')) return v * 1.60934;
      if (u.startsWith('Meters per second')) return v * 3.6;
      if (u.startsWith('Knots')) return v * 1.852;
      return v;
    },
    fromBase: (v, u) => {
      if (u.startsWith('Miles per hour')) return v / 1.60934;
      if (u.startsWith('Meters per second')) return v / 3.6;
      if (u.startsWith('Knots')) return v / 1.852;
      return v;
    }
  }
};

export const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [value, setValue] = useState<number>(10);
  const [fromUnit, setFromUnit] = useState<string>('Kilometers (km)');
  const [toUnit, setToUnit] = useState<string>('Miles (mi)');

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    const units = CONVERSION_FACTORS[cat].units;
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  };

  const calculateConversion = () => {
    const config = CONVERSION_FACTORS[category];
    const baseValue = config.toBase(value, fromUnit);
    const result = config.fromBase(baseValue, toUnit);
    return Number.isInteger(result) ? result : parseFloat(result.toFixed(6));
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const convertedValue = calculateConversion();

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
        {(Object.keys(CONVERSION_FACTORS) as UnitCategory[]).map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl capitalize transition-all ${
              category === cat
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Converter Box */}
      <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">From</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 text-lg font-bold font-mono rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
            >
              {CONVERSION_FACTORS[category].units.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center md:col-span-1">
            <button
              type="button"
              onClick={swapUnits}
              className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-teal-600 hover:bg-slate-100 transition-colors shadow-xs"
              title="Swap units"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">To</label>
            <div className="w-full px-4 py-3 text-lg font-bold font-mono rounded-2xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 truncate">
              {convertedValue}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
            >
              {CONVERSION_FACTORS[category].units.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-center text-sm font-semibold text-slate-700 dark:text-slate-300">
          <span>{value} {fromUnit} = </span>
          <span className="text-teal-600 dark:text-teal-400 font-bold">{convertedValue} {toUnit}</span>
        </div>
      </div>
    </div>
  );
};
