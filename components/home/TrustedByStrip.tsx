"use client";

import { motion } from "framer-motion";
import { partners } from "@/lib/data/team";

export function TrustedByStrip() {
  return (
    <section className="py-10 bg-brand-darker border-y border-white/5 overflow-hidden">
      <p className="text-center text-brand-muted text-xs font-mono uppercase tracking-[0.2em] mb-6">
        Trusted by organizations across Africa
      </p>
      <div className="flex animate-scroll">
        {[...partners, ...partners].map((partner, i) => (
          <motion.div
            key={`${partner}-${i}`}
            whileHover={{ scale: 1.05, color: "#D4A017" }}
            className="flex-shrink-0 mx-10 text-brand-muted text-base md:text-lg font-display font-semibold grayscale hover:grayscale-0 transition-all cursor-default"
          >
            {partner}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
