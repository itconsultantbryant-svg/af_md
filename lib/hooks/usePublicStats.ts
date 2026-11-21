"use client";

import { useEffect, useState } from "react";
import { defaultSiteStats } from "@/lib/data/site-stats";

export interface PublicHighlight {
  id: string;
  key: string;
  label: string;
  value: number;
  prefix: string;
  suffix: string;
}

export interface PublicStats {
  courses: number;
  learners: number;
  clients: number;
  countries: number;
  enrollments: number;
  visitors: number;
  sessions: number;
  subscriptions: number;
  industries: number;
  highlights: PublicHighlight[];
}

const FALLBACK_HIGHLIGHTS: PublicHighlight[] = defaultSiteStats.map((stat) => ({
  ...stat,
  id: `fallback-${stat.key}`,
}));

const EMPTY: PublicStats = {
  courses: 0,
  learners: 0,
  clients: 0,
  countries: 0,
  enrollments: 0,
  visitors: 0,
  sessions: 0,
  subscriptions: 0,
  industries: 0,
  highlights: FALLBACK_HIGHLIGHTS,
};

export function usePublicStats(): PublicStats {
  const [stats, setStats] = useState<PublicStats>(EMPTY);

  useEffect(() => {
    let active = true;
    fetch("/api/stats", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data?.stats) return;
        const highlights = Array.isArray(data.stats.highlights)
          ? data.stats.highlights
          : FALLBACK_HIGHLIGHTS;
        setStats({ ...EMPTY, ...data.stats, highlights });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return stats;
}
