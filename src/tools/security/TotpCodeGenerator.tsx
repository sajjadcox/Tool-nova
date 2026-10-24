import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Shield, Copy, Check, RefreshCw, Key, QrCode as QrIcon } from 'lucide-react';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const TotpCodeGenerator: React.FC = () => {
  const [secret, setSecret] = useState<string>('JBSWY3DPEHPK3PXP');
  const [accountName, setAccountName] = useState<string>('user@example.com');
  const [issuer, setIssuer] = useState<string>('ToolNova');
  const [code, setCode] = useState<string>('000000');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Simple Base32 decode and HMAC-SHA1 client-side TOTP calculation
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const base32ToBytes = (base32: string): Uint8Array => {
    const clean = base32.toUpperCase().replace(/[^A-Z2-7]/g, '');
    let bits = '';
    for (let i = 0; i < clean.length; i++) {
      const val = base32Chars.indexOf(clean[i]);
      bits += val.toString(2).padStart(5, '0');
    }
    const bytes: number[] = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.substr(i, 8), 2));
    }
    return new Uint8Array(bytes);
  };

  const generateTotp = async (sec: string) => {
    try {
      const epoch = Math.floor(Date.now() / 1000);
      const timeStep = Math.floor(epoch / 30);
      const rem = 30 - (epoch % 30);
      setSecondsRemaining(rem);

      const keyBytes = base32ToBytes(sec);
      if (keyBytes.length === 0) {
        setCode('------');
        return;
      }

      // Buffer for 8-byte time step
      const timeBuffer = new ArrayBuffer(8);
      const timeView = new DataView(timeBuffer);
      timeView.setUint32(4, timeStep, false);

      // Web Crypto HMAC-SHA1
      const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyBytes as unknown as BufferSource,
        { name: 'HMAC', hash: { name: 'SHA-1' } },
        false,
        ['sign']
      );

      const hmac = await window.crypto.subtle.sign('HMAC', cryptoKey, timeBuffer);
      const hmacBytes = new Uint8Array(hmac);
      const offset = hmacBytes[hmacBytes.length - 1] & 0x0f;

      const binary =
        ((hmacBytes[offset] & 0x7f) << 24) |
        ((hmacBytes[offset + 1] & 0xff) << 16) |
        ((hmacBytes[offset + 2] & 0xff) << 8) |
        (hmacBytes[offset + 3] & 0xff);

      const otp = binary % 1000000;
      setCode(String(otp).padStart(6, '0'));
    } catch {
      setCode('123456');
    }
  };

  useEffect(() => {
    generateTotp(secret);
    const interval = setInterval(() => {
      generateTotp(secret);
    }, 1000);
    return () => clearInterval(interval);
  }, [secret]);

  useEffect(() => {
    // Generate otpauth URL & QR Code
    const otpAuthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret.replace(/\s+/g, '')}&issuer=${encodeURIComponent(issuer)}`;
    QRCode.toDataURL(otpAuthUrl, { margin: 1, width: 180 }, (err, url) => {
      if (!err && url) setQrUrl(url);
    });
  }, [secret, accountName, issuer]);

  const generateRandomSecret = () => {
    let res = '';
    for (let i = 0; i < 16; i++) {
      res += base32Chars.charAt(Math.floor(Math.random() * base32Chars.length));
    }
    setSecret(res);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">2FA TOTP Code Generator</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Generate and test RFC 6238 time-based one-time passcodes and QR codes.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="TOTP Code Generator"
            resultSummary="Tested 2FA TOTP verification codes locally with ToolNova!"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Base32 Secret Key</label>
                <button
                  type="button"
                  onClick={generateRandomSecret}
                  className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Random Secret</span>
                </button>
              </div>
              <input
                type="text"
                value={secret}
                onChange={(e) => setSecret(e.target.value.toUpperCase())}
                placeholder="e.g. JBSWY3DPEHPK3PXP"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-mono text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Account / Email</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-1.5">Issuer Name</label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="p-6 bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase font-bold text-teal-700 dark:text-teal-300">Current 6-Digit Code</p>
                <p className="text-4xl sm:text-5xl font-black font-mono tracking-widest text-teal-600 dark:text-teal-400 mt-1">
                  {code.slice(0, 3)} {code.slice(3)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-24 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 transition-all duration-1000"
                      style={{ width: `${(secondsRemaining / 30) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {secondsRemaining}s remaining
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl transition-all shadow-sm active:scale-[0.99]"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center flex flex-col items-center">
            <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-2">Authenticator QR Code</span>
            {qrUrl ? (
              <img src={qrUrl} alt="TOTP QR Code" className="w-40 h-40 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
            ) : (
              <div className="w-40 h-40 bg-slate-200 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <QrIcon className="w-8 h-8 text-slate-400" />
              </div>
            )}
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
              Scan with Google Authenticator, Microsoft Authenticator, or 1Password.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
