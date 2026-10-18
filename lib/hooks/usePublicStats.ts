"use client";

import { useEffect, useState } from "react";

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
}

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
};

export function usePublicStats(): PublicStats {
  const [stats, setStats] = useState<PublicStats>(EMPTY);

  useEffect(() => {
    let active = true;
    fetch("/api/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.stats) setStats({ ...EMPTY, ...data.stats });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return stats;
}
