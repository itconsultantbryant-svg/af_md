"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteImage } from "@/components/ui/SiteImage";

interface ScreenshotCarouselProps {
  title: string;
  subtitle?: string;
  count?: number;
}

export function ScreenshotCarousel({
  title,
  subtitle,
  count = 3,
}: ScreenshotCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? count - 1 : c - 1));
  const next = () => setCurrent((c) => (c === count - 1 ? 0 : c + 1));

  const slideTitle = `${title} — View ${current + 1}`;

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-video border border-white/10"
          >
            <SiteImage
              alt={slideTitle}
              title={slideTitle}
              variant="portfolio"
              subtitle={subtitle || `Screenshot ${current + 1} of ${count}`}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center items-center gap-3 mt-3">
        <button
          onClick={prev}
          className="p-2 rounded-lg border border-white/10 text-brand-muted hover:text-brand-gold hover:border-brand-gold/30 transition-colors cursor-hover"
          aria-label="Previous screenshot"
        >
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-1.5">
          {[...Array(count)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-colors cursor-hover ${
                i === current ? "bg-brand-gold" : "bg-white/20"
              }`}
              aria-label={`Go to screenshot ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="p-2 rounded-lg border border-white/10 text-brand-muted hover:text-brand-gold hover:border-brand-gold/30 transition-colors cursor-hover"
          aria-label="Next screenshot"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
