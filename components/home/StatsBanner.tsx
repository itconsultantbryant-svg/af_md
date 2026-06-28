"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CountUp } from "@/components/ui/CountUp";
import { fadeUp, staggerContainer } from "@/lib/animations";

const stats = [
  { value: 50, suffix: "+", label: "AI Projects Completed" },
  { value: 15, suffix: "+", label: "Industries Served" },
  { prefix: "$", value: 2, suffix: "M+", label: "Value Delivered for Clients" },
  { value: 100, suffix: "%", label: "African-Founded & Operated" },
];

export function StatsBanner() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

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
          <motion.div key={stat.label} variants={fadeUp} className="text-center">
            <p className="font-display text-4xl md:text-5xl font-bold text-brand-navy">
              <CountUp
                end={stat.value}
                suffix={stat.suffix}
                prefix={stat.prefix}
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
