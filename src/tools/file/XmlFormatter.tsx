import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Trash2 } from 'lucide-react';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const XmlFormatter: React.FC = () => {
  const [xmlInput, setXmlInput] = useState<string>(
    '<root><user id="1"><name>John Doe</name><role>Admin</role><settings><theme>dark</theme><notifications enabled="true"/></settings></user></root>'
  );
  const [formatted, setFormatted] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const formatXml = (xml: string): string => {
    try {
      let formattedStr = '';
      const reg = /(>)(<)(\/*)/g;
      const clean = xml.replace(reg, '$1\r\n$2$3');
      let pad = 0;

      clean.split('\r\n').forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        const padding = '  '.repeat(pad);
        formattedStr += padding + node + '\r\n';
        pad += indent;
      });

      return formattedStr.trim();
    } catch {
      return xml;
    }
  };

  const handleFormat = () => {
    setFormatted(formatXml(xmlInput));
  };

  const resultXml = formatted || (xmlInput ? formatXml(xmlInput) : '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(resultXml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">XML Formatter & Beautifier</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Beautify and indent XML documents with tree structure indentation.</p>
            </div>
          </div>
          <ShareResultButton
            toolName="XML Formatter"
            resultSummary="Beautified XML documents with ToolNova XML Formatter!"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          {xmlInput && (
            <button
              type="button"
              onClick={() => {
                setXmlInput('');
                setFormatted('');
              }}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleFormat}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded-xl shadow-sm ml-auto"
          >
            Format XML
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400 block mb-1.5">Input XML</span>
            <textarea
              rows={12}
              value={xmlInput}
              onChange={(e) => setXmlInput(e.target.value)}
              placeholder="Paste raw XML here..."
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold uppercase text-slate-600 dark:text-slate-400">Formatted XML</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-teal-600"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <DownloadButton
                  filename="document.xml"
                  content={resultXml}
                  mimeType="application/xml"
                  label="Download"
                  className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>
            <textarea
              readOnly
              rows={12}
              value={resultXml}
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
