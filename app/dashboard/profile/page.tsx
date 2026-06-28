"use client";

import { useEffect, useState } from "react";
import { User, Save, Lock } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

interface Profile {
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  organization: string | null;
  jobTitle: string | null;
  bio: string | null;
  country: string | null;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    organization: "",
    jobTitle: "",
    bio: "",
    country: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setProfile(d.user);
          setForm((f) => ({
            ...f,
            firstName: d.user.firstName || "",
            lastName: d.user.lastName || "",
            phone: d.user.phone || "",
            organization: d.user.organization || "",
            jobTitle: d.user.jobTitle || "",
            bio: d.user.bio || "",
            country: d.user.country || "",
          }));
        }
      });
  }, []);

  const save = async () => {
    setError("");
    setMessage("");
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        organization: form.organization,
        jobTitle: form.jobTitle,
        bio: form.bio,
        country: form.country,
        currentPassword: form.currentPassword || undefined,
        newPassword: form.newPassword || undefined,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(data.error || "Failed to save");
      return;
    }
    setMessage("Profile updated successfully");
    setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-brand-muted/50";

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-brand-gold/20 flex items-center justify-center">
          <User className="text-brand-gold" size={24} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-white">My Profile</h1>
          <p className="text-brand-muted text-sm">{profile?.email || user?.email}</p>
        </div>
      </div>

      {message && <p className="text-green-400 text-sm mb-4">{message}</p>}
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      <div className="glass-card p-6 mb-6">
        <h2 className="font-display font-semibold text-white mb-4">Personal Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-brand-muted mb-1 block">First Name</label>
            <input className={inputClass} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-brand-muted mb-1 block">Last Name</label>
            <input className={inputClass} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-brand-muted mb-1 block">Phone</label>
            <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-brand-muted mb-1 block">Country</label>
            <input className={inputClass} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-brand-muted mb-1 block">Organization</label>
            <input className={inputClass} value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-brand-muted mb-1 block">Job Title</label>
            <input className={inputClass} value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-brand-muted mb-1 block">Bio</label>
            <textarea className={inputClass} rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
          </div>
        </div>
      </div>

      <div className="glass-card p-6 mb-6">
        <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
          <Lock size={18} /> Change Password
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-brand-muted mb-1 block">Current Password</label>
            <input type="password" className={inputClass} value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-brand-muted mb-1 block">New Password</label>
              <input type="password" className={inputClass} value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-brand-muted mb-1 block">Confirm New Password</label>
              <input type="password" className={inputClass} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-2.5 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
