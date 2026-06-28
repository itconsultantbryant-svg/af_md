"use client";

import { useState } from "react";
import { COMPANY_LEGAL } from "@/lib/brand";
import * as Dialog from "@radix-ui/react-dialog";
import { X, CreditCard, Smartphone, Building2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface CourseForEnrollment {
  id: string;
  title: string;
  price: string;
  seatsAvailable: number;
}

const paymentMethods = [
  { id: "VISA_CARD", label: "Visa Card", icon: CreditCard },
  { id: "MOBILE_MONEY_LONESTAR", label: "Lonestar Mobile Money", icon: Smartphone },
  { id: "MOBILE_MONEY_ORANGE", label: "Orange Mobile Money", icon: Smartphone },
  { id: "BANK_TRANSFER", label: "Bank Transfer", icon: Building2 },
] as const;

interface EnrollmentModalProps {
  course: CourseForEnrollment | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function EnrollmentModal({
  course,
  open,
  onClose,
  onSuccess,
}: EnrollmentModalProps) {
  const { user, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    organization: "",
    jobTitle: "",
    experience: "",
    motivation: "",
    emergencyContact: "",
    paymentMethod: "VISA_CARD",
    paymentReference: "",
    paymentProof: "",
  });

  const verified = user?.emailVerified || user?.phoneVerified;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id, ...form }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Enrollment failed");
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-brand-muted focus:outline-none focus:border-brand-gold/50";

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-brand-darker border border-white/10 rounded-2xl z-50 p-6 shadow-2xl">
          <div className="flex justify-between items-start mb-6">
            <div>
              <Dialog.Title className="font-display text-xl font-bold text-white">
                Enroll in Course
              </Dialog.Title>
              {course && (
                <p className="text-brand-gold text-sm mt-1">{course.title}</p>
              )}
            </div>
            <Dialog.Close className="text-brand-muted hover:text-white cursor-hover">
              <X size={20} />
            </Dialog.Close>
          </div>

          {loading ? (
            <p className="text-brand-muted">Loading...</p>
          ) : !user ? (
            <div className="text-center py-8">
              <p className="text-brand-muted mb-4">
                Create an account or log in to enroll in courses.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="primary" href={`/register?redirect=/training`}>
                  Create Account
                </Button>
                <Button variant="secondary" href={`/login?redirect=/training`}>
                  Log In
                </Button>
              </div>
            </div>
          ) : !verified ? (
            <div className="text-center py-8">
              <p className="text-brand-muted mb-4">
                Please verify your email or phone before enrolling.
              </p>
              <Button variant="primary" href="/verify">
                Verify Account
              </Button>
            </div>
          ) : success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4 text-green-400 text-2xl">
                ✓
              </div>
              <h3 className="font-display text-xl font-bold text-white mb-2">
                Enrollment Submitted!
              </h3>
              <p className="text-brand-muted text-sm mb-4">
                Your registration and payment are pending admin approval. You
                will see course access in your dashboard once both are approved.
              </p>
              <Button variant="primary" href="/dashboard">
                Go to Dashboard
              </Button>
            </div>
          ) : course && course.seatsAvailable <= 0 ? (
            <p className="text-red-400 text-center py-8">
              This course is fully booked. Please check back later.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <p className="text-brand-muted text-xs">
                {course?.seatsAvailable} seats remaining · Price: {course?.price}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">
                    Organization
                  </label>
                  <input
                    className={inputClass}
                    value={form.organization}
                    onChange={(e) =>
                      setForm({ ...form, organization: e.target.value })
                    }
                    placeholder="Company / NGO"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-muted mb-1 block">
                    Job Title
                  </label>
                  <input
                    className={inputClass}
                    value={form.jobTitle}
                    onChange={(e) =>
                      setForm({ ...form, jobTitle: e.target.value })
                    }
                    placeholder="Your role"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-brand-muted mb-1 block">
                  Experience Level
                </label>
                <select
                  className={inputClass}
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                >
                  <option value="">Select experience</option>
                  <option value="none">No prior AI experience</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-brand-muted mb-1 block">
                  Why do you want to enroll? *
                </label>
                <textarea
                  rows={3}
                  required
                  className={inputClass}
                  value={form.motivation}
                  onChange={(e) =>
                    setForm({ ...form, motivation: e.target.value })
                  }
                  placeholder="Tell us your goals for this course..."
                />
              </div>

              <div>
                <label className="text-xs text-brand-muted mb-1 block">
                  Emergency Contact
                </label>
                <input
                  className={inputClass}
                  value={form.emergencyContact}
                  onChange={(e) =>
                    setForm({ ...form, emergencyContact: e.target.value })
                  }
                  placeholder="Name & phone number"
                />
              </div>

              <div>
                <label className="text-xs text-brand-muted mb-2 block">
                  Payment Method *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {paymentMethods.map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, paymentMethod: pm.id })
                      }
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border text-left text-xs transition-colors cursor-hover",
                        form.paymentMethod === pm.id
                          ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                          : "border-white/10 text-brand-muted hover:border-white/20"
                      )}
                    >
                      <pm.icon size={16} />
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-brand-muted mb-1 block">
                  Payment Reference / Transaction ID
                </label>
                <input
                  className={inputClass}
                  value={form.paymentReference}
                  onChange={(e) =>
                    setForm({ ...form, paymentReference: e.target.value })
                  }
                  placeholder="e.g. MTN txn ID, bank ref, card last 4 digits"
                />
              </div>

              {form.paymentMethod === "BANK_TRANSFER" && (
                <div className="bg-brand-navy/30 border border-brand-gold/20 rounded-lg p-3 text-xs text-brand-muted">
                  <p className="text-brand-gold font-medium mb-1">
                    Bank Transfer Details
                  </p>
                  <p>Ecobank Liberia — {COMPANY_LEGAL}</p>
                  <p>Account: 0123456789 · SWIFT: ECOCLRLM</p>
                  <p className="mt-1">Use your name as payment reference.</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Enrollment"}
              </Button>
            </form>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
