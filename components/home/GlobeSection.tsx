"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CanvasSkeleton } from "@/components/ui/Skeleton";
import { fadeUp } from "@/lib/animations";

const Globe = dynamic(() => import("@/components/three/Globe"), { ssr: false });

export function GlobeSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 bg-brand-darker px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <SectionHeader title="Our Global Reach" />

        <div ref={ref} className="grid lg:grid-cols-[1fr_320px] gap-12 items-center">
          <Suspense fallback={<CanvasSkeleton />}>
            <Globe />
          </Suspense>

          <motion.p
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeUp}
            className="text-brand-muted leading-relaxed text-lg"
          >
            Headquartered in Monrovia, Liberia. Serving clients across West
            Africa, the continent, and globally through remote delivery and
            strategic partnerships.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
