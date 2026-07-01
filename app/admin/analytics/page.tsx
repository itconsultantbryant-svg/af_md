"use client";

import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  RefreshCw,
  Clock,
  Eye,
  MessageCircle,
  Activity,
} from "lucide-react";

interface Overview {
  totalVisitors: number;
  firstTimeVisitors: number;
  returningVisitors: number;
  visitorsToday: number;
  totalSessions: number;
  sessionsThisWeek: number;
  avgSessionSeconds: number;
  chatOpens: number;
}

interface AnalyticsData {
  overview: Overview;
  topPages: { path: string; views: number }[];
  recentEvents: Array<{
    id: string;
    type: string;
    path: string | null;
    label: string | null;
    createdAt: string;
    visitor: { visitorKey: string; isReturning: boolean; visitCount: number };
  }>;
  visitors: Array<{
    id: string;
    visitorKey: string;
    isReturning: boolean;
    visitCount: number;
    totalSeconds: number;
    firstSeenAt: string;
    lastSeenAt: string;
    userAgent: string | null;
    events: Array<{ type: string; label: string | null; path: string | null; createdAt: string }>;
    sessions: Array<{
      entryPath: string;
      exitPath: string | null;
      durationSec: number;
      pageViews: number;
      startedAt: string;
    }>;
  }>;
}

function formatDuration(sec: number) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return `${m}m ${s}s`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

function eventLabel(type: string, label: string | null) {
  if (label) return label;
  const map: Record<string, string> = {
    session_start: "Started visit",
    session_end: "Left site",
    session_heartbeat: "Active on site",
    page_view: "Viewed page",
    chat_open: "Opened chat",
    chat_greet_shown: "Saw chat greeting",
    chat_message: "Sent chat message",
    chat_feedback: "Submitted feedback",
  };
  return map[type] || type;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/analytics/admin")
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && !data) {
    return <p className="text-brand-muted">Loading analytics...</p>;
  }

  const o = data?.overview;

  const cards = [
    { label: "Total Visitors", value: o?.totalVisitors, icon: Users, color: "text-brand-gold" },
    { label: "First-Time", value: o?.firstTimeVisitors, icon: UserPlus, color: "text-emerald-400" },
    { label: "Returning", value: o?.returningVisitors, icon: RefreshCw, color: "text-blue-400" },
    { label: "Visitors Today", value: o?.visitorsToday, icon: Eye, color: "text-amber-400" },
    { label: "Total Sessions", value: o?.totalSessions, icon: Activity, color: "text-purple-400" },
    { label: "Sessions (7 days)", value: o?.sessionsThisWeek, icon: Activity, color: "text-pink-400" },
    {
      label: "Avg. Time on Site",
      value: o ? formatDuration(o.avgSessionSeconds) : "—",
      icon: Clock,
      color: "text-cyan-400",
      raw: true,
    },
    { label: "Chat Opens", value: o?.chatOpens, icon: MessageCircle, color: "text-orange-400" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Site Analytics</h1>
          <p className="text-brand-muted text-sm">
            Visitor tracking, session duration, page views, and user activity.
          </p>
        </div>
        <button
          onClick={load}
          className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm hover:border-brand-gold/40"
        >
          Refresh
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <div key={card.label} className="glass-card p-5">
            <card.icon className={`w-7 h-7 ${card.color} mb-2`} />
            <p className="font-display text-2xl font-bold text-white">
              {card.raw ? card.value : card.value ?? "—"}
            </p>
            <p className="text-brand-muted text-xs mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-10">
        <div className="glass-card p-6">
          <h2 className="font-display text-lg font-semibold text-white mb-4">Top Pages</h2>
          {data?.topPages.length === 0 ? (
            <p className="text-brand-muted text-sm">No page views recorded yet.</p>
          ) : (
            <ul className="space-y-2">
              {data?.topPages.map((p) => (
                <li
                  key={p.path}
                  className="flex justify-between items-center text-sm border-b border-white/5 pb-2"
                >
                  <span className="text-white truncate mr-4">{p.path}</span>
                  <span className="text-brand-gold shrink-0">{p.views} views</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-card p-6 max-h-80 overflow-y-auto">
          <h2 className="font-display text-lg font-semibold text-white mb-4">Live Activity Feed</h2>
          {data?.recentEvents.length === 0 ? (
            <p className="text-brand-muted text-sm">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {data?.recentEvents.map((e) => (
                <li key={e.id} className="text-xs border-b border-white/5 pb-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-brand-gold">{eventLabel(e.type, e.label)}</span>
                    <span className="text-brand-muted shrink-0">{formatDate(e.createdAt)}</span>
                  </div>
                  <p className="text-brand-muted mt-0.5">
                    {e.path && <span>{e.path} · </span>}
                    <span>{e.visitor.isReturning ? "Returning" : "First-time"} visitor</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="glass-card overflow-x-auto">
        <h2 className="font-display text-lg font-semibold text-white p-6 pb-0">
          Visitor Details
        </h2>
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="text-brand-muted border-b border-white/10">
              <th className="text-left py-3 px-4">Visitor</th>
              <th className="text-left py-3 px-4">Type</th>
              <th className="text-left py-3 px-4">Visits</th>
              <th className="text-left py-3 px-4">Time on Site</th>
              <th className="text-left py-3 px-4">First Seen</th>
              <th className="text-left py-3 px-4">Last Seen</th>
              <th className="text-left py-3 px-4">Recent Activity</th>
            </tr>
          </thead>
          <tbody>
            {!data?.visitors.length ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-brand-muted">
                  No visitors tracked yet. Analytics appear once users browse the public site.
                </td>
              </tr>
            ) : (
              data.visitors.map((v) => (
                <tr key={v.id} className="border-b border-white/5 align-top">
                  <td className="py-3 px-4 text-white font-mono text-xs">
                    {v.visitorKey.slice(0, 8)}…
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={
                        v.isReturning ? "text-blue-400" : "text-emerald-400"
                      }
                    >
                      {v.isReturning ? "Returning" : "First-time"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-brand-muted">{v.visitCount}</td>
                  <td className="py-3 px-4 text-brand-muted">
                    {formatDuration(v.totalSeconds)}
                  </td>
                  <td className="py-3 px-4 text-brand-muted text-xs">
                    {formatDate(v.firstSeenAt)}
                  </td>
                  <td className="py-3 px-4 text-brand-muted text-xs">
                    {formatDate(v.lastSeenAt)}
                  </td>
                  <td className="py-3 px-4 text-brand-muted text-xs max-w-xs">
                    <ul className="space-y-1">
                      {v.events.slice(0, 4).map((e, i) => (
                        <li key={i}>
                          {eventLabel(e.type, e.label)}
                          {e.path ? ` · ${e.path}` : ""}
                        </li>
                      ))}
                    </ul>
                    {v.sessions[0] && (
                      <p className="mt-2 text-brand-gold/80">
                        Last session: {v.sessions[0].pageViews} pages ·{" "}
                        {formatDuration(v.sessions[0].durationSec)}
                      </p>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
