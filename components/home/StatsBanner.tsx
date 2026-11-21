"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CountUp } from "@/components/ui/CountUp";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { usePublicStats } from "@/lib/hooks/usePublicStats";

export function StatsBanner() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const data = usePublicStats();

  const stats = data.highlights.slice(0, 4);

  return (
    <section className="py-16 bg-gold-gradient">
      <motion.div
        ref={ref}
        variants={staggerContainer}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8"
      >
        {stats.map((stat) => (
          <motion.div key={stat.key} variants={fadeUp} className="text-center">
            <p className="font-display text-4xl md:text-5xl font-bold text-brand-navy">
              <CountUp
                end={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
            </p>
            <p className="text-brand-navy/80 text-sm mt-2 font-medium">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
