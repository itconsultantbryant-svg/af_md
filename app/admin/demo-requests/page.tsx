"use client";

import { useEffect, useState } from "react";

interface DemoReq {
  id: string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  systemTitle: string | null;
  customDescription: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
}

const statuses = ["PENDING", "CONTACTED", "DEMO_SENT", "CLOSED"];

export default function AdminDemoRequestsPage() {
  const [requests, setRequests] = useState<DemoReq[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/demo-requests/admin")
      .then((r) => r.json())
      .then((d) => setRequests(d.requests || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/demo-requests/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  if (loading) {
    return <p className="text-brand-muted">Loading demo requests...</p>;
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Demo Requests</h1>
      <p className="text-brand-muted text-sm mb-8">
        Client requests for software demo access from the portfolio page.
      </p>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-brand-muted border-b border-white/10">
              <th className="text-left py-3 px-4">Client</th>
              <th className="text-left py-3 px-4">System</th>
              <th className="text-left py-3 px-4">Contact</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-brand-muted">
                  No demo requests yet.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-b border-white/5 align-top">
                  <td className="py-3 px-4">
                    <p className="text-white font-medium">{r.fullName}</p>
                    <p className="text-brand-muted text-xs">{r.company}</p>
                  </td>
                  <td className="py-3 px-4 text-brand-muted">
                    <p>{r.systemTitle || "—"}</p>
                    {r.customDescription && (
                      <p className="text-xs mt-1 line-clamp-2">{r.customDescription}</p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-brand-muted text-xs">
                    <p>{r.email}</p>
                    <p>{r.phone}</p>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s} className="bg-brand-dark">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-brand-muted text-xs whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleString()}
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
