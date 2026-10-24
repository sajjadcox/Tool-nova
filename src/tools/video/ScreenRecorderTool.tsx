import React, { useState, useRef, useEffect } from 'react';
import { Video, Square, Download, RefreshCw, Mic, MicOff, Monitor, Play } from 'lucide-react';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { ShareResultButton } from '../../components/common/ShareResultButton';

export const ScreenRecorderTool: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [includeMic, setIncludeMic] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);

  const startRecording = async () => {
    setError(null);
    chunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        setError('Screen recording is not supported in this browser. Please use Chrome, Edge, or Firefox on desktop.');
        return;
      }

      // Capture screen
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'monitor' },
        audio: true
      });

      // Optionally combine with mic audio
      let finalStream = screenStream;
      if (includeMic && navigator.mediaDevices.getUserMedia) {
        try {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTracks = [...screenStream.getAudioTracks(), ...micStream.getAudioTracks()];
          finalStream = new MediaStream([...screenStream.getVideoTracks(), ...audioTracks]);
        } catch {
          // Mic permission denied or unavailable, continue with screen stream
        }
      }

      streamRef.current = finalStream;

      if (liveVideoRef.current) {
        liveVideoRef.current.srcObject = finalStream;
        liveVideoRef.current.play();
      }

      // Check supported MIME types
      let mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/webm';
        }
      }

      const recorder = new MediaRecorder(finalStream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(chunksRef.current, { type: 'video/webm' });
        if (recordedUrl) URL.revokeObjectURL(recordedUrl);
        const url = URL.createObjectURL(fullBlob);
        setRecordedBlob(fullBlob);
        setRecordedUrl(url);
        setIsRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);

        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
        }
      };

      // Handle user clicking browser native "Stop sharing" button
      screenStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      recorder.start(1000); // 1-second chunks
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') {
        setError(err.message || 'Failed to start screen recording.');
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const handleReset = () => {
    stopRecording();
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    setRecordedBlob(null);
    setRecordedUrl(null);
    setDuration(0);
    setError(null);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return (
    <div className="space-y-6">
      <ErrorMessage message={error || undefined} onDismiss={() => setError(null)} />

      {/* Recording Stage */}
      <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-white relative overflow-hidden">
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500 text-rose-300 text-xs font-mono font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>REC • {formatTimer(duration)}</span>
          </div>
        )}

        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
            <Monitor className="w-8 h-8" />
          </div>

          <h3 className="text-xl font-bold">Client-Side Screen & Video Recorder</h3>
          <p className="text-xs text-slate-400">
            Record any browser tab, window, or entire desktop monitor with optional microphone audio. 100% private.
          </p>

          {/* Options */}
          {!isRecording && !recordedUrl && (
            <div className="pt-2 flex items-center justify-center gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={includeMic}
                  onChange={(e) => setIncludeMic(e.target.checked)}
                  className="rounded accent-teal-600"
                />
                <span className="flex items-center gap-1">
                  {includeMic ? <Mic className="w-3.5 h-3.5 text-teal-400" /> : <MicOff className="w-3.5 h-3.5 text-slate-500" />}
                  Record Microphone Audio
                </span>
              </label>
            </div>
          )}

          {/* Action Trigger */}
          <div className="pt-2">
            {!isRecording ? (
              <button
                type="button"
                onClick={startRecording}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-teal-500 hover:bg-teal-400 text-slate-900 shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
              >
                <Video className="w-5 h-5" />
                <span>Start Recording Screen</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all ring-4 ring-rose-600/20"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop & Save Recording</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Recorded Preview & Download */}
      {recordedUrl && recordedBlob && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Recording Ready ({formatTimer(duration)} • {(recordedBlob.size / (1024 * 1024)).toFixed(2)} MB)
            </h4>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Record Another</span>
              </button>
              <ShareResultButton
                toolName="Screen Recorder"
                resultSummary={`Recorded ${formatTimer(duration)} screen video.`}
              />
            </div>
          </div>

          <div className="p-2 rounded-2xl bg-black flex items-center justify-center">
            <video
              src={recordedUrl}
              controls
              className="max-h-80 w-full object-contain rounded-xl"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <a
              href={recordedUrl}
              download={`screen_recording_${new Date().toISOString().slice(0, 10)}.webm`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download WebM Video</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
