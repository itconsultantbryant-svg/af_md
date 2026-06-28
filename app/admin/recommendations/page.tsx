"use client";

import { useEffect, useState } from "react";

interface Feedback {
  id: string;
  name: string | null;
  email: string | null;
  message: string;
  category: string;
  source: string;
  status: string;
  createdAt: string;
}

const statuses = ["NEW", "REVIEWED", "IMPLEMENTED", "DISMISSED"];

export default function AdminRecommendationsPage() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/feedback/admin")
      .then((r) => r.json())
      .then((d) => setItems(d.feedback || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/feedback/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  if (loading) {
    return <p className="text-brand-muted">Loading recommendations...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">
        Site Recommendations
      </h1>
      <p className="text-brand-muted text-sm mb-8">
        Feedback and improvement suggestions collected via the site chatbot assistant.
      </p>
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="glass-card p-8 text-center text-brand-muted">
            No feedback submitted yet.
          </div>
        ) : (
          items.map((f) => (
            <div key={f.id} className="glass-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-white font-medium">{f.name || "Anonymous"}</p>
                  {f.email && <p className="text-brand-muted text-xs">{f.email}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded bg-brand-gold/10 text-brand-gold">
                    {f.category}
                  </span>
                  <select
                    value={f.status}
                    onChange={(e) => updateStatus(f.id, e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s} className="bg-brand-dark">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-brand-muted text-sm leading-relaxed">{f.message}</p>
              <p className="text-brand-muted text-xs mt-3">
                {f.source} · {new Date(f.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
