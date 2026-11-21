"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { normalizeUrl } from "@/lib/utils";

interface ClientProject {
  id: string;
  name: string;
  url: string;
  logoUrl: string | null;
  clientName: string;
  clientPhone: string | null;
  clientEmail: string | null;
  clientAddress: string | null;
  description: string | null;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function ProjectLogo({ project }: { project: ClientProject }) {
  const [failed, setFailed] = useState(false);

  if (!project.logoUrl || failed) {
    return (
      <div className="w-14 h-14 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center shrink-0">
        <span className="font-display text-lg font-bold text-brand-gold">
          {initials(project.name)}
        </span>
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={project.logoUrl}
        alt={`${project.name} logo`}
        className="w-full h-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

export function ClientProjectsSection() {
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/portfolio-projects", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.projects)) setProjects(data.projects);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="mb-16">
        <div className="h-8 w-64 rounded bg-white/5 animate-pulse mb-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-card h-48 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-brand-gold uppercase mb-3">
            Completed Work
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Client Projects
          </h2>
          <p className="text-brand-muted mt-3 max-w-2xl">
            Live systems and digital products we have delivered for clients.
            Select a project to open it in a new tab.
          </p>
        </div>
        <span className="text-brand-muted text-sm">
          {projects.length} project{projects.length === 1 ? "" : "s"} delivered
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => {
          const href = normalizeUrl(project.url);
          return (
            <a
              key={project.id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-5 group hover:-translate-y-1 hover:border-brand-gold/40 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <ProjectLogo project={project} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-lg font-semibold text-white group-hover:text-brand-gold transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-brand-muted text-sm mt-0.5 truncate">
                    {project.clientName}
                  </p>
                </div>
                <ExternalLink
                  size={16}
                  className="text-brand-muted group-hover:text-brand-gold shrink-0 mt-1"
                />
              </div>

              {project.description && (
                <p className="text-brand-muted text-sm leading-relaxed mt-4 line-clamp-2">
                  {project.description}
                </p>
              )}

              <div className="mt-4 space-y-1.5 text-xs text-brand-muted">
                {project.clientPhone && (
                  <p className="flex items-center gap-2">
                    <Phone size={12} className="text-brand-gold shrink-0" />
                    <span className="truncate">{project.clientPhone}</span>
                  </p>
                )}
                {project.clientEmail && (
                  <p className="flex items-center gap-2">
                    <Mail size={12} className="text-brand-gold shrink-0" />
                    <span className="truncate">{project.clientEmail}</span>
                  </p>
                )}
                {project.clientAddress && (
                  <p className="flex items-start gap-2">
                    <MapPin size={12} className="text-brand-gold shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{project.clientAddress}</span>
                  </p>
                )}
              </div>

              <span className="mt-4 inline-flex items-center gap-1 text-brand-gold text-sm">
                Visit project
                <ExternalLink size={14} />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
