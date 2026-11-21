"use client";

import { useEffect, useState } from "react";
import {
  ExternalLink,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { normalizeUrl } from "@/lib/utils";

interface PortfolioProject {
  id: string;
  name: string;
  url: string;
  logoUrl: string | null;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  clientAddress: string | null;
  description: string | null;
  published: boolean;
  sortOrder: number;
  createdAt: string;
}

interface ProjectForm {
  name: string;
  url: string;
  logoUrl: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  description: string;
  published: boolean;
  sortOrder: string;
}

const emptyForm: ProjectForm = {
  name: "",
  url: "",
  logoUrl: "",
  clientName: "",
  clientPhone: "",
  clientEmail: "",
  clientAddress: "",
  description: "",
  published: true,
  sortOrder: "0",
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Logo({
  name,
  logoUrl,
  className = "w-12 h-12",
}: {
  name: string;
  logoUrl: string | null;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setFailed(false);
  }, [logoUrl]);
  if (!logoUrl || failed) {
    return (
      <div
        className={`${className} rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shrink-0`}
      >
        <span className="font-display font-bold text-brand-gold text-sm">
          {initials(name)}
        </span>
      </div>
    );
  }
  return (
    <div
      className={`${className} rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/portfolio-projects/admin", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProjects(data?.projects || []))
      .catch(() => setError("Unable to load portfolio projects."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, sortOrder: String(projects.length) });
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const openEdit = (project: PortfolioProject) => {
    setEditing(project);
    setForm({
      name: project.name,
      url: project.url,
      logoUrl: project.logoUrl || "",
      clientName: project.clientName,
      clientPhone: project.clientPhone || "",
      clientEmail: project.clientEmail || "",
      clientAddress: project.clientAddress || "",
      description: project.description || "",
      published: project.published,
      sortOrder: String(project.sortOrder),
    });
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/portfolio-projects/upload", {
        method: "POST",
        body: data,
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.logoUrl) {
        setError(body?.error || "Could not upload the logo.");
        return;
      }
      setForm((current) => ({ ...current, logoUrl: body.logoUrl }));
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    setMessage("");
    setError("");
    if (!form.name.trim() || !form.clientName.trim() || !form.url.trim()) {
      setError("Project name, URL, and client name are required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      url: form.url.trim(),
      logoUrl: form.logoUrl.trim() || null,
      clientName: form.clientName.trim(),
      clientPhone: form.clientPhone.trim() || null,
      clientEmail: form.clientEmail.trim() || null,
      clientAddress: form.clientAddress.trim() || null,
      description: form.description.trim() || null,
      published: form.published,
      sortOrder: Number(form.sortOrder) || 0,
    };

    const res = await fetch(
      editing ? `/api/portfolio-projects/${editing.id}` : "/api/portfolio-projects",
      {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Could not save this project.");
      return;
    }

    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setMessage(editing ? "Project updated." : "Project added.");
    load();
  };

  const remove = async (project: PortfolioProject) => {
    if (!confirm(`Delete "${project.name}" from the portfolio?`)) return;
    const res = await fetch(`/api/portfolio-projects/${project.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      setError("Could not delete this project.");
      return;
    }
    setMessage("Project deleted.");
    load();
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-gold/50";

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Portfolio Projects
          </h1>
          <p className="text-brand-muted text-sm">
            Add completed client projects with their logo, website, and client
            contact details. Published projects appear above the portfolio page.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {showForm && (
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-white">
              {editing ? "Edit project" : "New project"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-brand-muted hover:text-white"
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">
                Project name *
              </span>
              <input
                className={inputClass}
                placeholder="Health Information System"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">
                Project URL *
              </span>
              <input
                className={inputClass}
                placeholder="https://example.com"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
              />
            </label>

            <div className="md:col-span-2">
              <span className="text-brand-muted text-xs mb-1 block">Logo</span>
              <div className="flex flex-wrap items-center gap-3">
                <Logo name={form.name || "Project"} logoUrl={form.logoUrl || null} />
                <label className="flex items-center gap-2 px-3 py-2 border border-white/20 rounded-lg text-sm text-white cursor-pointer hover:border-brand-gold/40">
                  <Upload size={15} />
                  {uploading ? "Uploading..." : "Upload image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) uploadLogo(file);
                      e.target.value = "";
                    }}
                  />
                </label>
                <input
                  className={`${inputClass} flex-1 min-w-[220px]`}
                  placeholder="Or paste a logo URL"
                  value={form.logoUrl}
                  onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                />
                {form.logoUrl && (
                  <button
                    onClick={() => setForm({ ...form, logoUrl: "" })}
                    className="text-xs text-brand-muted hover:text-red-400"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">
                Client name *
              </span>
              <input
                className={inputClass}
                placeholder="Ministry of Health"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">
                Client phone
              </span>
              <input
                className={inputClass}
                placeholder="+231 77 000 0000"
                value={form.clientPhone}
                onChange={(e) => setForm({ ...form, clientPhone: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">
                Client email
              </span>
              <input
                className={inputClass}
                type="email"
                placeholder="client@example.com"
                value={form.clientEmail}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">
                Client address
              </span>
              <input
                className={inputClass}
                placeholder="Monrovia, Liberia"
                value={form.clientAddress}
                onChange={(e) =>
                  setForm({ ...form, clientAddress: e.target.value })
                }
              />
            </label>
            <label className="block md:col-span-2">
              <span className="text-brand-muted text-xs mb-1 block">
                Description
              </span>
              <textarea
                className={inputClass}
                rows={2}
                placeholder="Short description of the project..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </label>
            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">
                Sort order
              </span>
              <input
                className={inputClass}
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) =>
                  setForm({ ...form, published: e.target.checked })
                }
                className="accent-brand-gold"
              />
              <span className="text-sm text-brand-muted">
                Publish on portfolio page
              </span>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={save}
              disabled={uploading}
              className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium disabled:opacity-60"
            >
              {editing ? "Save changes" : "Add project"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-brand-muted">Loading portfolio projects...</p>
      ) : projects.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-brand-muted">
            No projects yet. Add your first completed client project.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div key={project.id} className="glass-card p-5">
              <div className="flex flex-wrap items-start gap-4">
                <Logo name={project.name} logoUrl={project.logoUrl} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    <span
                      className={
                        project.published
                          ? "text-emerald-400 text-xs"
                          : "text-brand-muted text-xs"
                      }
                    >
                      {project.published ? "Published" : "Hidden"}
                    </span>
                  </div>
                  <p className="text-brand-muted text-sm mt-0.5">
                    {project.clientName}
                  </p>
                  <a
                    href={normalizeUrl(project.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-gold text-xs mt-2 hover:text-brand-gold-light"
                  >
                    {project.url}
                    <ExternalLink size={12} />
                  </a>
                  {project.description && (
                    <p className="text-brand-muted text-sm mt-2 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-muted mt-2">
                    {project.clientPhone && (
                      <span className="inline-flex items-center gap-1">
                        <Phone size={11} /> {project.clientPhone}
                      </span>
                    )}
                    {project.clientEmail && (
                      <span className="inline-flex items-center gap-1">
                        <Mail size={11} /> {project.clientEmail}
                      </span>
                    )}
                    {project.clientAddress && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} /> {project.clientAddress}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(project)}
                    className="p-2 text-brand-muted hover:text-white"
                    aria-label={`Edit ${project.name}`}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => remove(project)}
                    className="p-2 text-brand-muted hover:text-red-400"
                    aria-label={`Delete ${project.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
