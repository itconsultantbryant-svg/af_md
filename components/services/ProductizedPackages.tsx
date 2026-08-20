"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  packagesIntro,
  packagesClosingLine,
  productizedPackages,
} from "@/lib/data/packages";

export function ProductizedPackages() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="packages" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-darker">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          label="Ready-Made AI"
          title="Productized AI Packages"
          subtitle="Pre-scoped solutions with a fixed price and a fixed timeline — built for the way African organizations actually operate."
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-brand-muted text-lg leading-relaxed max-w-3xl mx-auto text-center mb-16"
        >
          {packagesIntro}
        </motion.p>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-3 gap-6"
        >
          {productizedPackages.map((pkg) => (
            <motion.div
              key={pkg.headline}
              variants={fadeUp}
              className="glass-card p-8 flex flex-col"
            >
              <pkg.icon className="w-10 h-10 text-brand-gold mb-5" />

              <h3 className="font-display text-2xl font-bold text-white mb-3">
                {pkg.headline}
              </h3>

              <p className="text-white/90 text-sm leading-relaxed mb-4">
                {pkg.outcome}
              </p>

              <p className="text-brand-muted text-sm leading-relaxed mb-6">
                {pkg.description}
              </p>

              <div className="mb-6">
                <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-brand-gold/80 mb-2">
                  Best for
                </p>
                <div className="flex flex-wrap gap-2">
                  {pkg.bestFor.map((audience) => (
                    <Badge key={audience}>{audience}</Badge>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-white/10">
                <p className="font-mono text-sm text-brand-gold mb-1">
                  {pkg.price}
                </p>
                <p className="text-brand-muted text-xs mb-5">{pkg.timeline}</p>
                <Button variant="gold" href="/contact" className="w-full">
                  {pkg.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-14 text-center font-display text-xl md:text-2xl text-brand-gold">
          {packagesClosingLine}
        </p>
      </div>
    </section>
  );
}
