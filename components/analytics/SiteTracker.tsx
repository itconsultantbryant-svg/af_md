"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "afrimind_vid";
const SESSION_KEY = "afrimind_sid";

function getVisitorKey(): string {
  if (typeof window === "undefined") return "";
  let key = localStorage.getItem(VISITOR_KEY);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, key);
  }
  return key;
}

async function track(
  type: string,
  extra: {
    path?: string;
    label?: string;
    metadata?: Record<string, unknown>;
    durationSec?: number;
    sessionId?: string;
  } = {}
) {
  const visitorKey = getVisitorKey();
  if (!visitorKey) return null;

  const sessionId =
    extra.sessionId ?? sessionStorage.getItem(SESSION_KEY) ?? undefined;

  try {
    const res = await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorKey,
        sessionId,
        type,
        path: extra.path ?? window.location.pathname,
        label: extra.label,
        metadata: extra.metadata,
        durationSec: extra.durationSec,
      }),
      keepalive: type === "session_end",
    });
    const data = await res.json();
    if (data.sessionId) {
      sessionStorage.setItem(SESSION_KEY, data.sessionId);
    }
    return data;
  } catch {
    return null;
  }
}

/** Fire-and-forget analytics event from anywhere on the site. */
export function trackSiteEvent(
  type: string,
  label?: string,
  metadata?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  track(type, { label, metadata, path: window.location.pathname });
}

export function SiteTracker() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const started = useRef(false);

  const sendHeartbeat = useCallback(() => {
    track("session_heartbeat", { durationSec: 30 });
  }, []);

  const endSession = useCallback(() => {
    track("session_end", { path: window.location.pathname, durationSec: 5 });
  }, []);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    track("session_start", { path: window.location.pathname || "/" }).then((data) => {
      if (data?.sessionId) {
        sessionStorage.setItem(SESSION_KEY, data.sessionId);
      }
      const labels: Record<string, string> = {
        "/": "Home",
        "/about": "About",
        "/services": "Services",
        "/portfolio": "Portfolio",
        "/training": "Training",
        "/contact": "Contact",
        "/blog": "Blog",
      };
      const path = window.location.pathname;
      track("page_view", { path, label: labels[path] || path });
    });

    heartbeatRef.current = setInterval(sendHeartbeat, 30000);

    const onHide = () => {
      if (document.visibilityState === "hidden") endSession();
    };
    window.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", endSession);

    return () => {
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);
      window.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", endSession);
      endSession();
    };
  }, [sendHeartbeat, endSession]);

  useEffect(() => {
    if (!pathname || pathname === lastPath.current) return;
    lastPath.current = pathname;

    const labels: Record<string, string> = {
      "/": "Home",
      "/about": "About",
      "/services": "Services",
      "/portfolio": "Portfolio",
      "/training": "Training",
      "/contact": "Contact",
      "/blog": "Blog",
    };

    track("page_view", {
      path: pathname,
      label: labels[pathname] || pathname,
    });
  }, [pathname]);

  return null;
}
