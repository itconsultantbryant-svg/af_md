"use client";

import { resolveMediaUrl } from "@/lib/media-url";
import { X } from "lucide-react";

interface PreviewMaterial {
  id?: string;
  title: string;
  type: string;
  fileUrl: string | null;
  externalUrl?: string | null;
  content?: string | null;
  extractedText?: string | null;
  published?: boolean;
}

export function AdminMaterialPreview({
  material,
  localPreviewUrl,
  onClose,
  onPublish,
}: {
  material: PreviewMaterial;
  localPreviewUrl?: string | null;
  onClose: () => void;
  onPublish?: (id: string) => void;
}) {
  const mediaSrc = localPreviewUrl || resolveMediaUrl(material.fileUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-brand-darker border border-white/10 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-white">{material.title}</h3>
            <p className="text-brand-muted text-xs mt-1">
              {material.type}
              {material.published === false && (
                <span className="ml-2 text-amber-400">Draft — not visible to students</span>
              )}
              {material.published && (
                <span className="ml-2 text-green-400">Published</span>
              )}
            </p>
          </div>
          <button onClick={onClose} className="text-brand-muted hover:text-white">
            <X size={20} />
          </button>
        </div>

        {material.type === "VIDEO" && mediaSrc && (
          <video controls playsInline preload="metadata" className="w-full rounded-lg bg-black" src={mediaSrc} />
        )}
        {material.type === "VIDEO" && !mediaSrc && (
          <p className="text-red-400 text-sm">No video file attached.</p>
        )}

        {material.type === "PDF" && mediaSrc && (
          <iframe src={mediaSrc} className="w-full h-[500px] rounded-lg bg-white border-0" title="PDF preview" />
        )}

        {material.type === "IMAGE" && mediaSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={mediaSrc} alt={material.title} className="w-full rounded-lg" />
        )}

        {(material.type === "DOC" || material.type === "TEXT") && (
          <div className="prose prose-invert text-sm text-brand-muted p-4 bg-white/5 rounded-lg max-h-[400px] overflow-y-auto">
            {material.extractedText || material.content || "No text content extracted yet."}
          </div>
        )}

        {material.type === "LINK" && material.externalUrl && (
          <iframe src={material.externalUrl} className="w-full h-[400px] rounded-lg border border-white/10" title="Link preview" />
        )}

        <div className="flex gap-3 mt-6">
          {material.id && material.published === false && onPublish && (
            <button
              onClick={() => onPublish(material.id!)}
              className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium"
            >
              Publish to Students
            </button>
          )}
          <button onClick={onClose} className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
