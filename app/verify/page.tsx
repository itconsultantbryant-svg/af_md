"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/hooks/useAuth";

function VerifyForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, refresh } = useAuth();
  const [emailCode, setEmailCode] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [devCode, setDevCode] = useState("");

  const redirect = params.get("redirect") || "/training";
  const ic = "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white text-center tracking-widest focus:outline-none focus:border-brand-gold/50";

  const verify = async (type: "email" | "sms", code: string) => {
    setError("");
    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, code }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Verification failed");
    await refresh();
    setMessage(`${type === "email" ? "Email" : "Phone"} verified successfully!`);
    if (data.user.emailVerified || data.user.phoneVerified) {
      setTimeout(() => router.push(redirect), 1500);
    }
  };

  const resend = async (type: "email" | "sms") => {
    const res = await fetch("/api/auth/resend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    const data = await res.json();
    if (data.devCode) setDevCode(data.devCode);
    setMessage(`New ${type} code sent. Check console in dev mode.`);
  };

  if (user?.emailVerified && user?.phoneVerified) {
    router.push(redirect);
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-dark">
      <div className="w-full max-w-md glass-card p-8">
        <div className="flex justify-center mb-6">
          <Logo href="/" size="lg" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white mb-1">Verify Your Account</h1>
        <p className="text-brand-muted text-sm mb-6">
          Verify via email or SMS to enroll in courses. {user?.email && `(${user.email})`}
        </p>

        {message && <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-green-400 text-sm mb-4">{message}</div>}
        {error && <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm mb-4">{error}</div>}
        {devCode && <div className="bg-brand-navy/50 border border-brand-gold/30 rounded-lg p-3 text-brand-gold text-sm mb-4 font-mono">Dev code: {devCode}</div>}

        {!user?.emailVerified && (
          <div className="mb-6">
            <label className="text-sm text-brand-muted mb-2 block">Email Verification Code</label>
            <input className={ic} maxLength={6} placeholder="000000" value={emailCode} onChange={(e) => setEmailCode(e.target.value)} />
            <div className="flex gap-2 mt-3">
              <Button variant="primary" className="flex-1 text-sm" onClick={() => verify("email", emailCode).catch((e) => setError(e.message))}>
                Verify Email
              </Button>
              <button onClick={() => resend("email")} className="text-brand-gold text-xs px-3">Resend</button>
            </div>
          </div>
        )}

        {user?.emailVerified && <p className="text-green-400 text-sm mb-4">✓ Email verified</p>}

        {!user?.phoneVerified && (
          <div>
            <label className="text-sm text-brand-muted mb-2 block">SMS Verification Code</label>
            <input className={ic} maxLength={6} placeholder="000000" value={smsCode} onChange={(e) => setSmsCode(e.target.value)} />
            <div className="flex gap-2 mt-3">
              <Button variant="secondary" className="flex-1 text-sm" onClick={() => verify("sms", smsCode).catch((e) => setError(e.message))}>
                Verify SMS
              </Button>
              <button onClick={() => resend("sms")} className="text-brand-gold text-xs px-3">Resend</button>
            </div>
          </div>
        )}

        {user?.phoneVerified && <p className="text-green-400 text-sm mt-4">✓ Phone verified</p>}

        <p className="text-brand-muted text-xs mt-6 text-center">
          You only need one method verified to enroll. In development, codes are printed to the server console.
        </p>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark" />}>
      <VerifyForm />
    </Suspense>
  );
}
