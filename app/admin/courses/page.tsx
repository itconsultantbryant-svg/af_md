"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { audienceLabels, type CourseAudience } from "@/lib/courses";

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  format: string;
  price: string;
  priceAmount: number;
  topics: string[];
  audiences: CourseAudience[];
  seatsTotal: number;
  seatsAvailable: number;
  published: boolean;
}

const emptyForm = {
  title: "",
  description: "",
  duration: "1 Day",
  level: "beginner",
  format: "Online",
  price: "$0",
  priceAmount: 0,
  topics: "",
  audiences: ["public"] as CourseAudience[],
  seatsTotal: 20,
  seatsAvailable: 20,
  published: true,
};

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [seatsEdit, setSeatsEdit] = useState<{ id: string; total: number; available: number } | null>(null);

  const load = () =>
    fetch("/api/courses?all=true")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses));

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (c: Course) => {
    setEditing(c);
    setForm({
      title: c.title,
      description: c.description,
      duration: c.duration,
      level: c.level,
      format: c.format,
      price: c.price,
      priceAmount: c.priceAmount,
      topics: c.topics.join("\n"),
      audiences: c.audiences,
      seatsTotal: c.seatsTotal,
      seatsAvailable: c.seatsAvailable,
      published: c.published,
    });
    setShowForm(true);
  };

  const save = async () => {
    const payload = {
      ...form,
      topics: form.topics.split("\n").filter(Boolean),
      priceAmount: parseFloat(form.price.replace(/[^0-9.]/g, "")) || form.priceAmount,
    };

    const url = editing ? `/api/courses/${editing.id}` : "/api/courses";
    const method = editing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this course?")) return;
    await fetch(`/api/courses/${id}`, { method: "DELETE" });
    load();
  };

  const updateSeats = async () => {
    if (!seatsEdit) return;
    await fetch(`/api/courses/${seatsEdit.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seatsTotal: seatsEdit.total,
        seatsAvailable: seatsEdit.available,
      }),
    });
    setSeatsEdit(null);
    load();
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white";

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Courses</h1>
          <p className="text-brand-muted text-sm">Changes appear on the website immediately.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add Course
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6 mb-8">
          <h2 className="font-display text-lg font-semibold text-white mb-4">
            {editing ? "Edit Course" : "New Course"}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input className={inputClass} placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className={inputClass} placeholder="Price (e.g. $150)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            <input className={inputClass} placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
            <select className={inputClass} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            <select className={inputClass} value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
              <option value="Corporate">Corporate</option>
            </select>
            <div className="flex gap-2">
              <input type="number" className={inputClass} placeholder="Total seats" value={form.seatsTotal} onChange={(e) => setForm({ ...form, seatsTotal: +e.target.value })} />
              <input type="number" className={inputClass} placeholder="Available" value={form.seatsAvailable} onChange={(e) => setForm({ ...form, seatsAvailable: +e.target.value })} />
            </div>
            <textarea className={`${inputClass} md:col-span-2`} rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <textarea className={`${inputClass} md:col-span-2`} rows={4} placeholder="Topics (one per line)" value={form.topics} onChange={(e) => setForm({ ...form, topics: e.target.value })} />
            <div className="md:col-span-2 flex flex-wrap gap-2">
              {(Object.keys(audienceLabels) as CourseAudience[]).map((a) => (
                <label key={a} className="flex items-center gap-1.5 text-sm text-brand-muted">
                  <input
                    type="checkbox"
                    checked={form.audiences.includes(a)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        audiences: e.target.checked
                          ? [...form.audiences, a]
                          : form.audiences.filter((x) => x !== a),
                      })
                    }
                  />
                  {audienceLabels[a]}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={save} className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c.id} className="glass-card p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-white">{c.title}</h3>
              <p className="text-brand-muted text-xs mt-1">
                {c.format} · {c.level} · {c.price} ·{" "}
                <span className={c.seatsAvailable > 0 ? "text-green-400" : "text-red-400"}>
                  {c.seatsAvailable}/{c.seatsTotal} seats
                </span>
                {!c.published && <span className="text-amber-400 ml-2">Draft</span>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {seatsEdit?.id === c.id ? (
                <div className="flex items-center gap-2">
                  <input type="number" className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white" value={seatsEdit.total} onChange={(e) => setSeatsEdit({ ...seatsEdit, total: +e.target.value })} />
                  <input type="number" className="w-16 bg-white/5 border border-white/10 rounded px-2 py-1 text-sm text-white" value={seatsEdit.available} onChange={(e) => setSeatsEdit({ ...seatsEdit, available: +e.target.value })} />
                  <button onClick={updateSeats} className="p-1.5 text-green-400"><Check size={16} /></button>
                  <button onClick={() => setSeatsEdit(null)} className="p-1.5 text-brand-muted"><X size={16} /></button>
                </div>
              ) : (
                <button onClick={() => setSeatsEdit({ id: c.id, total: c.seatsTotal, available: c.seatsAvailable })} className="text-xs text-brand-gold px-2 py-1 border border-brand-gold/30 rounded">
                  Edit Seats
                </button>
              )}
              <button onClick={() => openEdit(c)} className="p-2 text-brand-muted hover:text-white"><Pencil size={16} /></button>
              <Link href={`/admin/courses/${c.id}/content`} className="text-xs text-brand-gold px-2 py-1 border border-brand-gold/30 rounded">
                Content
              </Link>
              <button onClick={() => remove(c.id)} className="p-2 text-brand-muted hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
