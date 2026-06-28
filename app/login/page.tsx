"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/hooks/useAuth";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirect = params.get("redirect") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      await refresh();
      if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push(redirect);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const ic = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-gold/50";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-dark">
      <div className="w-full max-w-md glass-card p-8">
        <div className="flex justify-center mb-6">
          <Logo href="/" size="lg" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Welcome Back</h1>
        <p className="text-brand-muted text-sm mb-6">Log in to your AfriMind Tech&AI Consulting Agency account</p>

        {params.get("error") === "admin" && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 text-amber-400 text-sm mb-4">
            Admin access required.
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" required className={ic} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" required className={ic} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-brand-muted text-sm text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-brand-gold hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark" />}>
      <LoginForm />
    </Suspense>
  );
}
