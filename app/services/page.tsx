"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ServiceSection } from "@/components/services/ServiceSection";
import { fadeUp, staggerContainer } from "@/lib/animations";
import {
  serviceDetails,
  processSteps,
  pricingTiers,
} from "@/lib/data/services";

export default function ServicesPage() {
  const processRef = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <main>
      <section className="min-h-[40vh] flex items-center justify-center px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
            Intelligent Solutions,
            <br />
            <span className="gold-gradient-text">African Expertise</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            End-to-end AI services designed for African organizations and
            delivered to world-class standards.
          </p>
        </motion.div>
      </section>

      {serviceDetails.map((service, i) => (
        <ServiceSection key={service.title} {...service} index={i} />
      ))}

      <section className="py-24 bg-brand-dark px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Our Process"
            subtitle="From discovery to ongoing partnership"
          />
          <div ref={processRef.ref} className="relative">
            <div className="hidden md:block absolute top-8 left-0 right-0 h-px border-t border-dashed border-brand-gold/30" />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={processRef.inView ? "visible" : "hidden"}
              className="grid grid-cols-2 md:grid-cols-6 gap-6"
            >
              {processSteps.map((step) => (
                <motion.div
                  key={step.num}
                  variants={fadeUp}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-brand-gold bg-brand-darker flex items-center justify-center mx-auto mb-3 font-display font-bold text-brand-gold">
                    {step.num}
                  </div>
                  <h3 className="font-display font-semibold text-white text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-brand-muted text-xs">{step.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Pricing"
            subtitle="Transparent investment tiers for every stage"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`glass-card p-8 relative ${
                  tier.popular
                    ? "border-brand-gold/60 ring-1 ring-brand-gold/30"
                    : ""
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-dark text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="font-display text-2xl font-bold text-white mb-1">
                  {tier.name}
                </h3>
                <p className="text-brand-muted text-sm mb-4">
                  {tier.description}
                </p>
                <p className="font-display text-4xl font-bold text-brand-gold mb-1">
                  {tier.price}
                </p>
                <p className="text-brand-muted text-xs mb-6">{tier.period}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-sm text-brand-muted"
                    >
                      <Check className="w-4 h-4 text-brand-gold mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={tier.popular ? "primary" : "gold"}
                  href="/contact"
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
