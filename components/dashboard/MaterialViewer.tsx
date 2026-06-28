"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";
import {
  canCompleteMaterial,
  paginateText,
  type MaterialProgressData,
} from "@/lib/material-progress";
import { resolveMediaUrl } from "@/lib/media-url";

interface Material {
  id: string;
  title: string;
  type: string;
  fileUrl: string | null;
  externalUrl: string | null;
  content: string | null;
  extractedText: string | null;
  pageCount: number;
  mediaDuration: number | null;
  durationMinutes: number;
  completed: boolean;
  progress: MaterialProgressData;
  canComplete: boolean;
  completionHint?: string;
}

interface MaterialViewerProps {
  material: Material;
  enrollmentId: string;
  onProgressUpdate: (material: Material) => void;
  onComplete: () => void;
  submitting: boolean;
}

export function MaterialViewer({
  material,
  enrollmentId,
  onProgressUpdate,
  onComplete,
  submitting,
}: MaterialViewerProps) {
  const [local, setLocal] = useState(material);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocal(material);
  }, [material]);

  const saveProgress = useCallback(
    (progress: MaterialProgressData, extra?: { mediaDuration?: number }) => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const res = await fetch(`/api/learning/${enrollmentId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "updateMaterialProgress",
            materialId: material.id,
            progress,
            mediaDuration: extra?.mediaDuration,
          }),
        });
        const data = await res.json();
        if (data.material) onProgressUpdate(data.material);
      }, 400);
    },
    [enrollmentId, material.id, onProgressUpdate]
  );

  const updateProgress = (patch: Partial<MaterialProgressData>, extra?: { mediaDuration?: number }) => {
    const next = { ...local.progress, ...patch };
    const validation = canCompleteMaterial(
      local.type,
      local.pageCount,
      local.mediaDuration,
      next
    );
    setLocal((prev) => ({
      ...prev,
      progress: next,
      canComplete: validation.allowed,
      completionHint: validation.reason,
    }));
    saveProgress(next, extra);
  };

  const markPageViewed = (page: number) => {
    const pages = new Set([...local.progress.pagesViewed, page]);
    updateProgress({ pagesViewed: Array.from(pages), currentPage: page });
  };

  return (
    <div className="glass-card p-6">
      <h3 className="font-display text-xl font-bold text-white mb-2">{local.title}</h3>
      <p className="text-brand-muted text-xs mb-4">
        {local.type} · {local.pageCount > 1 ? `${local.pageCount} pages` : "1 page"}
        {local.mediaDuration ? ` · ${Math.round(local.mediaDuration / 60)} min video` : ""}
      </p>

      {local.type === "VIDEO" && (
        <VideoPlayer
          src={resolveMediaUrl(local.fileUrl)}
          progress={local.progress}
          onUpdate={updateProgress}
        />
      )}

      {local.type === "PDF" && local.fileUrl && (
        <PdfViewer
          fileUrl={resolveMediaUrl(local.fileUrl)!}
          pageCount={local.pageCount}
          progress={local.progress}
          onPageView={markPageViewed}
        />
      )}

      {(local.type === "DOC" || local.type === "TEXT") && (
        <TextPager
          text={local.extractedText || local.content || local.title}
          pageCount={local.pageCount}
          progress={local.progress}
          onPageView={markPageViewed}
        />
      )}

      {local.type === "IMAGE" && local.fileUrl && (
        <ImageViewer
          src={resolveMediaUrl(local.fileUrl)!}
          title={local.title}
          progress={local.progress}
          onUpdate={updateProgress}
        />
      )}

      {local.type === "LINK" && local.externalUrl && (
        <LinkViewer
          url={local.externalUrl}
          progress={local.progress}
          onUpdate={updateProgress}
        />
      )}

      {!local.fileUrl && local.type !== "LINK" && local.type !== "TEXT" && local.type !== "DOC" && local.content && (
        <TextPager
          text={local.content}
          pageCount={local.pageCount}
          progress={local.progress}
          onPageView={markPageViewed}
        />
      )}

      <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
        <p className="text-xs text-brand-muted">
          {local.canComplete
            ? "✓ All requirements met — you can proceed"
            : local.completionHint || "Complete all viewing requirements to continue"}
        </p>
      </div>

      {!local.completed && (
        <button
          onClick={onComplete}
          disabled={submitting || !local.canComplete}
          className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <CheckCircle size={16} />
          {submitting ? "Saving..." : "Complete & Continue"}
          <ChevronRight size={16} />
        </button>
      )}
      {local.completed && (
        <p className="flex items-center gap-2 text-green-400 text-sm mt-4">
          <CheckCircle size={16} /> Completed
        </p>
      )}
    </div>
  );
}

function VideoPlayer({
  src,
  progress,
  onUpdate,
}: {
  src: string | null;
  progress: MaterialProgressData;
  onUpdate: (p: Partial<MaterialProgressData>, extra?: { mediaDuration?: number }) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  if (!src) {
    return (
      <p className="text-red-400 text-sm py-4">
        Video file is not available. Please contact your instructor.
      </p>
    );
  }

  return (
    <div>
      <video
        ref={videoRef}
        controls
        playsInline
        preload="metadata"
        className="w-full rounded-lg mb-2 bg-black"
        src={src}
        onError={() => setError("Unable to play video. The file may be missing or in an unsupported format.")}
        onLoadedMetadata={() => {
          setError(null);
          const dur = videoRef.current?.duration;
          if (dur && isFinite(dur)) onUpdate({}, { mediaDuration: Math.round(dur) });
        }}
        onTimeUpdate={() => {
          const el = videoRef.current;
          if (!el || !el.duration) return;
          const percent = (el.currentTime / el.duration) * 100;
          onUpdate({ videoWatchedPercent: Math.max(progress.videoWatchedPercent, percent) });
        }}
        onEnded={() => onUpdate({ videoEnded: true, videoWatchedPercent: 100 })}
      />
      {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
      <p className="text-xs text-brand-muted">
        Progress: {Math.round(progress.videoWatchedPercent)}%
        {progress.videoEnded ? " · Finished" : " · Watch until the end"}
      </p>
    </div>
  );
}

function PdfViewer({
  fileUrl,
  pageCount,
  progress,
  onPageView,
}: {
  fileUrl: string;
  pageCount: number;
  progress: MaterialProgressData;
  onPageView: (page: number) => void;
}) {
  const [page, setPage] = useState(1);
  const total = Math.max(1, pageCount);

  useEffect(() => {
    onPageView(page);
  }, [page, onPageView]);

  const viewed = new Set(progress.pagesViewed).size;

  return (
    <div>
      <iframe
        src={`${fileUrl}#page=${page}`}
        className="w-full h-[500px] rounded-lg mb-3 border-0 bg-white"
        title="PDF document"
      />
      <div className="flex items-center justify-between">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-1 text-sm text-brand-muted disabled:opacity-30"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <span className="text-xs text-brand-muted">
          Page {page} of {total} · {viewed}/{total} viewed
        </span>
        <button
          disabled={page >= total}
          onClick={() => setPage((p) => Math.min(total, p + 1))}
          className="flex items-center gap-1 text-sm text-brand-gold disabled:opacity-30"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function TextPager({
  text,
  pageCount,
  progress,
  onPageView,
}: {
  text: string;
  pageCount: number;
  progress: MaterialProgressData;
  onPageView: (page: number) => void;
}) {
  const pages = paginateText(text, pageCount);
  const [page, setPage] = useState(1);

  useEffect(() => {
    onPageView(page);
  }, [page, onPageView]);

  const viewed = new Set(progress.pagesViewed).size;

  return (
    <div>
      <div className="prose prose-invert text-sm text-brand-muted mb-4 min-h-[300px] p-4 bg-white/5 rounded-lg">
        {pages[page - 1]}
      </div>
      <div className="flex items-center justify-between">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="flex items-center gap-1 text-sm text-brand-muted disabled:opacity-30"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        <span className="text-xs text-brand-muted">
          Page {page} of {pages.length} · {viewed}/{pages.length} viewed
        </span>
        <button
          disabled={page >= pages.length}
          onClick={() => setPage((p) => Math.min(pages.length, p + 1))}
          className="flex items-center gap-1 text-sm text-brand-gold disabled:opacity-30"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ImageViewer({
  src,
  title,
  progress,
  onUpdate,
}: {
  src: string;
  title: string;
  progress: MaterialProgressData;
  onUpdate: (p: Partial<MaterialProgressData>) => void;
}) {
  useEffect(() => {
    onUpdate({ pagesViewed: [1], currentPage: 1 });
    let seconds = 0;
    const timer = setInterval(() => {
      seconds += 1;
      onUpdate({ viewSeconds: seconds });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={title} className="w-full rounded-lg mb-2" />
      <p className="text-xs text-brand-muted">
        Viewing: {progress.viewSeconds}s / 5s required
      </p>
    </div>
  );
}

function LinkViewer({
  url,
  progress,
  onUpdate,
}: {
  url: string;
  progress: MaterialProgressData;
  onUpdate: (p: Partial<MaterialProgressData>) => void;
}) {
  const opened = useRef(false);

  useEffect(() => {
    if (!progress.linkOpened) return;
    if (opened.current) return;
    opened.current = true;
    let seconds = 0;
    const timer = setInterval(() => {
      seconds += 1;
      onUpdate({ viewSeconds: seconds });
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.linkOpened]);

  return (
    <div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onUpdate({ linkOpened: true, pagesViewed: [1] })}
        className="flex items-center gap-2 text-brand-gold mb-4 hover:underline"
      >
        <LinkIcon size={16} /> Open External Resource
      </a>
      <iframe src={url} className="w-full h-[400px] rounded-lg border border-white/10 mb-2" title="External content" />
      <p className="text-xs text-brand-muted">
        {progress.linkOpened
          ? `Review time: ${progress.viewSeconds}s / 15s required`
          : "Open the link and review the content"}
      </p>
    </div>
  );
}
