"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fadeUp } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  label,
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        className
      )}
    >
      {label && (
        <p className="font-mono text-[11px] tracking-[0.2em] text-brand-gold uppercase mb-3">
          {label}
        </p>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
        {title}
      </h2>
      <div
        className={cn(
          "w-20 h-0.5 bg-brand-gold mt-4",
          align === "center" && "mx-auto"
        )}
      />
      {subtitle && (
        <p className="mt-4 text-brand-muted text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
