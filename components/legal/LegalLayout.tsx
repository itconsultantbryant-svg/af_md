"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { COMPANY_LEGAL, COMPANY_EMAIL } from "@/lib/brand";

interface LegalLayoutProps {
  label: string;
  title: string;
  summary: string;
  updated: string;
  children: React.ReactNode;
}

export function LegalLayout({
  label,
  title,
  summary,
  updated,
  children,
}: LegalLayoutProps) {
  return (
    <main className="pt-24">
      <section className="relative overflow-hidden border-b border-white/5 bg-brand-darker">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-navy/30 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-muted hover:text-brand-gold text-sm transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to home
          </Link>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-[11px] tracking-[0.2em] text-brand-gold uppercase mb-3"
          >
            {label}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-3xl md:text-5xl font-bold text-white mb-4"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-muted leading-relaxed max-w-2xl"
          >
            {summary}
          </motion.p>
          <p className="font-mono text-xs text-brand-muted/70 mt-6">
            Last updated: {updated}
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-12">{children}</div>

        <div className="mt-16 glass-card p-6">
          <h3 className="font-display font-semibold text-white mb-2">
            Questions about this policy?
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed">
            Contact {COMPANY_LEGAL} at{" "}
            <a
              href={`mailto:${COMPANY_EMAIL}`}
              className="text-brand-gold hover:underline"
            >
              {COMPANY_EMAIL}
            </a>{" "}
            and we will respond as quickly as possible.
          </p>
        </div>
      </section>
    </main>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="font-display text-xl md:text-2xl font-semibold text-white mb-4">
        {heading}
      </h2>
      <div className="space-y-3 text-brand-muted text-sm md:text-base leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
}
