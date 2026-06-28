"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Globe2, Shield, Award, Handshake } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/animations";

const features = [
  {
    num: "01",
    icon: Globe2,
    title: "Built for African Realities",
    description:
      "We engineer for low-bandwidth environments, mobile-first users, intermittent power, and the full spectrum of African infrastructure realities.",
  },
  {
    num: "02",
    icon: Shield,
    title: "Proven in Production",
    description:
      "Our AI systems are live, running, and delivering impact for real institutions — not prototypes, not demos.",
  },
  {
    num: "03",
    icon: Award,
    title: "World-Class Standards",
    description:
      "International quality, African pricing. We compete with global agencies on output while being 40–60% more cost-effective.",
  },
  {
    num: "04",
    icon: Handshake,
    title: "End-to-End Partnership",
    description:
      "From strategy and design through build, deployment, training, and ongoing support — we own the full journey with you.",
  },
];

export function WhyAfrimind() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 bg-brand-dark px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Why Choose AfriMind Tech&AI Consulting Agency" />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.num}
              variants={fadeUp}
              className="relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden"
            >
              <span className="absolute -top-4 -right-2 font-display text-8xl font-bold text-brand-gold/10 select-none">
                {feature.num}
              </span>
              <feature.icon className="w-10 h-10 text-brand-gold mb-4 relative z-10" />
              <h3 className="font-display text-xl font-semibold text-white mb-3 relative z-10">
                {feature.title}
              </h3>
              <p className="text-brand-muted text-sm leading-relaxed relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
