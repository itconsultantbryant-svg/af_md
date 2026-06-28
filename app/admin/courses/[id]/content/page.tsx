"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { AdminMaterialPreview } from "@/components/admin/AdminMaterialPreview";

interface Material {
  id: string;
  title: string;
  type: string;
  fileUrl: string | null;
  externalUrl: string | null;
  extractedText: string | null;
  content: string | null;
  published: boolean;
  durationMinutes: number;
}

interface Section {
  id: string;
  title: string;
  description: string | null;
  materials: Material[];
  exam: { id: string; title: string; questions: string; passingScore: number } | null;
}

interface Course {
  id: string;
  title: string;
  completionHours: number;
  sections: Section[];
  finalExam: { id: string; title: string; questions: string } | null;
}

function examCount(questions: string | undefined): number {
  try {
    return JSON.parse(questions || "[]").length;
  } catch {
    return 0;
  }
}

export default function AdminCourseContentPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [sectionTitle, setSectionTitle] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [hours, setHours] = useState(8);
  const [linkForm, setLinkForm] = useState({ sectionId: "", title: "", url: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () =>
    fetch(`/api/courses/${courseId}/content`)
      .then((r) => r.json())
      .then((d) => {
        if (d.course) {
          setCourse(d.course);
          setHours(d.course.completionHours);
        }
      });

  useEffect(() => {
    load();
  }, [courseId]);

  useEffect(() => {
    if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    if (uploadFile) {
      setLocalPreviewUrl(URL.createObjectURL(uploadFile));
    } else {
      setLocalPreviewUrl(null);
    }
    return () => {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadFile]);

  const addSection = async () => {
    await fetch(`/api/courses/${courseId}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addSection", title: sectionTitle || "New Section" }),
    });
    setSectionTitle("");
    load();
  };

  const uploadMaterial = async (publish: boolean) => {
    if (!activeSection || !uploadTitle || !uploadFile) {
      setUploadMsg({ type: "err", text: "Select a section, enter a title, and choose a file." });
      return;
    }
    setUploading(true);
    setUploadMsg(null);
    const fd = new FormData();
    fd.append("sectionId", activeSection);
    fd.append("title", uploadTitle);
    fd.append("type", "VIDEO");
    fd.append("durationMinutes", "15");
    fd.append("publish", String(publish));
    fd.append("file", uploadFile);

    const res = await fetch(`/api/courses/${courseId}/upload`, { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setUploadMsg({ type: "err", text: data.error || "Upload failed" });
      return;
    }

    const examInfo =
      data.sectionExamCount > 0
        ? `${data.sectionExamCount} section exam questions generated.`
        : "Exam generation pending — click Regenerate Exams.";
    setUploadMsg({
      type: "ok",
      text: `Uploaded successfully. ${examInfo}${data.processingError ? ` Warning: ${data.processingError}` : ""}`,
    });

    setUploadTitle("");
    setUploadFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    await load();

    if (data.material) {
      setPreviewMaterial(data.material);
      setLocalPreviewUrl(null);
    }
  };

  const publishMaterial = async (materialId: string) => {
    await fetch(`/api/courses/${courseId}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publishMaterial", materialId }),
    });
    setPreviewMaterial(null);
    load();
  };

  const addLink = async () => {
    if (!linkForm.sectionId || !linkForm.title || !linkForm.url) return;
    const res = await fetch(`/api/courses/${courseId}/content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "addMaterial",
        sectionId: linkForm.sectionId,
        title: linkForm.title,
        type: "LINK",
        externalUrl: linkForm.url,
        durationMinutes: 10,
        published: false,
      }),
    });
    const data = await res.json();
    setLinkForm({ sectionId: "", title: "", url: "" });
    await load();
    if (data.material) setPreviewMaterial(data.material);
  };

  const deleteItem = async (type: string, itemId: string) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/courses/${courseId}/content?type=${type}&itemId=${itemId}`, {
      method: "DELETE",
    });
    load();
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white";

  const inferLocalType = (file: File) => {
    if (file.type.startsWith("video/")) return "VIDEO";
    if (file.type.includes("pdf")) return "PDF";
    if (file.type.includes("word") || file.name.match(/\.docx?$/i)) return "DOC";
    if (file.type.startsWith("image/")) return "IMAGE";
    return "PDF";
  };

  if (!course) return <p className="text-brand-muted">Loading...</p>;

  return (
    <div>
      {previewMaterial && (
        <AdminMaterialPreview
          material={previewMaterial}
          localPreviewUrl={localPreviewUrl}
          onClose={() => setPreviewMaterial(null)}
          onPublish={publishMaterial}
        />
      )}

      <Link href="/admin/courses" className="flex items-center gap-2 text-brand-muted text-sm mb-6 hover:text-white">
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      <h1 className="font-display text-2xl font-bold text-white mb-1">{course.title}</h1>
      <p className="text-brand-muted text-sm mb-4">
        Preview materials before publishing. Only published materials are visible to students. Exams auto-generate from content.
      </p>

      {uploadMsg && (
        <div
          className={`glass-card p-3 mb-4 text-sm flex items-center gap-2 ${
            uploadMsg.type === "ok" ? "text-green-400" : "text-red-400"
          }`}
        >
          {uploadMsg.type === "ok" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {uploadMsg.text}
        </div>
      )}

      <div className="glass-card p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-white font-medium">AI Exam Generation</p>
          <p className="text-xs text-brand-muted">Rebuild all section & final exams from materials</p>
        </div>
        <button
          onClick={async () => {
            const res = await fetch(`/api/courses/${courseId}/content`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "regenerateExams" }),
            });
            if (res.ok) {
              setUploadMsg({ type: "ok", text: "Exams regenerated from all materials." });
              load();
            }
          }}
          className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium"
        >
          Regenerate Exams
        </button>
      </div>

      <div className="glass-card p-4 mb-6 flex items-center gap-4">
        <label className="text-sm text-brand-muted">Completion Hours:</label>
        <input
          type="number"
          className="w-24 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white"
          value={hours}
          onChange={(e) => setHours(+e.target.value)}
        />
        <button
          onClick={async () => {
            await fetch(`/api/courses/${courseId}/content`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "updateHours", completionHours: hours }),
            });
            load();
          }}
          className="px-3 py-1 bg-brand-gold text-brand-dark rounded text-sm"
        >
          Save
        </button>
      </div>

      <div className="glass-card p-4 mb-6">
        <h2 className="font-semibold text-white mb-3">Add Section</h2>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Section title"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
          />
          <button onClick={addSection} className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm flex items-center gap-1">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {course.sections.map((section) => (
        <div key={section.id} className="glass-card p-4 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-white">{section.title}</h3>
            <button onClick={() => deleteItem("section", section.id)} className="text-red-400 p-1">
              <Trash2 size={16} />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            {section.materials.map((m) => (
              <div key={m.id} className="flex justify-between items-center text-sm py-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className={m.published ? "text-brand-muted" : "text-amber-400"}>
                    {m.type}: {m.title}
                  </span>
                  {!m.published && <span className="text-[10px] text-amber-400 border border-amber-400/30 px-1.5 rounded">DRAFT</span>}
                  {m.published && <span className="text-[10px] text-green-400 border border-green-400/30 px-1.5 rounded">LIVE</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPreviewMaterial(m)}
                    className="text-brand-gold flex items-center gap-1 text-xs"
                  >
                    <Eye size={14} /> Preview
                  </button>
                  {!m.published && (
                    <button onClick={() => publishMaterial(m.id)} className="text-xs text-green-400">
                      Publish
                    </button>
                  )}
                  <button onClick={() => deleteItem("material", m.id)} className="text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-white/10 rounded-lg p-4 mb-3 bg-white/[0.02]">
            <p className="text-xs text-brand-gold font-medium mb-3 flex items-center gap-1">
              <Upload size={12} /> Upload Material — Preview before publishing
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <input
                  className={inputClass}
                  placeholder="Material title"
                  value={activeSection === section.id ? uploadTitle : ""}
                  onFocus={() => setActiveSection(section.id)}
                  onChange={(e) => {
                    setActiveSection(section.id);
                    setUploadTitle(e.target.value);
                  }}
                />
                <input
                  ref={activeSection === section.id ? fileInputRef : undefined}
                  type="file"
                  accept="video/*,.pdf,.doc,.docx,image/*"
                  className="text-xs text-brand-muted w-full"
                  onChange={(e) => {
                    setActiveSection(section.id);
                    setUploadFile(e.target.files?.[0] || null);
                  }}
                />
                <div className="flex gap-2">
                  <button
                    disabled={uploading || activeSection !== section.id}
                    onClick={() => uploadMaterial(false)}
                    className="px-3 py-1.5 bg-white/10 text-white rounded text-xs disabled:opacity-40"
                  >
                    {uploading ? "Uploading..." : "Upload Draft"}
                  </button>
                  <button
                    disabled={uploading || activeSection !== section.id}
                    onClick={() => uploadMaterial(true)}
                    className="px-3 py-1.5 bg-brand-gold text-brand-dark rounded text-xs font-medium disabled:opacity-40"
                  >
                    Upload & Publish
                  </button>
                </div>
              </div>
              <div>
                {uploadFile && activeSection === section.id && localPreviewUrl && (
                  <div className="rounded-lg overflow-hidden border border-white/10">
                    <p className="text-[10px] text-brand-muted px-2 py-1 bg-white/5">Local preview</p>
                    {inferLocalType(uploadFile) === "VIDEO" && (
                      <video controls playsInline className="w-full bg-black" src={localPreviewUrl} />
                    )}
                    {inferLocalType(uploadFile) === "IMAGE" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={localPreviewUrl} alt="Preview" className="w-full" />
                    )}
                    {(inferLocalType(uploadFile) === "PDF" || inferLocalType(uploadFile) === "DOC") && (
                      <p className="text-xs text-brand-muted p-4">
                        {uploadFile.name} — preview available after upload
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-3">
            <div className="space-y-2">
              <p className="text-xs text-brand-muted flex items-center gap-1"><LinkIcon size={12} /> Add Link</p>
              <input
                className={inputClass}
                placeholder="Link title"
                value={linkForm.sectionId === section.id ? linkForm.title : ""}
                onChange={(e) => setLinkForm({ ...linkForm, sectionId: section.id, title: e.target.value })}
              />
              <input
                className={inputClass}
                placeholder="https://..."
                value={linkForm.sectionId === section.id ? linkForm.url : ""}
                onChange={(e) => setLinkForm({ ...linkForm, sectionId: section.id, url: e.target.value })}
              />
              <button onClick={addLink} className="px-3 py-1.5 bg-white/10 text-white rounded text-xs">
                Add Link (Draft)
              </button>
            </div>
          </div>

          {section.exam ? (
            <p className="text-xs text-green-400">
              ✓ Section exam: {examCount(section.exam.questions)} questions (70% pass)
            </p>
          ) : (
            <p className="text-xs text-brand-muted">Upload & publish materials to generate section exam</p>
          )}
        </div>
      ))}

      <div className="glass-card p-4">
        {course.finalExam ? (
          <p className="text-green-400 text-sm">
            ✓ Final exam: {examCount(course.finalExam.questions)} questions (combined from all sections)
          </p>
        ) : (
          <p className="text-brand-muted text-sm">Final exam generates when section exams exist</p>
        )}
      </div>
    </div>
  );
}
