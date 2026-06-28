"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { slideLeft, slideRight } from "@/lib/animations";

export function AboutStrip() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section
      ref={ref}
      className="relative py-24 bg-brand-darker kente-pattern"
      style={{ backgroundBlendMode: "overlay" }}
    >
      <div className="absolute inset-0 bg-brand-darker/97" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={slideLeft}
        >
          <h2 className="font-display text-4xl md:text-[52px] font-bold text-white mb-4">
            We Are AfriMind Tech&AI Consulting Agency
          </h2>
          <svg className="w-48 h-2 mb-4" viewBox="0 0 200 8">
            <motion.path
              d="M0 4 H200"
              stroke="#D4A017"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </svg>
          <p className="font-mono text-xs tracking-[0.2em] text-brand-gold uppercase">
            Africa&apos;s Premier AI Agency
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={slideRight}
          className="space-y-4 text-brand-muted leading-relaxed"
        >
          <p>
            AfriMind Tech&AI Consulting Agency is Africa&apos;s premier artificial intelligence agency,
            headquartered in Monrovia, Liberia. We partner with businesses,
            governments, NGOs, and organizations to design, build, and deploy AI
            solutions that drive real impact.
          </p>
          <p>
            Across the continent, organizations struggle to access affordable,
            context-aware AI that understands local infrastructure, languages,
            and operational realities. Global solutions often fail where
            bandwidth is limited and power is intermittent.
          </p>
          <p>
            Our approach is practical, scalable, and locally grounded. We
            engineer AI systems that work in African conditions — offline-first
            where needed, mobile-first by default, and built to world-class
            standards at accessible pricing.
          </p>
          <Link
            href="/about"
            className="inline-block text-brand-gold hover:underline cursor-hover mt-2"
          >
            Discover Our Story →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
