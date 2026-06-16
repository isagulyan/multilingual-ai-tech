import { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Maximize2, RefreshCw,
  CheckCircle, Clock, Loader, AlertCircle, Download,
  Share2, Film, Zap, ExternalLink,
} from 'lucide-react';
import type { VideoJob } from '../lib/supabase';

interface VideoPreviewProps {
  job: VideoJob | null;
  articleTitle: string;
  onRegenerate?: () => void;
  onPublish?: () => void;
  isPublishing?: boolean;
  compact?: boolean;
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: VideoJob['status'] | 'none' }) {
  const configs = {
    none:       { icon: Film,        label: 'No video',   cls: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
    queued:     { icon: Clock,       label: 'Queued',     cls: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' },
    processing: { icon: Loader,      label: 'Rendering…', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' },
    completed:  { icon: CheckCircle, label: 'Ready',      cls: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
    failed:     { icon: AlertCircle, label: 'Failed',     cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
  };
  const { icon: Icon, label, cls } = configs[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}>
      <Icon size={11} className={status === 'processing' ? 'animate-spin' : ''} />
      {label}
    </span>
  );
}

// ─── Compact skeleton shown while job is queued/processing ───────────────────
function RenderingPlaceholder({ job }: { job: VideoJob }) {
  const [dots, setDots] = useState('');
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(id);
  }, []);

  const steps = [
    { label: 'Extracting headlines & key frames',  done: true },
    { label: 'Compositing visuals & transitions',  done: job.status !== 'queued' },
    { label: 'Rendering 10-20s MP4 at 1080p',      done: false },
    { label: 'Optimising for TikTok / Reels',       done: false },
  ];

  return (
    <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-[9/16] max-w-[200px] flex flex-col items-center justify-center p-4 gap-3">
      {/* animated gradient bg */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-900/60 via-gray-900 to-gray-950 animate-pulse" />
      <div className="relative z-10 flex flex-col items-center gap-3 w-full">
        <div className="w-12 h-12 rounded-full bg-brand-600/20 border border-brand-500/40 flex items-center justify-center">
          <Loader size={22} className="text-brand-400 animate-spin" />
        </div>
        <p className="text-white text-xs font-semibold text-center">
          Generating video{dots}
        </p>
        <div className="w-full space-y-1.5 mt-1">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 flex items-center justify-center ${
                s.done ? 'bg-green-500' : 'bg-gray-700'
              }`}>
                {s.done && <CheckCircle size={8} className="text-white" />}
              </div>
              <span className={`text-[10px] leading-tight ${s.done ? 'text-gray-300' : 'text-gray-600'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function VideoPreview({
  job,
  articleTitle,
  onRegenerate,
  onPublish,
  isPublishing = false,
  compact = false,
}: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else         { v.play();  setPlaying(true);  }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setCurrentTime(v.currentTime);
    setProgress(v.duration ? (v.currentTime / v.duration) * 100 : 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  };

  const openFullscreen = () => videoRef.current?.requestFullscreen?.();

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // ── No job at all ──────────────────────────────────────────────────────────
  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-center min-h-[160px]">
        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <Film size={18} className="text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No video yet</p>
          <p className="text-xs text-gray-500 mt-0.5">Generate article first to create a short video</p>
        </div>
        {onRegenerate && (
          <button onClick={onRegenerate} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1.5">
            <Zap size={12} /> Generate Video
          </button>
        )}
      </div>
    );
  }

  // ── Queued / Processing ───────────────────────────────────────────────────
  if (job.status === 'queued' || job.status === 'processing') {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <StatusBadge status={job.status} />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {job.provider === 'mock' ? 'Mock renderer' : job.provider}
          </span>
        </div>
        <RenderingPlaceholder job={job} />
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Real providers (Shotstack / Runway / D-ID) take 30–120s. Mock completes in ~4s.
        </p>
      </div>
    );
  }

  // ── Failed ────────────────────────────────────────────────────────────────
  if (job.status === 'failed') {
    return (
      <div className="space-y-3">
        <StatusBadge status="failed" />
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-xs text-red-700 dark:text-red-400">
          {job.error_message || 'An unknown error occurred during rendering.'}
        </div>
        {onRegenerate && (
          <button onClick={onRegenerate} className="btn-secondary text-xs flex items-center gap-1.5">
            <RefreshCw size={12} /> Retry Video Generation
          </button>
        )}
      </div>
    );
  }

  // ── Completed ─────────────────────────────────────────────────────────────
  return (
    <div className={`space-y-3 ${compact ? '' : ''}`}>
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <StatusBadge status="completed" />
          {job.is_published && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400">
              <Zap size={10} fill="currentColor" /> Live
            </span>
          )}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {job.duration_seconds}s · {job.provider}
        </span>
      </div>

      {/* Video player — 9:16 portrait (TikTok/Reels format) */}
      <div className="relative rounded-xl overflow-hidden bg-black group aspect-[9/16] max-w-[220px] shadow-lg shadow-black/30">
        {/* Thumbnail shown before play */}
        {!playing && job.thumbnail_url && (
          <img
            src={job.thumbnail_url}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        <video
          ref={videoRef}
          src={job.video_url}
          muted={muted}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => setPlaying(false)}
          className={`w-full h-full object-cover ${playing ? 'block' : 'invisible'}`}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />

        {/* TechPulse TV watermark */}
        <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5">
          <Zap size={9} className="text-brand-400" fill="currentColor" />
          <span className="text-[9px] font-bold text-white uppercase tracking-wider">TechPulse TV</span>
        </div>

        {/* Duration pill */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5 text-[9px] text-white font-mono">
          {job.duration_seconds}s
        </div>

        {/* Headline overlay */}
        <div className="absolute bottom-10 left-0 right-0 px-2">
          <p className="text-white text-[10px] font-semibold leading-tight line-clamp-2 drop-shadow">
            {job.headline || articleTitle}
          </p>
        </div>

        {/* Controls bar */}
        <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 flex items-center gap-2">
          <button onClick={togglePlay} className="text-white hover:text-brand-300 transition-colors">
            {playing ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
          </button>

          {/* Progress bar */}
          <div
            className="flex-1 h-1 bg-white/25 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-brand-400 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span className="text-white text-[9px] font-mono tabular-nums min-w-[28px]">
            {formatTime(currentTime)}
          </span>

          <button onClick={toggleMute} className="text-white hover:text-brand-300 transition-colors">
            {muted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>

          <button onClick={openFullscreen} className="text-white hover:text-brand-300 transition-colors">
            <Maximize2 size={11} />
          </button>
        </div>

        {/* Large play button overlay when paused */}
        {!playing && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center group/play"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover/play:scale-110 transition-transform">
              <Play size={20} className="text-white ml-0.5" fill="white" />
            </div>
          </button>
        )}
      </div>

      {/* Action row */}
      {!compact && (
        <div className="flex flex-wrap gap-2">
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw size={11} /> Regenerate
            </button>
          )}
          <a
            href={job.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ExternalLink size={11} /> Open
          </a>
          <a
            href={job.video_url}
            download
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Download size={11} /> Download
          </a>
          {onPublish && !job.is_published && (
            <button
              onClick={onPublish}
              disabled={isPublishing}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors disabled:opacity-50"
            >
              {isPublishing ? <Loader size={11} className="animate-spin" /> : <Zap size={11} />}
              {isPublishing ? 'Publishing…' : 'Publish Video'}
            </button>
          )}
        </div>
      )}

      {/* Provider info */}
      {!compact && (
        <p className="text-[10px] text-gray-400 dark:text-gray-600">
          Job ID: <span className="font-mono">{job.provider_job_id || job.id.slice(0, 8)}</span>
          {' · '}Rendered {job.completed_at ? new Date(job.completed_at).toLocaleString() : '—'}
        </p>
      )}
    </div>
  );
}
