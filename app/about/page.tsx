"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import { Plus, CheckCircle2 } from "lucide-react";
import { LinkedInIcon } from "@/components/ui/SocialIcons";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { SiteImage } from "@/components/ui/SiteImage";
import { Button } from "@/components/ui/Button";
import { fadeUp, staggerContainer, slideLeft, slideRight } from "@/lib/animations";
import { teamMembers, partners, milestones } from "@/lib/data/team";
import {
  coreValues,
  capabilities,
  stats,
  approach,
  certifications,
} from "@/lib/data/about";
import { COMPANY_NAME } from "@/lib/brand";

const FloatingShapes = dynamic(
  () =>
    import("@/components/three/FloatingShapes").then((m) => m.FloatingShapes),
  { ssr: false }
);

export default function AboutPage() {
  const storyRef = useInView({ triggerOnce: true, threshold: 0.15 });
  const timelineRef = useInView({ triggerOnce: true, threshold: 0.1 });
  const statsRef = useInView({ triggerOnce: true, threshold: 0.2 });
  const approachRef = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <main>
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <Suspense fallback={null}>
          <FloatingShapes />
        </Suspense>
        <div className="relative z-10 text-center px-4 pt-24 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-sm tracking-[0.2em] text-brand-gold uppercase mb-4"
          >
            Africa&apos;s AI Agency
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl md:text-6xl font-bold text-white mb-6"
          >
            We Are {COMPANY_NAME}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-brand-muted text-lg leading-relaxed"
          >
            Founded in Monrovia, Liberia, we build AI systems, enterprise software, and
            training programs designed for African infrastructure — and trusted by clients
            worldwide.
          </motion.p>
        </div>
      </section>

      <section ref={statsRef.ref} className="py-16 bg-brand-darker border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={statsRef.inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-5 gap-8"
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="text-center">
                <p className="font-display text-3xl md:text-4xl font-bold text-brand-gold">
                  {stat.value}
                </p>
                <p className="text-brand-muted text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Mission",
              content:
                "To make world-class AI accessible to every African business, government, and organization — without compromising on quality, security, or local context.",
            },
            {
              title: "Vision",
              content:
                "A continent where AI is not imported, but built here — for here. Where African engineers lead global innovation from Monrovia to Nairobi.",
            },
            {
              title: "Values",
              content:
                "Innovation · Integrity · Impact · African Excellence — the principles that guide every line of code we write and every client we serve.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card hover className="text-center h-full">
                <h3 className="font-display text-2xl font-bold text-brand-gold mb-4">
                  {item.title}
                </h3>
                <p className="text-brand-muted leading-relaxed">{item.content}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-darker">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Our Core Values" subtitle="What drives us every day" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card hover className="h-full">
                  <v.icon className="w-8 h-8 text-brand-gold mb-4" />
                  <h3 className="font-display text-lg font-semibold text-white mb-2">
                    {v.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{v.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-darker px-4 sm:px-6 lg:px-8">
        <div
          ref={storyRef.ref}
          className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center"
        >
          <motion.div
            initial="hidden"
            animate={storyRef.inView ? "visible" : "hidden"}
            variants={slideLeft}
            className="space-y-4 text-brand-muted leading-relaxed"
          >
            <h2 className="font-display text-3xl font-bold text-white mb-6">
              Our Story
            </h2>
            <p>
              AfriMind Tech&AI Consulting Agency was founded in Monrovia, Liberia, born from a simple
              observation: African organizations were being sold AI solutions
              designed for Silicon Valley, not for Monrovia, Lagos, or Nairobi.
            </p>
            <p>
              Our founders saw firsthand how global AI agencies charged premium
              prices while delivering solutions that failed in low-bandwidth
              environments, ignored local languages, and required infrastructure
              that simply didn&apos;t exist across much of the continent.
            </p>
            <p>
              We set out to build something different — an AI agency rooted in
              African context, staffed by engineers who understand the realities
              of operating across the continent, and committed to delivering
              world-class output at accessible pricing.
            </p>
            <p>
              Today, AfriMind Tech&AI Consulting Agency serves clients across West Africa and beyond,
              from government health institutions to regional banks, NGOs, and
              growing startups — proving every day that AI built for Africa can
              compete on the global stage.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={storyRef.inView ? "visible" : "hidden"}
            variants={slideRight}
            className="flex items-center justify-center"
          >
            <svg viewBox="0 0 300 300" className="w-full max-w-md opacity-60">
              <path
                d="M150 30 C120 30 90 60 80 100 C70 140 75 180 90 210 C105 240 130 260 150 270 C170 260 195 240 210 210 C225 180 230 140 220 100 C210 60 180 30 150 30Z"
                fill="none"
                stroke="#D4A017"
                strokeWidth="1.5"
              />
              {[...Array(8)].map((_, i) => (
                <line
                  key={i}
                  x1={100 + i * 15}
                  y1={80 + (i % 3) * 40}
                  x2={200 - i * 10}
                  y2={120 + (i % 2) * 50}
                  stroke="#D4A017"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              ))}
              <circle cx="150" cy="150" r="4" fill="#D4A017" />
              <circle cx="130" cy="120" r="2" fill="#4A90D9" />
              <circle cx="170" cy="180" r="2" fill="#4A90D9" />
              <circle cx="145" cy="200" r="2" fill="#4A90D9" />
            </svg>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Who We Serve" subtitle="Capabilities across sectors and regions" />
          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card hover className="h-full">
                  <cap.icon className="w-10 h-10 text-brand-gold mb-4" />
                  <h3 className="font-display text-xl font-semibold text-white mb-3">
                    {cap.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{cap.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section ref={approachRef.ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-darker">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Our Approach" subtitle="How we deliver results that last" />
          <motion.div
            initial="hidden"
            animate={approachRef.inView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {approach.map((step) => (
              <motion.div key={step.step} variants={fadeUp}>
                <Card hover className="h-full">
                  <span className="font-mono text-brand-gold text-sm">{step.step}</span>
                  <h3 className="font-display text-xl font-semibold text-white mt-2 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-brand-muted text-sm leading-relaxed">{step.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Our Team" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name} hover className="text-center overflow-hidden">
                <div className="relative w-24 h-24 rounded-full border-2 border-brand-gold/30 overflow-hidden mx-auto mb-4">
                  <SiteImage
                    alt={member.name}
                    title={member.initials}
                    variant="team"
                    subtitle={member.role}
                    fill
                    className="rounded-full"
                    sizes="96px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/50 text-brand-gold text-xl font-bold">
                    {member.initials}
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold text-white">
                  {member.name}
                </h3>
                <p className="text-brand-muted text-sm mb-3">{member.role}</p>
                <a
                  href={member.linkedin}
                  className="text-brand-gold hover:text-brand-gold-light cursor-hover inline-flex"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon size={18} />
                </a>
              </Card>
            ))}
            <Link href="/contact">
              <Card
                hover
                className="text-center h-full flex flex-col items-center justify-center min-h-[200px] border-dashed"
              >
                <Plus className="w-10 h-10 text-brand-gold mb-3" />
                <h3 className="font-display text-lg font-semibold text-brand-gold">
                  Join Our Team
                </h3>
                <p className="text-brand-muted text-sm mt-2">
                  We&apos;re always looking for talent
                </p>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-darker overflow-hidden">
        <div className="flex animate-scroll">
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={`${partner}-${i}`}
              className="flex-shrink-0 mx-8 text-brand-muted hover:text-brand-gold transition-colors text-lg font-display font-semibold grayscale hover:grayscale-0 cursor-hover"
            >
              {partner}
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Our Journey" />
          <div ref={timelineRef.ref} className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-brand-gold/30" />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={timelineRef.inView ? "visible" : "hidden"}
              className="space-y-8"
            >
              {milestones.map((milestone) => (
                <motion.div
                  key={milestone.title}
                  variants={fadeUp}
                  className="relative pl-12"
                >
                  <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full bg-brand-gold border-2 border-brand-dark" />
                  <p className="font-mono text-brand-gold text-sm mb-1">
                    {milestone.year}
                  </p>
                  <p className="text-white font-medium">{milestone.title}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-darker">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="Standards & Compliance" />
          <div className="grid sm:grid-cols-2 gap-4">
            {certifications.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5"
              >
                <CheckCircle2 className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                <span className="text-brand-muted text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-brand-muted mb-8">
            Whether you need a custom AI system, enterprise software, or team training —
            we&apos;re here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" href="/contact">
              Start a Project
            </Button>
            <Button variant="secondary" href="/portfolio">
              Request a Demo
            </Button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
