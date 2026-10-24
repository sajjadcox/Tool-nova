import React, { useState } from 'react';
import { Table, Search, Download } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';

export const CsvViewer: React.FC = () => {
  const [csvData, setCsvData] = useState<string>(
    'ID,Name,Department,Location,Status\n101,Sarah Jenkins,Engineering,San Francisco,Active\n102,David Chen,Design,London,Active\n103,Elena Rostova,DevOps,Berlin,Active\n104,Marcus Miller,Finance,New York,On Leave\n105,Aisha Patel,Security,Toronto,Active'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  const parseCsv = () => {
    const lines = csvData.trim().split('\n').filter(l => l.trim().length > 0);
    if (lines.length === 0) return { headers: [], rows: [] };

    const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    const rows = lines.slice(1).map(line => {
      return line.split(',').map(cell => cell.trim().replace(/^["']|["']$/g, ''));
    });

    const filteredRows = rows.filter(row => {
      if (!searchQuery.trim()) return true;
      return row.some(cell => cell.toLowerCase().includes(searchQuery.toLowerCase()));
    });

    return { headers, rows: filteredRows, totalCount: rows.length };
  };

  const { headers, rows, totalCount } = parseCsv();

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setCsvData(e.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <FileUpload
        accept=".csv,text/csv"
        onFilesSelected={handleFilesSelected}
        label="Upload a .CSV file to view and filter in an interactive grid"
        hint="Parsed locally in browser memory."
      />

      {headers.length > 0 && (
        <div className="space-y-4">
          {/* Search bar inside table */}
          <div className="flex items-center justify-between flex-wrap gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rows in table..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none focus:border-teal-500"
              />
            </div>

            <span className="text-xs text-slate-500">
              Showing {rows.length} of {totalCount} records
            </span>
          </div>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900 font-medium text-slate-800 dark:text-slate-200">
                {rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2.5 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
