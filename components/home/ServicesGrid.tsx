"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Bot,
  Compass,
  HeartPulse,
  BarChart3,
  GraduationCap,
  Cloud,
} from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { scaleIn, staggerContainer } from "@/lib/animations";

const services = [
  {
    icon: Bot,
    title: "AI Development & Integration",
    description:
      "Custom AI-powered applications, chatbots, and automation systems built for your exact business needs.",
  },
  {
    icon: Compass,
    title: "AI Strategy Consulting",
    description:
      "Roadmaps, readiness assessments, and vendor selection to guide your AI adoption journey.",
  },
  {
    icon: HeartPulse,
    title: "Healthcare & Gov AI",
    description:
      "Specialized AI systems for health institutions, government agencies, and public sector organizations.",
  },
  {
    icon: BarChart3,
    title: "Data Analytics & Insights",
    description:
      "AI-powered dashboards and intelligence systems that turn your raw data into actionable decisions.",
  },
  {
    icon: GraduationCap,
    title: "AI Training & Workshops",
    description:
      "Corporate and institutional AI literacy programs, from executive briefings to technical bootcamps.",
  },
  {
    icon: Cloud,
    title: "SaaS AI Products",
    description:
      "Purpose-built AI software products designed for African market verticals, sold on subscription.",
  },
];

export function ServicesGrid() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader label="What We Do" title="Our AI Services" />

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={scaleIn}>
              <Card hover className="h-full">
                <service.icon className="w-8 h-8 text-brand-gold mb-4" />
                <h3 className="font-display text-xl font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-brand-muted text-sm leading-relaxed">
                  {service.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
