import React, { useState } from 'react';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { Stamp, Download, RefreshCw, Sliders } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';

export const PdfWatermark: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState<number>(48);
  const [opacity, setOpacity] = useState<number>(0.3);
  const [angle, setAngle] = useState<number>(45);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [watermarkedBlob, setWatermarkedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    const selectedFile = files[0];
    if (!selectedFile.name.toLowerCase().endsWith('.pdf') && selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }
    setError(null);
    setFile(selectedFile);
    setWatermarkedBlob(null);
  };

  const applyWatermark = async () => {
    if (!file || !watermarkText.trim()) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const pages = doc.getPages();

      pages.forEach(page => {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 4,
          y: height / 2,
          size: fontSize,
          color: rgb(0.8, 0.1, 0.1),
          opacity: opacity,
          rotate: degrees(angle)
        });
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setWatermarkedBlob(blob);
    } catch (err: any) {
      setError(err?.message || 'Failed to add watermark to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setWatermarkedBlob(null);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept=".pdf,application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Select a PDF to watermark"
          hint="Stamp custom confidential, draft, or copyright text across every page."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Watermark Options
              </span>
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-600"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Watermark Text</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => { setWatermarkText(e.target.value); setWatermarkedBlob(null); }}
                  placeholder="CONFIDENTIAL"
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  <span>Font Size</span>
                  <span className="font-mono">{fontSize}pt</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="80"
                  value={fontSize}
                  onChange={(e) => { setFontSize(parseInt(e.target.value)); setWatermarkedBlob(null); }}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  <span>Opacity</span>
                  <span className="font-mono">{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => { setOpacity(parseFloat(e.target.value)); setWatermarkedBlob(null); }}
                  className="w-full accent-teal-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  <span>Angle</span>
                  <span className="font-mono">{angle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="15"
                  value={angle}
                  onChange={(e) => { setAngle(parseInt(e.target.value)); setWatermarkedBlob(null); }}
                  className="w-full accent-teal-600"
                />
              </div>
            </div>
          </div>

          {isProcessing && <ProgressIndicator statusText="Stamping watermark across document pages..." />}

          <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
            <button
              type="button"
              onClick={applyWatermark}
              disabled={isProcessing || !watermarkText.trim()}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <Stamp className="w-4 h-4" />
              <span>{watermarkedBlob ? 'Re-apply Watermark' : 'Stamp Watermark'}</span>
            </button>

            {watermarkedBlob && (
              <DownloadButton
                filename={`watermarked-${file.name}`}
                blob={watermarkedBlob}
                mimeType="application/pdf"
                label="Download Watermarked PDF"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
