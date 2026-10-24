import React, { useState } from 'react';
import { Database, Copy } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const SqlFormatter: React.FC = () => {
  const [input, setInput] = useState<string>(
    'SELECT u.id, u.name, o.total_amount, o.created_at FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.status = "completed" AND o.total_amount > 100 GROUP BY u.id ORDER BY o.created_at DESC LIMIT 50;'
  );

  const formatSql = (sql: string) => {
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
      'LIMIT', 'OFFSET', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
      'JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM',
      'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'UNION ALL', 'UNION'
    ];

    let formatted = sql.trim();

    // Standardize spacing around commas
    formatted = formatted.replace(/\s*,\s*/g, ',\n  ');

    // Add newline before major keywords and capitalize
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${kw.toUpperCase()} `);
    });

    // Clean up double newlines
    formatted = formatted
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Indent non-major clauses
        const isMajor = keywords.some(k => line.startsWith(k));
        return isMajor ? line : `  ${line}`;
      })
      .join('\n');

    return formatted.trim();
  };

  const output = formatSql(input);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-600 dark:text-slate-400">
          Uppercase keywords, newline alignment, and clause indentation
        </span>
        <CopyButton textToCopy={output} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Raw SQL Query</label>
          <textarea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-teal-700 dark:text-teal-400 block">Formatted SQL Query</label>
          <textarea
            rows={12}
            readOnly
            value={output}
            className="w-full p-4 text-xs font-mono rounded-2xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-900/60 text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
    </div>
  );
};
