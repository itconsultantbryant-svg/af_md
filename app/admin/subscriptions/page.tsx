"use client";

import { useEffect, useState } from "react";

interface Sub {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
  user: { firstName: string; lastName: string } | null;
}

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<Sub[]>([]);

  useEffect(() => {
    fetch("/api/subscriptions").then((r) => r.json()).then((d) => setSubs(d.subscriptions));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">Newsletter Subscriptions</h1>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-brand-muted border-b border-white/10">
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Linked User</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => (
              <tr key={s.id} className="border-b border-white/5">
                <td className="py-3 px-4 text-white">{s.email}</td>
                <td className="py-3 px-4 text-brand-muted">
                  {s.user ? `${s.user.firstName} ${s.user.lastName}` : "—"}
                </td>
                <td className="py-3 px-4">
                  <span className={s.active ? "text-green-400" : "text-red-400"}>
                    {s.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="py-3 px-4 text-brand-muted text-xs">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
