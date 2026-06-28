"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/lib/data/portfolio";
import { ScreenshotCarousel } from "./ScreenshotCarousel";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onRequestDemo?: (project: Project) => void;
}

export function ProjectModal({ project, onClose, onRequestDemo }: ProjectModalProps) {
  useEffect(() => {
    if (!project) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-brand-dark/95 backdrop-blur-md flex items-end md:items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="bg-brand-darker border border-white/10 rounded-t-2xl md:rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-white/5 bg-brand-darker/95 backdrop-blur-md z-10">
              <div>
                <Badge category={project.category} className="mb-2 capitalize">
                  {project.category}
                </Badge>
                <h2 className="font-display text-2xl font-bold text-white">
                  {project.title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-brand-muted hover:text-white cursor-hover"
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-8">
              <ScreenshotCarousel
                title={project.title}
                subtitle={project.clientType}
                count={3}
              />

              <div>
                <h3 className="font-display text-lg font-semibold text-brand-gold mb-2">
                  Problem
                </h3>
                <p className="text-brand-muted leading-relaxed">
                  {project.problem}
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-brand-gold mb-2">
                  Solution
                </h3>
                <p className="text-brand-muted leading-relaxed">
                  {project.solution}
                </p>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-brand-gold mb-4">
                  Impact
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {project.impact.map((item) => (
                    <div
                      key={item.label}
                      className="text-center p-4 rounded-xl bg-white/5 border border-brand-gold/10"
                    >
                      <p className="font-display text-2xl font-bold text-brand-gold">
                        {item.metric}
                      </p>
                      <p className="text-brand-muted text-xs mt-1">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-display text-lg font-semibold text-brand-gold mb-3">
                  Technology Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="tech">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <Button
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => onRequestDemo?.(project)}
                >
                  <PlayCircle size={18} />
                  Request Demo
                </Button>
                <Button variant="secondary" href="/contact" className="w-full">
                  Start a Similar Project
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
