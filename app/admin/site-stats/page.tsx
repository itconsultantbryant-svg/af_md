"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

interface SiteStat {
  id: string;
  key: string;
  label: string;
  value: number;
  prefix: string;
  suffix: string;
  sortOrder: number;
  published: boolean;
}

interface StatForm {
  label: string;
  value: string;
  prefix: string;
  suffix: string;
  sortOrder: string;
  published: boolean;
}

const emptyForm: StatForm = {
  label: "",
  value: "0",
  prefix: "",
  suffix: "",
  sortOrder: "0",
  published: true,
};

function formatValue(stat: SiteStat) {
  return `${stat.prefix}${stat.value.toLocaleString()}${stat.suffix}`;
}

export default function AdminSiteStatsPage() {
  const [stats, setStats] = useState<SiteStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SiteStat | null>(null);
  const [form, setForm] = useState<StatForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/api/site-stats/admin", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setStats(data?.stats || []))
      .catch(() => setError("Unable to load site stats."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, sortOrder: String(stats.length) });
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const openEdit = (stat: SiteStat) => {
    setEditing(stat);
    setForm({
      label: stat.label,
      value: String(stat.value),
      prefix: stat.prefix,
      suffix: stat.suffix,
      sortOrder: String(stat.sortOrder),
      published: stat.published,
    });
    setShowForm(true);
    setMessage("");
    setError("");
  };

  const save = async () => {
    setMessage("");
    setError("");
    if (!form.label.trim()) {
      setError("Please enter a label.");
      return;
    }
    const value = Number(form.value);
    if (!Number.isFinite(value) || value < 0) {
      setError("Please enter a valid non-negative number.");
      return;
    }

    const payload = {
      ...(editing ? { key: editing.key } : {}),
      label: form.label.trim(),
      value,
      prefix: form.prefix,
      suffix: form.suffix,
      sortOrder: Number(form.sortOrder) || 0,
      published: form.published,
    };

    const res = await fetch(
      editing ? `/api/site-stats/${editing.id}` : "/api/site-stats",
      {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || "Could not save this statistic.");
      return;
    }

    setShowForm(false);
    setEditing(null);
    setForm(emptyForm);
    setMessage(editing ? "Statistic updated." : "Statistic added.");
    load();
  };

  const remove = async (stat: SiteStat) => {
    if (!confirm(`Delete "${stat.label}" from the website stats?`)) return;
    const res = await fetch(`/api/site-stats/${stat.id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Could not delete this statistic.");
      return;
    }
    setMessage("Statistic deleted.");
    load();
  };

  const togglePublished = async (stat: SiteStat) => {
    await fetch(`/api/site-stats/${stat.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: stat.key,
        label: stat.label,
        value: stat.value,
        prefix: stat.prefix,
        suffix: stat.suffix,
        sortOrder: stat.sortOrder,
        published: !stat.published,
      }),
    });
    load();
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-brand-muted/60 focus:outline-none focus:border-brand-gold/50";

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Site Stats
          </h1>
          <p className="text-brand-muted text-sm">
            These values appear on the homepage, about page, and stats banner.
            Changes go live as soon as you save.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Statistic
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {showForm && (
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-white">
              {editing ? "Edit statistic" : "New statistic"}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-brand-muted hover:text-white"
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="block lg:col-span-2">
              <span className="text-brand-muted text-xs mb-1 block">Label</span>
              <input
                className={inputClass}
                placeholder="Projects Completed"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">Value</span>
              <input
                className={inputClass}
                type="number"
                min="0"
                step="any"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">Prefix</span>
              <input
                className={inputClass}
                placeholder="$"
                value={form.prefix}
                onChange={(e) => setForm({ ...form, prefix: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">Suffix</span>
              <input
                className={inputClass}
                placeholder="+"
                value={form.suffix}
                onChange={(e) => setForm({ ...form, suffix: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-brand-muted text-xs mb-1 block">Sort order</span>
              <input
                className={inputClass}
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              />
            </label>
            <label className="flex items-center gap-2 md:col-span-2 lg:col-span-1 mt-6">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
                className="accent-brand-gold"
              />
              <span className="text-sm text-brand-muted">Show on website</span>
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={save}
              className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium"
            >
              {editing ? "Save changes" : "Add statistic"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-brand-muted">Loading site stats...</p>
      ) : stats.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-brand-muted">
            No site stats yet. Add projects, clients, funds raised, and partners.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.id} className="glass-card p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-2xl font-bold text-brand-gold">
                    {formatValue(stat)}
                  </p>
                  <p className="text-white text-sm mt-1">{stat.label}</p>
                  <p className="text-brand-muted text-[11px] font-mono mt-1">
                    {stat.key}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEdit(stat)}
                    className="p-2 text-brand-muted hover:text-white"
                    aria-label={`Edit ${stat.label}`}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(stat)}
                    className="p-2 text-brand-muted hover:text-red-400"
                    aria-label={`Delete ${stat.label}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={
                    stat.published
                      ? "text-emerald-400 text-xs"
                      : "text-brand-muted text-xs"
                  }
                >
                  {stat.published ? "Visible" : "Hidden"}
                </span>
                <button
                  onClick={() => togglePublished(stat)}
                  className="text-xs text-brand-gold hover:text-brand-gold-light"
                >
                  {stat.published ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
