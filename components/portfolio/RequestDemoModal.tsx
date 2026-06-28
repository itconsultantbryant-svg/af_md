"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, PlayCircle } from "lucide-react";
import { DEMO_SYSTEMS } from "@/lib/knowledge-base";

interface RequestDemoModalProps {
  open: boolean;
  onClose: () => void;
  preselectedSystemId?: string;
  preselectedTitle?: string;
}

export function RequestDemoModal({
  open,
  onClose,
  preselectedSystemId,
  preselectedTitle,
}: RequestDemoModalProps) {
  const [form, setForm] = useState({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    systemId: preselectedSystemId || "",
    customDescription: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm((f) => ({
        ...f,
        systemId: preselectedSystemId || f.systemId,
      }));
    }
  }, [open, preselectedSystemId]);

  const ic =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-gold/50 transition-colors";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const system = DEMO_SYSTEMS.find((s) => s.id === form.systemId);
    try {
      const res = await fetch("/api/demo-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          systemTitle: system?.title || preselectedTitle,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setError("");
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="bg-brand-darker border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-brand-gold/5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-white/5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-brand-gold mb-1">
                  <PlayCircle size={20} />
                  <span className="text-xs font-mono uppercase tracking-wider">Request Demo</span>
                </div>
                <h2 className="font-display text-xl font-bold text-white">
                  Get a Demo Version
                </h2>
                <p className="text-brand-muted text-sm mt-1">
                  We&apos;ll send you access to the software you need.
                </p>
              </div>
              <button onClick={close} className="text-brand-muted hover:text-white p-1">
                <X size={22} />
              </button>
            </div>

            {success ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <Send className="text-green-400" size={28} />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">Request Received!</h3>
                <p className="text-brand-muted text-sm">
                  Our team will contact you shortly with demo access details.
                </p>
                <button
                  onClick={close}
                  className="mt-6 px-6 py-2.5 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="p-6 space-y-4">
                {error && (
                  <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    {error}
                  </p>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-brand-muted mb-1 block">Full Name *</label>
                    <input
                      required
                      className={ic}
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-brand-muted mb-1 block">Company / Institution *</label>
                    <input
                      required
                      className={ic}
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-brand-muted mb-1 block">Email *</label>
                    <input
                      required
                      type="email"
                      className={ic}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-brand-muted mb-1 block">Phone *</label>
                    <input
                      required
                      type="tel"
                      className={ic}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">Select System *</label>
                  <select
                    required
                    className={ic}
                    value={form.systemId || preselectedSystemId || ""}
                    onChange={(e) => setForm({ ...form, systemId: e.target.value })}
                  >
                    <option value="" disabled>
                      Choose a system...
                    </option>
                    {DEMO_SYSTEMS.map((s) => (
                      <option key={s.id} value={s.id} className="bg-brand-dark">
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
                {(form.systemId === "custom" || preselectedSystemId === "custom") && (
                  <div>
                    <label className="text-xs text-brand-muted mb-1 block">
                      Describe the software you need us to develop *
                    </label>
                    <textarea
                      required
                      rows={4}
                      className={ic}
                      placeholder="Tell us about your requirements, users, and goals..."
                      value={form.customDescription}
                      onChange={(e) => setForm({ ...form, customDescription: e.target.value })}
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-brand-gold text-brand-dark rounded-lg font-medium text-sm hover:bg-brand-gold-light transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                  {submitting ? "Submitting..." : "Submit Demo Request"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
