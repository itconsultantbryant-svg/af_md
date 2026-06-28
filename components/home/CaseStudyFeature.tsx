"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Badge } from "@/components/ui/Badge";
import { SiteImage } from "@/components/ui/SiteImage";
import { slideLeft, slideRight } from "@/lib/animations";

const techStack = ["React", "Next.js", "PostgreSQL", "SQLite", "REST API", "Offline Sync"];

export function CaseStudyFeature() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section ref={ref} className="py-24 bg-brand-darker">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[55%_45%] gap-12 items-center">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={slideLeft}
          className="relative"
        >
          <div className="aspect-video rounded-2xl border border-white/10 overflow-hidden relative">
            <SiteImage
              alt="AI-Powered Health Information System dashboard"
              title="Health Information System"
              variant="case-study"
              subtitle="Government Health · Liberia"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white">Live in Production</span>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={slideRight}
        >
          <p className="font-mono text-[11px] tracking-[0.2em] text-brand-gold uppercase mb-3">
            Featured Project
          </p>
          <h3 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            AI-Powered Health Information System
          </h3>
          <p className="text-brand-muted text-sm mb-4">
            Government Health Institution — Liberia
          </p>
          <p className="text-brand-muted leading-relaxed mb-6">
            AfriMind Tech&AI Consulting Agency designed and deployed a comprehensive digital health
            platform enabling real-time patient data collection, case tracking,
            and reporting across multiple facilities nationwide. Built for
            offline-first environments with seamless sync and integration with
            national health reporting systems.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {techStack.map((tech) => (
              <Badge key={tech} variant="tech">
                {tech}
              </Badge>
            ))}
          </div>
          <p className="text-brand-gold text-sm font-mono mb-6">
            31 Facilities · Offline-First · Real-Time Reporting
          </p>
          <Link
            href="/portfolio"
            className="text-brand-gold hover:underline cursor-hover"
          >
            Read Full Case Study →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
