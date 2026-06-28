"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

interface Contract {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string | null;
  value: number;
  currency: string;
  paymentTerms: string | null;
  status: string;
  stages: { name: string; status: string }[];
  client: { id: string; organization: string; name: string };
}

interface Client { id: string; organization: string; }

const empty = { clientId: "", title: "", description: "", startDate: "", endDate: "", value: 0, currency: "USD", paymentTerms: "", status: "DRAFT", stages: "" };

export default function AdminContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const [cRes, clRes] = await Promise.all([fetch("/api/contracts"), fetch("/api/clients")]);
    const cData = await cRes.json();
    const clData = await clRes.json();
    setContracts(cData.contracts);
    setClients(clData.clients);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    await fetch("/api/contracts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        value: +form.value,
        stages: form.stages ? form.stages.split("\n").filter(Boolean).map((line) => {
          const [name, status] = line.split("|").map((s) => s.trim());
          return { name, status: status || "pending" };
        }) : [],
      }),
    });
    setShowForm(false); setForm(empty); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete contract?")) return;
    await fetch(`/api/contracts/${id}`, { method: "DELETE" }); load();
  };

  const ic = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white";

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Contracts</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Contract
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-8 grid md:grid-cols-2 gap-4">
          <select className={ic} value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
            <option value="">Select Client</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.organization}</option>)}
          </select>
          <input className={ic} placeholder="Contract Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input className={ic} type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <input className={ic} type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <input className={ic} type="number" placeholder="Value" value={form.value} onChange={(e) => setForm({ ...form, value: +e.target.value })} />
          <select className={ic} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <input className={ic} placeholder="Payment Terms" value={form.paymentTerms} onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })} />
          <textarea className={`${ic} md:col-span-2`} rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <textarea className={`${ic} md:col-span-2`} rows={3} placeholder="Stages (one per line: Name | status)" value={form.stages} onChange={(e) => setForm({ ...form, stages: e.target.value })} />
          <div className="md:col-span-2 flex gap-3">
            <button onClick={save} className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {contracts.map((c) => (
          <div key={c.id} className="glass-card p-5">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold text-white">{c.title}</h3>
                <p className="text-brand-muted text-sm">{c.client.organization} · {c.client.name}</p>
                <p className="text-brand-gold text-sm mt-1">
                  {c.currency} {c.value.toLocaleString()} · {c.status}
                </p>
                <p className="text-brand-muted text-xs mt-1">
                  {new Date(c.startDate).toLocaleDateString()} — {c.endDate ? new Date(c.endDate).toLocaleDateString() : "Ongoing"}
                </p>
                {c.paymentTerms && <p className="text-brand-muted text-xs">Payment: {c.paymentTerms}</p>}
                {c.stages?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {c.stages.map((s, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded bg-white/5 text-brand-muted">{s.name}: {s.status}</span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => remove(c.id)} className="p-2 text-brand-muted hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
