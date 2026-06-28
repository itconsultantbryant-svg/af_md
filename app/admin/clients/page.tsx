"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organization: string;
  country: string;
  industry: string | null;
  contactPerson: string | null;
  notes: string | null;
  contracts: { id: string; title: string; status: string }[];
}

const empty = { name: "", email: "", phone: "", organization: "", country: "Liberia", industry: "", contactPerson: "", notes: "" };

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/clients").then((r) => r.json()).then((d) => setClients(d.clients));
  useEffect(() => { load(); }, []);

  const save = async () => {
    const url = editing ? `/api/clients/${editing}` : "/api/clients";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setShowForm(false); setEditing(null); setForm(empty); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete client and all contracts?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" }); load();
  };

  const ic = "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white";

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold text-white">Clients</h1>
        <button onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }} className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-8 grid md:grid-cols-2 gap-4">
          <input className={ic} placeholder="Contact Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className={ic} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className={ic} placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className={ic} placeholder="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          <input className={ic} placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <input className={ic} placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
          <input className={ic} placeholder="Contact Person" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
          <textarea className={`${ic} md:col-span-2`} rows={2} placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <div className="md:col-span-2 flex gap-3">
            <button onClick={save} className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {clients.map((c) => (
          <div key={c.id} className="glass-card p-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-white">{c.organization}</h3>
                <p className="text-brand-muted text-sm">{c.name} · {c.email} · {c.country}</p>
                {c.industry && <p className="text-brand-muted text-xs mt-1">{c.industry}</p>}
                {c.contracts.length > 0 && (
                  <p className="text-brand-gold text-xs mt-2">{c.contracts.length} contract(s)</p>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(c.id); setForm({ name: c.name, email: c.email, phone: c.phone || "", organization: c.organization, country: c.country, industry: c.industry || "", contactPerson: c.contactPerson || "", notes: c.notes || "" }); setShowForm(true); }} className="p-2 text-brand-muted hover:text-white"><Pencil size={16} /></button>
                <button onClick={() => remove(c.id)} className="p-2 text-brand-muted hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
