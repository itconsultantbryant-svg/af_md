"use client";

import { useEffect, useState } from "react";
import { BarChart3, CheckCircle, XCircle } from "lucide-react";

interface ExamAttempt {
  score: number;
  examType: string;
  passed: boolean;
  sectionId: string | null;
  createdAt: string;
}

interface Enrollment {
  id: string;
  averageScore: number | null;
  completed: boolean;
  course: { title: string };
  examAttempts: ExamAttempt[];
}

export default function ScoresPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/learner/courses")
      .then((r) => r.json())
      .then((d) => setEnrollments(d.enrollments || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-brand-muted">Loading scores...</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <BarChart3 className="text-brand-gold" size={28} />
        <div>
          <h1 className="font-display text-2xl font-bold text-white">My Scores</h1>
          <p className="text-brand-muted text-sm">Exam results across all your courses</p>
        </div>
      </div>

      {enrollments.length === 0 ? (
        <div className="glass-card p-8 text-center text-brand-muted">
          No course scores yet. Enroll in a course to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {enrollments.map((e) => (
            <div key={e.id} className="glass-card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="font-display font-semibold text-white">{e.course.title}</h2>
                  {e.averageScore !== null && (
                    <p className="text-brand-gold text-2xl font-bold mt-1">{e.averageScore}%</p>
                  )}
                  <p className="text-brand-muted text-xs">Course Average</p>
                </div>
                {e.completed && (
                  <span className="text-green-400 text-xs flex items-center gap-1">
                    <CheckCircle size={14} /> Completed
                  </span>
                )}
              </div>

              {e.examAttempts.length === 0 ? (
                <p className="text-brand-muted text-sm">No exams taken yet</p>
              ) : (
                <div className="space-y-2">
                  {e.examAttempts.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-t border-white/5 text-sm"
                    >
                      <span className="text-brand-muted">
                        {a.examType === "FINAL" ? "Final Exam" : "Section Exam"}
                        <span className="text-xs ml-2">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className={a.passed ? "text-green-400" : "text-red-400"}>{a.score}%</span>
                        {a.passed ? (
                          <CheckCircle size={14} className="text-green-400" />
                        ) : (
                          <XCircle size={14} className="text-red-400" />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
