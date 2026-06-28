"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  BookOpen,
  Award,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";

interface Enrollment {
  id: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  completionPercent: number;
  completed: boolean;
  averageScore: number | null;
  createdAt: string;
  approvedAt: string | null;
  paymentApprovedAt: string | null;
  course: {
    id: string;
    title: string;
    description: string;
    duration: string;
    completionHours: number;
    level: string;
    format: string;
    price: string;
    slug: string;
  };
}

export default function LearnerDashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learner/courses")
      .then((r) => r.json())
      .then((d) => setEnrollments(d.enrollments || []))
      .catch(() =>
        fetch("/api/enrollments?mine=true")
          .then((r) => r.json())
          .then((d) => setEnrollments(d.enrollments || []))
      )
      .finally(() => setLoading(false));
  }, []);

  const active = enrollments.filter(
    (e) => e.status === "APPROVED" && e.paymentStatus === "APPROVED"
  );
  const pending = enrollments.filter(
    (e) => e.status !== "APPROVED" || e.paymentStatus !== "APPROVED"
  );
  const completed = active.filter((e) => e.completed);
  const inProgress = active.filter((e) => !e.completed);

  const StatusBadge = ({ status, paymentStatus }: { status: string; paymentStatus: string }) => {
    if (status === "REJECTED" || paymentStatus === "REJECTED") {
      return <span className="flex items-center gap-1 text-red-400 text-xs"><XCircle size={14} /> Rejected</span>;
    }
    if (status === "APPROVED" && paymentStatus === "APPROVED") {
      return <span className="flex items-center gap-1 text-green-400 text-xs"><CheckCircle size={14} /> Active</span>;
    }
    return <span className="flex items-center gap-1 text-amber-400 text-xs"><Clock size={14} /> Pending Approval</span>;
  };

  if (!user?.emailVerified && !user?.phoneVerified) {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="font-display text-xl font-bold text-white mb-2">Verify Your Account</h2>
        <p className="text-brand-muted mb-6">Please verify your email or phone to access courses.</p>
        <Button variant="primary" href="/verify">Verify Now</Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-1">
        Welcome back, {user?.firstName}
      </h1>
      <p className="text-brand-muted mb-8">Continue your learning journey</p>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="glass-card p-4">
          <BookOpen className="text-brand-gold mb-2" size={20} />
          <p className="text-2xl font-bold text-white">{inProgress.length}</p>
          <p className="text-brand-muted text-xs">In Progress</p>
        </div>
        <div className="glass-card p-4">
          <Award className="text-green-400 mb-2" size={20} />
          <p className="text-2xl font-bold text-white">{completed.length}</p>
          <p className="text-brand-muted text-xs">Completed</p>
        </div>
        <div className="glass-card p-4">
          <BarChart3 className="text-brand-gold mb-2" size={20} />
          <p className="text-2xl font-bold text-white">
            {active.length > 0
              ? Math.round(
                  active.reduce((s, e) => s + (e.averageScore || 0), 0) /
                    active.filter((e) => e.averageScore).length || 0
                ) || "—"
              : "—"}
            {active.some((e) => e.averageScore) && "%"}
          </p>
          <p className="text-brand-muted text-xs">Avg Score</p>
        </div>
      </div>

      {loading ? (
        <p className="text-brand-muted">Loading...</p>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="text-brand-gold" size={20} />
              Continue Learning ({inProgress.length})
            </h2>
            {inProgress.length === 0 && active.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-brand-muted mb-4">No active courses yet. Enroll and wait for admin approval.</p>
                <Button variant="primary" href="/training">Browse Courses</Button>
              </div>
            ) : inProgress.length === 0 ? (
              <div className="glass-card p-6 text-center text-brand-muted text-sm">
                All your courses are completed! View your certificates.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {inProgress.map((e) => (
                  <Link
                    key={e.id}
                    href={`/dashboard/courses/${e.id}`}
                    className="glass-card overflow-hidden flex hover:border-brand-gold/30 border border-transparent transition-colors group"
                  >
                    <div className="relative w-32 flex-shrink-0">
                      <SiteImage alt={e.course.title} title={e.course.title} variant="training" fill sizes="128px" />
                    </div>
                    <div className="p-4 flex-1">
                      <StatusBadge status={e.status} paymentStatus={e.paymentStatus} />
                      <h3 className="font-semibold text-white mt-2 group-hover:text-brand-gold transition-colors">
                        {e.course.title}
                      </h3>
                      <p className="text-brand-muted text-xs mt-1">
                        {e.course.format} · {e.course.duration} · {e.course.completionHours}h
                      </p>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-brand-muted mb-1">
                          <span>Progress</span>
                          <span>{Math.round(e.completionPercent)}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-gold rounded-full"
                            style={{ width: `${e.completionPercent}%` }}
                          />
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-brand-gold text-xs mt-3">
                        Continue <ChevronRight size={14} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {completed.length > 0 && (
            <section className="mb-10">
              <h2 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="text-green-400" size={20} />
                Completed ({completed.length})
              </h2>
              <div className="space-y-3">
                {completed.map((e) => (
                  <Link
                    key={e.id}
                    href={`/dashboard/courses/${e.id}`}
                    className="glass-card p-4 flex justify-between items-center hover:border-brand-gold/30 border border-transparent"
                  >
                    <div>
                      <h3 className="text-white font-medium">{e.course.title}</h3>
                      <p className="text-brand-muted text-xs mt-1">
                        Score: {e.averageScore}% · Certificate earned
                      </p>
                    </div>
                    <ChevronRight className="text-brand-gold" size={18} />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {pending.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-semibold text-white mb-4">
                Pending Enrollments ({pending.length})
              </h2>
              <div className="space-y-3">
                {pending.map((e) => (
                  <div key={e.id} className="glass-card p-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-white font-medium">{e.course.title}</h3>
                      <p className="text-brand-muted text-xs mt-1">
                        Applied {new Date(e.createdAt).toLocaleDateString()}
                        {e.paymentMethod && ` · ${e.paymentMethod.replace(/_/g, " ")}`}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span>Registration: <span className={e.status === "APPROVED" ? "text-green-400" : e.status === "REJECTED" ? "text-red-400" : "text-amber-400"}>{e.status}</span></span>
                        <span>Payment: <span className={e.paymentStatus === "APPROVED" ? "text-green-400" : e.paymentStatus === "REJECTED" ? "text-red-400" : "text-amber-400"}>{e.paymentStatus}</span></span>
                      </div>
                    </div>
                    <StatusBadge status={e.status} paymentStatus={e.paymentStatus} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
