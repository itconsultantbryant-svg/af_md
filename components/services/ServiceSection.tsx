"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
import { Badge } from "@/components/ui/Badge";
import { slideLeft, slideRight } from "@/lib/animations";

interface ServiceSectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  deliverables: string[];
  audiences: string[];
  pricing: string;
  index: number;
}

export function ServiceSection({
  icon: Icon,
  title,
  description,
  deliverables,
  audiences,
  pricing,
  index,
}: ServiceSectionProps) {
  const isEven = index % 2 === 0;
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section
      ref={ref}
      className={`py-20 px-4 sm:px-6 lg:px-8 ${index % 2 === 1 ? "bg-brand-darker" : ""}`}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={isEven ? slideLeft : slideRight}
          className={isEven ? "" : "md:order-2"}
        >
          <div className="relative aspect-square max-w-sm mx-auto rounded-2xl border border-brand-gold/20 overflow-hidden">
            <SiteImage
              alt={title}
              title={title}
              variant="service"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/40">
              <Icon className="w-20 h-20 text-brand-gold/80 drop-shadow-lg" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={isEven ? slideRight : slideLeft}
          className={isEven ? "" : "md:order-1"}
        >
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-brand-muted leading-relaxed mb-6">{description}</p>
          <ul className="space-y-2 mb-6">
            {deliverables.map((d) => (
              <li
                key={d}
                className="flex items-start gap-2 text-brand-muted text-sm"
              >
                <Check className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 mb-4">
            {audiences.map((a) => (
              <Badge key={a}>{a}</Badge>
            ))}
          </div>
          <p className="text-brand-gold font-mono text-sm mb-4">{pricing}</p>
          <Button variant="gold" href="/contact">
            Request This Service →
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
