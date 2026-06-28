"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlayCircle, Sparkles } from "lucide-react";
import { RequestDemoModal } from "./RequestDemoModal";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function PortfolioHero() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative mb-16 rounded-2xl overflow-hidden border border-white/10"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/40 via-brand-dark to-brand-darker" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="relative px-6 py-12 md:py-16 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-2xl">
            <motion.div variants={fadeUp} className="flex items-center gap-2 text-brand-gold mb-3">
              <Sparkles size={16} />
              <span className="text-xs font-mono uppercase tracking-wider">Live Software Systems</span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-display text-3xl md:text-4xl font-bold text-white mb-3"
            >
              Our Work Speaks for Itself
            </motion.h1>
            <motion.p variants={fadeUp} className="text-brand-muted leading-relaxed">
              Explore enterprise systems we&apos;ve built for governments, banks, NGOs, and
              institutions — then request a demo version tailored to your organization.
            </motion.p>
          </div>
          <motion.button
            variants={fadeUp}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setDemoOpen(true)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-gold text-brand-dark rounded-xl font-medium text-sm shadow-lg shadow-brand-gold/20 hover:bg-brand-gold-light transition-colors shrink-0"
          >
            <PlayCircle size={20} />
            Request Demo
          </motion.button>
        </div>
      </motion.div>

      <RequestDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
