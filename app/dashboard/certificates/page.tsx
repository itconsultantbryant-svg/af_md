"use client";

import { useEffect, useState } from "react";
import { Award, Download } from "lucide-react";

interface Enrollment {
  id: string;
  completed: boolean;
  certificateNumber: string | null;
  certificateUrl: string | null;
  completedAt: string | null;
  averageScore: number | null;
  course: { title: string; duration: string; level: string };
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learner/courses")
      .then((r) => r.json())
      .then((d) => {
        const completed = (d.enrollments || []).filter(
          (e: Enrollment) => e.completed && e.certificateNumber
        );
        setCerts(completed);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Award className="text-brand-gold" size={28} />
        <div>
          <h1 className="font-display text-2xl font-bold text-white">My Certificates</h1>
          <p className="text-brand-muted text-sm">Download your earned certificates</p>
        </div>
      </div>

      {loading ? (
        <p className="text-brand-muted">Loading...</p>
      ) : certs.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <Award className="w-12 h-12 text-brand-muted mx-auto mb-4 opacity-50" />
          <p className="text-brand-muted">No certificates yet. Complete a course to earn yours.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certs.map((c) => (
            <div key={c.id} className="glass-card p-6 border border-brand-gold/20">
              <div className="flex items-start justify-between">
                <div>
                  <Award className="text-brand-gold mb-3" size={32} />
                  <h2 className="font-display font-semibold text-white">{c.course.title}</h2>
                  <p className="text-brand-muted text-xs mt-1">
                    {c.course.duration} · {c.course.level}
                  </p>
                  <p className="text-brand-muted text-xs mt-2">
                    Certificate No: {c.certificateNumber}
                  </p>
                  {c.averageScore && (
                    <p className="text-brand-gold text-sm mt-1">Score: {c.averageScore}%</p>
                  )}
                  {c.completedAt && (
                    <p className="text-brand-muted text-xs mt-1">
                      Issued {new Date(c.completedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {c.certificateUrl && (
                <a
                  href={c.certificateUrl}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium"
                >
                  <Download size={16} /> Download PDF
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
