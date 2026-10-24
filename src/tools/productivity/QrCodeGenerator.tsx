import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, RefreshCw, Wifi, Link, Mail, FileText } from 'lucide-react';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';

export const QrCodeGenerator: React.FC = () => {
  const [type, setType] = useState<'url' | 'wifi' | 'text' | 'email'>('url');
  const [url, setUrl] = useState<string>('https://toolnova.dev');
  const [text, setText] = useState<string>('Hello from ToolNova!');
  const [email, setEmail] = useState<string>('contact@toolnova.dev');
  const [emailSubject, setEmailSubject] = useState<string>('Inquiry');
  const [wifiSsid, setWifiSsid] = useState<string>('MyHomeWiFi');
  const [wifiPass, setWifiPass] = useState<string>('');
  const [wifiType, setWifiType] = useState<string>('WPA');
  const [qrSize, setQrSize] = useState<number>(300);
  const [fgColor, setFgColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getPayload = () => {
    if (type === 'url') return url.trim();
    if (type === 'wifi') return `WIFI:S:${wifiSsid};T:${wifiType};P:${wifiPass};;`;
    if (type === 'email') return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}`;
    return text.trim();
  };

  const generate = async () => {
    setError(null);
    const payload = getPayload();
    if (!payload) return;

    try {
      const dataUrl = await QRCode.toDataURL(payload, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor
        }
      });
      setQrDataUrl(dataUrl);
    } catch (err: any) {
      setError(err?.message || 'Failed to render QR Code.');
    }
  };

  useEffect(() => {
    generate();
  }, [type, url, text, email, emailSubject, wifiSsid, wifiPass, wifiType, qrSize, fgColor, bgColor]);

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {/* Type Switcher */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center gap-2 flex-wrap text-xs font-semibold">
        {[
          { id: 'url', label: 'Website URL', icon: Link },
          { id: 'wifi', label: 'WiFi Network', icon: Wifi },
          { id: 'text', label: 'Plain Text', icon: FileText },
          { id: 'email', label: 'Email Message', icon: Mail }
        ].map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setType(item.id as any)}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                type === item.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Form Inputs */}
        <div className="space-y-4">
          {type === 'url' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono"
              />
            </div>
          )}

          {type === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Network Name (SSID)</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">WiFi Password</label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  placeholder="Password..."
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono"
                />
              </div>
            </div>
          )}

          {type === 'text' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Plain Text Payload</label>
              <textarea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
              />
            </div>
          )}

          {type === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Recipient</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
                />
              </div>
            </div>
          )}

          {/* Color & Size Customization */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3 text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Style & Resolution</span>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-500 mb-1">Foreground</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-[10px]">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Background</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-[10px]">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Resolution ({qrSize}px)</label>
                <select
                  value={qrSize}
                  onChange={(e) => setQrSize(parseInt(e.target.value))}
                  className="w-full px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <option value={200}>200 px</option>
                  <option value={300}>300 px (HD)</option>
                  <option value={500}>500 px (High-Res)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* QR Preview & Download */}
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-5 text-center">
          <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-200">
            {qrDataUrl && (
              <img
                src={qrDataUrl}
                alt="Generated QR Code"
                className="w-56 h-56 object-contain"
              />
            )}
          </div>

          <p className="text-xs text-slate-500">
            Scan with any smartphone camera or QR reader
          </p>

          {qrDataUrl && (
            <DownloadButton
              filename="qrcode.png"
              dataUrl={qrDataUrl}
              label="Download QR Code (PNG)"
            />
          )}
        </div>
      </div>
    </div>
  );
};
