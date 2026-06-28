"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SiteImage } from "@/components/ui/SiteImage";
import { FilterBar } from "./FilterBar";
import { ProjectModal } from "./ProjectModal";
import { RequestDemoModal } from "./RequestDemoModal";
import { projects, type Project } from "@/lib/data/portfolio";
import { PlayCircle } from "lucide-react";

export function ProjectGrid() {
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [demoSystemId, setDemoSystemId] = useState<string | undefined>();
  const [demoTitle, setDemoTitle] = useState<string | undefined>();

  const filtered =
    filter === "all"
      ? projects
      : projects.filter((p) => p.category === filter);

  const openDemo = (project?: Project) => {
    setDemoSystemId(project?.id);
    setDemoTitle(project?.title);
    setDemoOpen(true);
  };

  return (
    <>
      <FilterBar active={filter} onChange={setFilter} />

      <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="glass-card overflow-hidden hover:-translate-y-2 transition-transform duration-300 hover:border-brand-gold/40">
                <button
                  onClick={() => setSelected(project)}
                  className="w-full text-left cursor-hover"
                >
                  <div className="relative aspect-video border-b border-white/5">
                    <SiteImage
                      alt={project.title}
                      title={project.title}
                      variant="portfolio"
                      subtitle={`${project.clientType} · ${project.country}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <Badge category={project.category} className="mb-3 capitalize">
                      {project.category}
                    </Badge>
                    <h3 className="font-display text-lg font-semibold text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-brand-muted text-xs mb-2">
                      {project.clientType} — {project.country}
                    </p>
                    <p className="text-brand-muted text-sm mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.techStack.slice(0, 4).map((tech) => (
                        <Badge key={tech} variant="tech">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <span className="text-brand-gold text-sm">
                      View Case Study →
                    </span>
                  </div>
                </button>
                <div className="px-5 pb-5 pt-0">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openDemo(project)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border border-brand-gold/40 text-brand-gold rounded-lg text-sm font-medium hover:bg-brand-gold/10 transition-colors"
                  >
                    <PlayCircle size={16} />
                    Request Demo
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <ProjectModal
        project={selected}
        onClose={() => setSelected(null)}
        onRequestDemo={(p) => {
          setSelected(null);
          openDemo(p);
        }}
      />

      <RequestDemoModal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        preselectedSystemId={demoSystemId}
        preselectedTitle={demoTitle}
      />
    </>
  );
}
