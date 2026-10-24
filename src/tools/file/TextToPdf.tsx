import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { FileUp, FileText } from 'lucide-react';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';

export const TextToPdf: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [title, setTitle] = useState<string>('Document');
  const [fontSize, setFontSize] = useState<number>(12);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please provide text content.');
      return;
    }
    setError(null);
    setIsProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      const margin = 50;
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = fontSize * 1.4;

      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let currentY = pageHeight - margin;

      // Draw Title if provided
      if (title.trim()) {
        currentPage.drawText(title.trim(), {
          x: margin,
          y: currentY,
          size: fontSize + 6,
          font: boldFont,
          color: rgb(0.1, 0.15, 0.25)
        });
        currentY -= (fontSize + 6) * 1.8;
      }

      // Word wrapping logic
      const paragraphs = text.split('\n');
      for (const para of paragraphs) {
        if (!para.trim()) {
          currentY -= lineHeight;
          if (currentY < margin + lineHeight) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - margin;
          }
          continue;
        }

        const words = para.split(' ');
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);

          if (textWidth > maxWidth) {
            currentPage.drawText(currentLine, {
              x: margin,
              y: currentY,
              size: fontSize,
              font: font,
              color: rgb(0.15, 0.2, 0.3)
            });
            currentY -= lineHeight;

            if (currentY < margin + lineHeight) {
              currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
              currentY = pageHeight - margin;
            }
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }

        if (currentLine) {
          currentPage.drawText(currentLine, {
            x: margin,
            y: currentY,
            size: fontSize,
            font: font,
            color: rgb(0.15, 0.2, 0.3)
          });
          currentY -= lineHeight * 1.3;
          if (currentY < margin + lineHeight) {
            currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
            currentY = pageHeight - margin;
          }
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setPdfBlob(blob);
    } catch (err: any) {
      setError(err?.message || 'Failed to create PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Document Header Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setPdfBlob(null); }}
            placeholder="Document Title"
            className="w-full px-3 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Body Font Size ({fontSize}pt)
          </label>
          <input
            type="range"
            min="10"
            max="18"
            value={fontSize}
            onChange={(e) => { setFontSize(parseInt(e.target.value)); setPdfBlob(null); }}
            className="w-full accent-teal-600 mt-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
          Document Text Content
        </label>
        <textarea
          rows={10}
          value={text}
          onChange={(e) => { setText(e.target.value); setPdfBlob(null); }}
          placeholder="Paste or type your notes, article, documentation, or report here..."
          className="w-full p-4 text-xs font-sans rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-teal-500 leading-relaxed"
        />
      </div>

      {isProcessing && <ProgressIndicator statusText="Formatting and typeset into PDF pages..." />}

      <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isProcessing || !text.trim()}
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2"
        >
          <FileUp className="w-4 h-4" />
          <span>Convert Text to PDF</span>
        </button>

        {pdfBlob && (
          <DownloadButton
            filename={`${title.toLowerCase().replace(/\s+/g, '-') || 'document'}.pdf`}
            blob={pdfBlob}
            mimeType="application/pdf"
            label="Download Generated PDF"
          />
        )}
      </div>
    </div>
  );
};
