import React, { useState } from 'react';
import { FileText, Copy, Check, Download, RefreshCw, Search, ShieldCheck } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const PdfTextExtractor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const extractTextFromPdfBuffer = (buffer: ArrayBuffer): string => {
    const uint8 = new Uint8Array(buffer);
    let str = '';
    // Chunk reading for memory safety
    const chunkSize = 65536;
    for (let i = 0; i < uint8.length; i += chunkSize) {
      const sub = uint8.subarray(i, Math.min(i + chunkSize, uint8.length));
      str += String.fromCharCode.apply(null, Array.from(sub));
    }

    const textPieces: string[] = [];

    // Match text within Tj operators: (text) Tj
    const tjRegex = /\(([^)]+)\)\s*Tj/g;
    let match: RegExpExecArray | null;
    while ((match = tjRegex.exec(str)) !== null) {
      if (match[1]) {
        textPieces.push(match[1]);
      }
    }

    // Match text arrays in TJ operators: [(t1) 120 (t2)] TJ
    const tjArrayRegex = /\[([^\]]+)\]\s*TJ/g;
    while ((match = tjArrayRegex.exec(str)) !== null) {
      const inner = match[1];
      const innerMatches = inner.match(/\(([^)]+)\)/g);
      if (innerMatches) {
        const line = innerMatches.map(m => m.slice(1, -1)).join('');
        if (line.trim()) textPieces.push(line);
      }
    }

    // Clean up escape characters
    const clean = textPieces
      .map(t =>
        t
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '')
          .replace(/\\t/g, ' ')
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')')
          .replace(/\\\\/g, '\\')
      )
      .filter(t => t.trim().length > 0)
      .join(' ');

    if (!clean || clean.length < 5) {
      // Fallback: extract printable ASCII text blocks
      const printable = str.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      const words = printable.split(/\s+/).filter(w => w.length > 2 && /^[a-zA-Z0-9.,!?'"-]+$/.test(w));
      return words.slice(0, 5000).join(' ');
    }

    return clean;
  };

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.name.toLowerCase().endsWith('.pdf') && selected.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setError(null);
    setFile(selected);
    setIsProcessing(true);

    try {
      const buffer = await selected.arrayBuffer();
      const text = extractTextFromPdfBuffer(buffer);
      if (!text || text.trim().length === 0) {
        setError('No selectable text found. This PDF may contain scanned raster images without OCR text.');
        setExtractedText('');
      } else {
        setExtractedText(text);
      }
    } catch {
      setError('Failed to extract text from this PDF file.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = async () => {
    if (!extractedText) return;
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = extractedText ? extractedText.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = extractedText ? extractedText.length : 0;

  const filteredText = searchTerm
    ? extractedText
        .split('\n')
        .filter(line => line.toLowerCase().includes(searchTerm.toLowerCase()))
        .join('\n')
    : extractedText;

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {!file ? (
        <FileUpload
          accept=".pdf,application/pdf"
          multiple={false}
          
          onFilesSelected={handleFilesSelected}
          hint="Upload any PDF to parse and extract selectable text directly in your browser."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{file.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {wordCount.toLocaleString()} words &middot; {charCount.toLocaleString()} characters
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setExtractedText('');
                setSearchTerm('');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Change PDF</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search extracted text..."
                className="w-full pl-9 pr-16 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!extractedText}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
              <DownloadButton
                filename={`${file.name.replace(/\.pdf$/i, '')}_text.txt`}
                content={extractedText}
                mimeType="text/plain;charset=utf-8"
                label="Save as .TXT"
                className="bg-teal-600 hover:bg-teal-500 text-white"
              />
              <ShareResultButton
                toolName="PDF Text Extractor"
                resultSummary={`Extracted ${wordCount.toLocaleString()} words from ${file.name} using ToolNova!`}
              />
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={filteredText}
              rows={14}
              placeholder="Extracted text will appear here..."
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none"
            />
          </div>

          {isProcessing && <ProgressIndicator progress={80} statusText="Parsing text streams from PDF..." />}

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Parsed 100% locally on your device. Zero external data transmission.</span>
          </div>
        </div>
      )}
    </div>
  );
};
