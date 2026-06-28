"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/Button";
import { fadeUp } from "@/lib/animations";

export function FinalCTA() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-brand-dark" />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(212,160,23,0.3) 0%, rgba(74,144,217,0.2) 50%, transparent 70%)",
        }}
        animate={{ x: [0, 50, -30, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp}
        className="relative z-10 max-w-3xl mx-auto px-4 text-center"
      >
        <h2 className="font-display text-4xl md:text-[52px] font-bold text-white mb-4">
          Ready to Bring AI to Your Business?
        </h2>
        <p className="text-brand-muted text-lg mb-10">
          Let&apos;s talk about what AI can do for your organization. First
          consultation is always free.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" href="/contact">
            Start a Project
          </Button>
          <Button variant="secondary" href="/contact">
            Book Free Consultation
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
