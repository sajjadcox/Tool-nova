import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { RotateCw, RefreshCw } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';

export const PdfPageRotator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [rotatedBlob, setRotatedBlob] = useState<Blob | null>(null);
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
    setRotatedBlob(null);
  };

  const handleRotate = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer);
      const pages = doc.getPages();

      pages.forEach(page => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotationAngle) % 360));
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setRotatedBlob(blob);
    } catch (err: any) {
      setError(err?.message || 'Failed to rotate PDF pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {!file ? (
        <FileUpload
          accept=".pdf,application/pdf"
          onFilesSelected={handleFilesSelected}
          label="Select a PDF to rotate pages"
          hint="Permanently rotate sideways or upside-down pages by 90°, 180°, or 270°."
        />
      ) : (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rotate By:</span>
              {[90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  type="button"
                  onClick={() => { setRotationAngle(deg); setRotatedBlob(null); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                    rotationAngle === deg
                      ? 'bg-teal-600 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  +{deg}° Clockwise
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => { setFile(null); setRotatedBlob(null); }}
              className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {isProcessing && <ProgressIndicator statusText="Reorienting document pages..." />}

          <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
            <button
              type="button"
              onClick={handleRotate}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              <span>Rotate PDF Pages</span>
            </button>

            {rotatedBlob && (
              <DownloadButton
                filename={`rotated-${file.name}`}
                blob={rotatedBlob}
                mimeType="application/pdf"
                label="Download Rotated PDF"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
