import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { CopyButton } from '../../components/common/CopyButton';

export const JwtDecoder: React.FC = () => {
  const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggTW9yZ2FuIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxODMxNTc0NDAwfQ.signature";
  const [token, setToken] = useState<string>(sampleJwt);

  const decodeJwt = () => {
    if (!token.trim()) return null;
    const parts = token.trim().split('.');
    if (parts.length !== 3) {
      return { error: 'Invalid JWT structure. JWT tokens must contain exactly 3 dot-separated segments (header.payload.signature).' };
    }

    try {
      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
      };

      const headerJson = JSON.parse(decodeBase64Url(parts[0]));
      const payloadJson = JSON.parse(decodeBase64Url(parts[1]));

      let isExpired = false;
      let expDate = null;
      if (payloadJson.exp) {
        expDate = new Date(payloadJson.exp * 1000);
        isExpired = expDate.getTime() < Date.now();
      }

      return {
        header: headerJson,
        payload: payloadJson,
        signature: parts[2],
        isExpired,
        expDate: expDate ? expDate.toLocaleString() : null
      };
    } catch (err: any) {
      return { error: 'Failed to decode token payload. Payload may not be valid JSON.' };
    }
  };

  const decoded = decodeJwt();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
          Paste Encoded JSON Web Token (JWT)
        </label>
        <textarea
          rows={4}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full p-4 text-xs font-mono rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 break-all"
        />
      </div>

      {decoded && !('error' in decoded) ? (
        <div className="space-y-6">
          {/* Expiration badge */}
          {decoded.expDate && (
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold ${
                decoded.isExpired
                  ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900 text-red-700 dark:text-red-300'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>
                  Status: {decoded.isExpired ? 'Token EXPIRED' : 'Token VALID / ACTIVE'}
                </span>
              </div>
              <span>Expires at: {decoded.expDate}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Header */}
            <div className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  Header (Algorithm & Token Type)
                </span>
                <CopyButton textToCopy={JSON.stringify(decoded.header, null, 2)} />
              </div>
              <pre className="p-3 rounded-xl bg-white dark:bg-slate-900 font-mono text-xs text-rose-950 dark:text-rose-200 overflow-x-auto border border-rose-100 dark:border-rose-900/50">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  Payload (Claims & User Data)
                </span>
                <CopyButton textToCopy={JSON.stringify(decoded.payload, null, 2)} />
              </div>
              <pre className="p-3 rounded-xl bg-white dark:bg-slate-900 font-mono text-xs text-indigo-950 dark:text-indigo-200 overflow-x-auto border border-indigo-100 dark:border-indigo-900/50">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      ) : decoded && 'error' in decoded ? (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{decoded.error}</span>
        </div>
      ) : null}
    </div>
  );
};
