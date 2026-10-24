import React, { useState } from 'react';
import { FileSpreadsheet, Copy, Download } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';
import { DownloadButton } from '../../components/common/DownloadButton';

export const JsonToCsv: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(
    JSON.stringify([
      { id: 1, name: "Alice Morgan", role: "Lead Engineer", department: "Technology" },
      { id: 2, name: "Bob Davis", role: "Product Manager", department: "Product" },
      { id: 3, name: "Charlie Reed", role: "Security Analyst", department: "DevSecOps" }
    ], null, 2)
  );

  const convertJsonToCsv = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!Array.isArray(parsed) || parsed.length === 0) return '';

      // Extract unique keys
      const headers = Array.from(
        new Set(parsed.flatMap(item => (typeof item === 'object' && item !== null ? Object.keys(item) : [])))
      );

      const headerLine = headers.join(',');
      const rows = parsed.map(item => {
        return headers.map(header => {
          const val = item[header] ?? '';
          const str = String(val);
          // Escape quotes or commas
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',');
      });

      return [headerLine, ...rows].join('\n');
    } catch {
      return '';
    }
  };

  const csvOutput = convertJsonToCsv(jsonInput);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">JSON Array Input</label>
          <textarea
            rows={15}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">CSV Output</label>
            <div className="flex items-center gap-2">
              <CopyButton textToCopy={csvOutput} />
              <DownloadButton
                filename="export.csv"
                content={csvOutput}
                mimeType="text/csv"
                label="Download .csv"
              />
            </div>
          </div>
          <textarea
            rows={15}
            readOnly
            value={csvOutput}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
