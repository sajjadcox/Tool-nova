import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileUp, Download, RefreshCw, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { DownloadButton } from '../../components/common/DownloadButton';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';

interface SelectedImage {
  id: string;
  file: File;
  previewUrl: string;
}

export const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [pageSize, setPageSize] = useState<'fit' | 'a4' | 'letter'>('fit');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<number>(20);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    const valid = files.filter(f => f.type.startsWith('image/'));
    if (valid.length === 0) {
      setError('Please select valid image files (JPG, PNG, WebP).');
      return;
    }
    setError(null);

    const newImgs: SelectedImage[] = valid.map(f => ({
      id: Math.random().toString(36).substring(2),
      file: f,
      previewUrl: URL.createObjectURL(f)
    }));

    setImages(prev => [...prev, ...newImgs]);
    setPdfBlob(null);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const target = prev.find(img => img.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(img => img.id !== id);
    });
    setPdfBlob(null);
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImages(prev => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return copy;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
    setPdfBlob(null);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        let embeddedImage;

        if (item.file.type === 'image/jpeg' || item.file.type === 'image/jpg') {
          embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
        } else if (item.file.type === 'image/png') {
          embeddedImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          // For webp or other formats, convert to PNG via canvas first
          const img = new Image();
          const objUrl = URL.createObjectURL(item.file);
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Failed to load WebP'));
            img.src = objUrl;
          });
          URL.revokeObjectURL(objUrl);

          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.drawImage(img, 0, 0);

          const pngBlob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
          if (!pngBlob) throw new Error('Conversion to PNG failed');
          const pngBuffer = await pngBlob.arrayBuffer();
          embeddedImage = await pdfDoc.embedPng(pngBuffer);
        }

        const { width: imgW, height: imgH } = embeddedImage;

        if (pageSize === 'fit') {
          // Page size fits the image exactly plus margins
          const pageW = imgW + margin * 2;
          const pageH = imgH + margin * 2;
          const page = pdfDoc.addPage([pageW, pageH]);
          page.drawImage(embeddedImage, {
            x: margin,
            y: margin,
            width: imgW,
            height: imgH
          });
        } else {
          // Standard A4 (595.28 x 841.89) or Letter (612 x 792)
          let pageW = pageSize === 'a4' ? 595.28 : 612;
          let pageH = pageSize === 'a4' ? 841.89 : 792;

          if (orientation === 'landscape') {
            const temp = pageW;
            pageW = pageH;
            pageH = temp;
          }

          const availW = pageW - margin * 2;
          const availH = pageH - margin * 2;

          // Scale maintaining aspect ratio
          const scale = Math.min(availW / imgW, availH / imgH);
          const drawW = imgW * scale;
          const drawH = imgH * scale;

          const x = margin + (availW - drawW) / 2;
          const y = margin + (availH - drawH) / 2;

          const page = pdfDoc.addPage([pageW, pageH]);
          page.drawImage(embeddedImage, {
            x,
            y,
            width: drawW,
            height: drawH
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setPdfBlob(blob);
    } catch (err: any) {
      setError(err?.message || 'Failed to create PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setPdfBlob(null);
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {/* Upload Zone */}
      <FileUpload
        accept="image/png,image/jpeg,image/webp"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        label="Add image(s) to convert to PDF"
        hint="Select one or multiple images to combine into a single multi-page PDF document."
      />

      {images.length > 0 && (
        <div className="space-y-6">
          {/* Settings Bar */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Page Sizing
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(e.target.value as any); setPdfBlob(null); }}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
                >
                  <option value="fit">Fit to Image Size</option>
                  <option value="a4">Standard A4 Document</option>
                  <option value="letter">US Letter Document</option>
                </select>
              </div>

              {pageSize !== 'fit' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => { setOrientation(e.target.value as any); setPdfBlob(null); }}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-teal-500"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Margin: {margin}pt
                </label>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={margin}
                  onChange={(e) => { setMargin(parseInt(e.target.value)); setPdfBlob(null); }}
                  className="w-full accent-teal-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700 text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-400">
                {images.length} {images.length === 1 ? 'page' : 'pages'} ready to compile
              </span>
              <button
                type="button"
                onClick={handleClear}
                className="text-red-500 hover:underline font-medium"
              >
                Clear all images
              </button>
            </div>
          </div>

          {/* Image Order Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((item, idx) => (
              <div
                key={item.id}
                className="relative group p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 mb-2 flex items-center justify-center">
                  <img
                    src={item.previewUrl}
                    alt={item.file.name}
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white">
                    Page {idx + 1}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="truncate max-w-[90px] font-medium text-slate-700 dark:text-slate-300 text-[11px]">
                    {item.file.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveImage(idx, 'up')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === images.length - 1}
                      onClick={() => moveImage(idx, 'down')}
                      className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(item.id)}
                      className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isGenerating && <ProgressIndicator statusText="Compiling high-resolution PDF document..." />}

          {/* Action Row */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-800/80">
            <button
              type="button"
              onClick={generatePdf}
              disabled={isGenerating}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              <FileUp className="w-4 h-4" />
              <span>{pdfBlob ? 'Recompile PDF' : 'Convert & Generate PDF'}</span>
            </button>

            {pdfBlob && (
              <DownloadButton
                filename="converted-document.pdf"
                blob={pdfBlob}
                mimeType="application/pdf"
                label="Download PDF Document"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
