"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/hooks/useAuth";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ic = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-gold/50";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      await refresh();
      router.push(`/verify?redirect=${params.get("redirect") || "/training"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-brand-dark">
      <div className="w-full max-w-md glass-card p-8">
        <div className="flex justify-center mb-6">
          <Logo href="/" size="lg" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Create Account</h1>
        <p className="text-brand-muted text-sm mb-6">Join AfriMind Tech&AI Consulting Agency to enroll in courses</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input required className={ic} placeholder="First Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input required className={ic} placeholder="Last Name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <input type="email" required className={ic} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className={ic} placeholder="Phone / WhatsApp (for SMS verify)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input type="password" required minLength={8} className={ic} placeholder="Password (min 8 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="text-brand-muted text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-gold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark" />}>
      <RegisterForm />
    </Suspense>
  );
}
