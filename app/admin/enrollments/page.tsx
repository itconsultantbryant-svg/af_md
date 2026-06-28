"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

interface Enrollment {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  paymentReference: string | null;
  organization: string | null;
  motivation: string | null;
  seatDeducted: boolean;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string; phone: string | null };
  course: { title: string; price: string; seatsAvailable: number };
}

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filter, setFilter] = useState("all");

  const load = () =>
    fetch("/api/enrollments")
      .then((r) => r.json())
      .then((d) => setEnrollments(d.enrollments));

  useEffect(() => {
    load();
  }, []);

  const update = async (id: string, data: Record<string, string>) => {
    await fetch(`/api/enrollments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    load();
  };

  const filtered = enrollments.filter((e) => {
    if (filter === "pending") return e.status === "PENDING" || e.paymentStatus === "PENDING";
    if (filter === "approved") return e.status === "APPROVED" && e.paymentStatus === "APPROVED";
    return true;
  });

  const statusColor = (s: string) =>
    s === "APPROVED" ? "text-green-400" : s === "REJECTED" ? "text-red-400" : "text-amber-400";

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Enrollments</h1>
      <p className="text-brand-muted text-sm mb-6">
        Approve registration and payment separately. Seats deduct when both are approved.
      </p>

      <div className="flex gap-2 mb-6">
        {["all", "pending", "approved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm capitalize ${
              filter === f ? "bg-brand-gold text-brand-dark" : "bg-white/5 text-brand-muted"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((e) => (
          <div key={e.id} className="glass-card p-5">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  {e.user.firstName} {e.user.lastName}
                </h3>
                <p className="text-brand-muted text-sm">{e.user.email} · {e.user.phone || "No phone"}</p>
                <p className="text-brand-gold text-sm mt-1">{e.course.title} — {e.course.price}</p>
                {e.organization && <p className="text-brand-muted text-xs mt-1">Org: {e.organization}</p>}
                {e.motivation && <p className="text-brand-muted text-xs mt-2 italic line-clamp-2">&ldquo;{e.motivation}&rdquo;</p>}
                <div className="flex flex-wrap gap-3 mt-3 text-xs">
                  <span>Enrollment: <span className={statusColor(e.status)}>{e.status}</span></span>
                  <span>Payment: <span className={statusColor(e.paymentStatus)}>{e.paymentStatus}</span></span>
                  {e.paymentMethod && <span>Via: {e.paymentMethod.replace(/_/g, " ")}</span>}
                  {e.paymentReference && <span>Ref: {e.paymentReference}</span>}
                  {e.seatDeducted && <span className="text-green-400">Seat deducted</span>}
                  <span className="text-brand-muted">{new Date(e.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[200px]">
                {e.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button onClick={() => update(e.id, { status: "APPROVED" })} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600/20 text-green-400 rounded text-xs">
                      <Check size={14} /> Approve Reg
                    </button>
                    <button onClick={() => update(e.id, { status: "REJECTED" })} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600/20 text-red-400 rounded text-xs">
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
                {e.paymentStatus === "PENDING" && (
                  <div className="flex gap-2">
                    <button onClick={() => update(e.id, { paymentStatus: "APPROVED" })} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-green-600/20 text-green-400 rounded text-xs">
                      <Check size={14} /> Approve Pay
                    </button>
                    <button onClick={() => update(e.id, { paymentStatus: "REJECTED" })} className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-600/20 text-red-400 rounded text-xs">
                      <X size={14} /> Reject Pay
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-brand-muted text-center py-12">No enrollments found.</p>
        )}
      </div>
    </div>
  );
}
