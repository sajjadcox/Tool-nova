import React, { useState } from 'react';
import { Music, FileText, RefreshCw, Disc, ShieldCheck } from 'lucide-react';
import { FileUpload } from '../../components/common/FileUpload';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ProgressIndicator } from '../../components/common/ProgressIndicator';
import { ShareResultButton } from '../../components/common/ShareResultButton';

interface AudioSpecs {
  name: string;
  size: string;
  type: string;
  duration: string;
  sampleRate: number;
  channels: number;
  channelMode: string;
}

export const AudioMetadataViewer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [specs, setSpecs] = useState<AudioSpecs | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    if (!selected.type.startsWith('audio/')) {
      setError('Please upload a valid audio file (MP3, WAV, OGG, FLAC, AAC).');
      return;
    }
    setError(null);
    setFile(selected);
    setIsProcessing(true);

    try {
      const buffer = await selected.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const decoded = await ctx.decodeAudioData(buffer);

      const mins = Math.floor(decoded.duration / 60);
      const secs = Math.floor(decoded.duration % 60);

      setSpecs({
        name: selected.name,
        size: formatSize(selected.size),
        type: selected.type || 'audio/unknown',
        duration: `${mins}:${String(secs).padStart(2, '0')} (${decoded.duration.toFixed(2)}s)`,
        sampleRate: decoded.sampleRate,
        channels: decoded.numberOfChannels,
        channelMode: decoded.numberOfChannels === 1 ? 'Mono (1 channel)' : decoded.numberOfChannels === 2 ? 'Stereo (2 channels)' : `${decoded.numberOfChannels} Multi-channel`
      });
    } catch {
      setError('Failed to parse audio specs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setFile(null);
    setSpecs(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

      {!file ? (
        <FileUpload
          accept="audio/*"
          multiple={false}
          maxSizeMB={50}
          onFilesSelected={handleFilesSelected}
          hint="Upload any audio file to inspect sample rate, channel count, duration, and encoding properties."
        />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/50 rounded-xl text-teal-600 dark:text-teal-400">
                <Disc className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{file.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Audio Metadata & AudioContext Properties</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShareResultButton
                toolName="Audio Metadata Viewer"
                resultSummary={`Inspected audio properties for ${file.name} on ToolNova!`}
              />
              <button
                onClick={resetAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-500 bg-slate-100 dark:bg-slate-800 rounded-xl"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload Another</span>
              </button>
            </div>
          </div>

          {specs && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <span className="text-[11px] font-bold uppercase text-slate-500">File Duration</span>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono">{specs.duration}</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <span className="text-[11px] font-bold uppercase text-slate-500">Sample Rate</span>
                <p className="text-base font-bold text-teal-600 dark:text-teal-400 mt-1 font-mono">{specs.sampleRate.toLocaleString()} Hz</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <span className="text-[11px] font-bold uppercase text-slate-500">Channels</span>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">{specs.channelMode}</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <span className="text-[11px] font-bold uppercase text-slate-500">File Size</span>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1">{specs.size}</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <span className="text-[11px] font-bold uppercase text-slate-500">MIME Format</span>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1 font-mono">{specs.type}</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                <span className="text-[11px] font-bold uppercase text-slate-500">Privacy Status</span>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-1">100% In-Browser</p>
              </div>
            </div>
          )}

          {isProcessing && <ProgressIndicator progress={70} statusText="Decoding audio buffer header..." />}
        </div>
      )}
    </div>
  );
};
