import React, { useState } from 'react';
import { FileSpreadsheet, Copy, Download } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { CopyButton } from '../../components/common/CopyButton';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const CsvToJson: React.FC = () => {
  const [csvInput, setCsvInput] = useState<string>(
    'id,name,role,department\n1,Alice Morgan,Lead Engineer,Technology\n2,Bob Davis,Product Manager,Product\n3,Charlie Reed,Security Analyst,DevSecOps'
  );
  const [error, setError] = useState<string | null>(null);

  const convertCsvToJson = (csv: string) => {
    try {
      const lines = csv.trim().split('\n').filter(l => l.trim().length > 0);
      if (lines.length < 2) return '[]';

      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const rows = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        const obj: { [key: string]: any } = {};
        headers.forEach((header, index) => {
          const val = values[index] ?? '';
          // Try parse numbers
          const num = Number(val);
          obj[header] = !isNaN(num) && val !== '' ? num : val;
        });
        rows.push(obj);
      }

      return JSON.stringify(rows, null, 2);
    } catch {
      return '[]';
    }
  };

  const jsonOutput = convertCsvToJson(csvInput);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvInput(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      <div className="space-y-4">
        <FileUpload
          accept=".csv,text/csv"
          onFilesSelected={handleFilesSelected}
          label="Optionally upload a .CSV file or edit text below"
          hint="Parsed locally in browser memory."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">CSV Input</label>
            <textarea
              rows={14}
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">JSON Output</label>
              <div className="flex items-center gap-2">
                <CopyButton textToCopy={jsonOutput} />
                <DownloadButton
                  filename="converted.json"
                  content={jsonOutput}
                  mimeType="application/json"
                  label="Download .json"
                />
              </div>
            </div>
            <textarea
              rows={14}
              readOnly
              value={jsonOutput}
              className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
