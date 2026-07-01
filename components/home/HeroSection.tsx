"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { CanvasSkeleton } from "@/components/ui/Skeleton";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { COMPANY_NAME } from "@/lib/brand";

const ParticleField = dynamic(
  () =>
    import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);

const stats = [
  { value: 50, suffix: "+", label: "Projects Delivered" },
  { value: 15, suffix: "+", label: "Industries Served" },
  { value: 6, suffix: "", label: "Countries Active" },
  { value: 30, suffix: "+", label: "AI Models Deployed" },
  { value: 54, suffix: "", label: "Training Courses" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      <Suspense fallback={<CanvasSkeleton className="absolute inset-0" />}>
        <ParticleField />
      </Suspense>

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-brand-gold/5 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-brand-navy/40 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8 text-center">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-gold/30 bg-brand-gold/5 mb-6"
          >
            <Sparkles size={14} className="text-brand-gold" />
            <span className="font-mono text-[11px] tracking-[0.15em] text-brand-gold uppercase">
              Monrovia, Liberia · Serving Africa &amp; The World
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl md:text-[88px] font-bold text-white leading-[1.05]"
          >
            AI Built for Africa.
          </motion.h1>
          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl md:text-[88px] font-bold gold-gradient-text leading-[1.05] mb-6"
          >
            Trusted Worldwide.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-body text-lg md:text-xl text-brand-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {COMPANY_NAME} designs, builds, and deploys custom AI solutions for
            businesses, governments, and organizations — engineered for African
            realities, delivered to world-class standards.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            <Button variant="primary" href="/contact" className="group">
              Start Your Project
              <ArrowRight size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="secondary" href="/portfolio">
              View Our Work
            </Button>
            <Button variant="secondary" href="/training">
              Explore Training
            </Button>
          </motion.div>

          <motion.p variants={fadeUp} className="text-brand-muted text-sm mb-12">
            Free consultation · Demo access available · 24/7 support
          </motion.p>

          <motion.div variants={fadeUp} className="animate-float">
            <ChevronDown className="w-6 h-6 text-brand-gold mx-auto" />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="relative z-10 bg-brand-darker/90 backdrop-blur-sm border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.08 }}
              className="text-center group"
            >
              <p className="font-display text-3xl md:text-4xl font-bold text-brand-gold group-hover:scale-105 transition-transform">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-brand-muted text-xs md:text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
