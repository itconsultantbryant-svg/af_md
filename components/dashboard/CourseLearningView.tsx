"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  Lock,
  FileText,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Play,
  Award,
} from "lucide-react";
import { MaterialViewer } from "@/components/dashboard/MaterialViewer";
import type { MaterialProgressData } from "@/lib/material-progress";

interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

interface Material {
  id: string;
  title: string;
  type: string;
  fileUrl: string | null;
  externalUrl: string | null;
  content: string | null;
  extractedText: string | null;
  pageCount: number;
  mediaDuration: number | null;
  durationMinutes: number;
  completed: boolean;
  unlocked: boolean;
  progress: MaterialProgressData;
  canComplete: boolean;
  completionHint?: string;
}

interface Section {
  id: string;
  title: string;
  description: string | null;
  materials: Material[];
  unlocked: boolean;
  allMaterialsDone: boolean;
  examPassed: boolean;
  examUnlocked: boolean;
  bestExamScore: number | null;
  exam: { id: string; title: string; questions: ExamQuestion[]; passingScore: number } | null;
}

interface LearningState {
  enrollment: {
    id: string;
    completionPercent: number;
    averageScore: number | null;
    completed: boolean;
    certificateNumber: string | null;
    certificateUrl: string | null;
  };
  course: {
    title: string;
    description: string;
    duration: string;
    completionHours: number;
    level: string;
  };
  sections: Section[];
  finalExam: {
    id: string;
    title: string;
    questions: ExamQuestion[];
    passingScore: number;
    unlocked: boolean;
    passed: boolean;
    bestScore: number;
  } | null;
}

const typeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  DOC: FileText,
  VIDEO: Video,
  IMAGE: ImageIcon,
  LINK: LinkIcon,
  TEXT: FileText,
};

export function CourseLearningView({ enrollmentId }: { enrollmentId: string }) {
  const [state, setState] = useState<LearningState | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMaterial, setActiveMaterial] = useState<Material | null>(null);
  const [examMode, setExamMode] = useState<"section" | "final" | null>(null);
  const [examSectionId, setExamSectionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [examResult, setExamResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = () =>
    fetch(`/api/learning/${enrollmentId}`)
      .then((r) => r.json())
      .then((d) => {
        setState(d);
        if (activeMaterial) {
          const refreshed = d.sections
            ?.flatMap((s: Section) => s.materials)
            .find((m: Material) => m.id === activeMaterial.id);
          if (refreshed) setActiveMaterial(refreshed);
        }
        return d;
      });

  useEffect(() => {
    load().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollmentId]);

  const completeMaterial = async () => {
    if (!activeMaterial) return;
    setSubmitting(true);
    const res = await fetch(`/api/learning/${enrollmentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "completeMaterial", materialId: activeMaterial.id }),
    });
    const data = await res.json();
    if (data.state) {
      setState(data.state);
      setActiveMaterial(null);
    }
    setSubmitting(false);
  };

  const submitExam = async () => {
    setSubmitting(true);
    const action = examMode === "final" ? "submitFinalExam" : "submitSectionExam";
    const body =
      examMode === "final"
        ? { action, answers }
        : { action, sectionId: examSectionId, answers };

    const res = await fetch(`/api/learning/${enrollmentId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setExamResult({ score: data.score, passed: data.passed });
    if (data.state) setState(data.state);
    setSubmitting(false);
  };

  const startSectionExam = (sectionId: string) => {
    setExamMode("section");
    setExamSectionId(sectionId);
    setAnswers({});
    setExamResult(null);
    setActiveMaterial(null);
  };

  const startFinalExam = () => {
    setExamMode("final");
    setExamSectionId(null);
    setAnswers({});
    setExamResult(null);
    setActiveMaterial(null);
  };

  if (loading) return <p className="text-brand-muted">Loading course...</p>;
  if (!state) return <p className="text-red-400">Course not found or access denied.</p>;

  const examQuestions =
    examMode === "final"
      ? state.finalExam?.questions || []
      : state.sections.find((s) => s.id === examSectionId)?.exam?.questions || [];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="glass-card p-4">
          <h2 className="font-display font-bold text-white text-lg">{state.course.title}</h2>
          <p className="text-brand-muted text-xs mt-1">
            {state.course.duration} · {state.course.completionHours}h · {state.course.level}
          </p>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-brand-muted mb-1">
              <span>Progress</span>
              <span>{Math.round(state.enrollment.completionPercent)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-gold rounded-full transition-all"
                style={{ width: `${state.enrollment.completionPercent}%` }}
              />
            </div>
          </div>
          {state.enrollment.averageScore !== null && (
            <p className="text-xs text-brand-muted mt-2">Average Score: {state.enrollment.averageScore}%</p>
          )}
          {state.enrollment.completed && state.enrollment.certificateUrl && (
            <a
              href={state.enrollment.certificateUrl}
              className="mt-3 flex items-center gap-2 text-brand-gold text-sm hover:underline"
            >
              <Award size={16} /> Download Certificate
            </a>
          )}
        </div>

        <div className="space-y-3">
          {state.sections.map((section, idx) => (
            <div key={section.id} className="glass-card p-3">
              <div className="flex items-center gap-2 mb-2">
                {!section.unlocked ? (
                  <Lock size={14} className="text-brand-muted" />
                ) : section.examPassed ? (
                  <CheckCircle size={14} className="text-green-400" />
                ) : (
                  <span className="text-brand-gold text-xs font-mono">{idx + 1}</span>
                )}
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
              </div>
              {section.unlocked && (
                <div className="space-y-1 ml-1">
                  {section.materials.map((m) => {
                    const Icon = typeIcons[m.type] || FileText;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          if (m.unlocked) {
                            setActiveMaterial(m);
                            setExamMode(null);
                            setExamResult(null);
                          }
                        }}
                        disabled={!m.unlocked}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-left ${
                          activeMaterial?.id === m.id
                            ? "bg-brand-gold/15 text-brand-gold"
                            : m.unlocked
                              ? "text-brand-muted hover:text-white hover:bg-white/5"
                              : "text-brand-muted/50 cursor-not-allowed"
                        }`}
                      >
                        {m.completed ? (
                          <CheckCircle size={12} className="text-green-400 flex-shrink-0" />
                        ) : !m.unlocked ? (
                          <Lock size={12} className="flex-shrink-0" />
                        ) : (
                          <Icon size={12} className="flex-shrink-0" />
                        )}
                        <span className="truncate">{m.title}</span>
                      </button>
                    );
                  })}
                  {section.exam && (
                    <button
                      onClick={() => section.examUnlocked && startSectionExam(section.id)}
                      disabled={!section.examUnlocked}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs ${
                        section.examUnlocked
                          ? "text-amber-400 hover:bg-white/5"
                          : "text-brand-muted/50 cursor-not-allowed"
                      }`}
                    >
                      {section.examPassed ? (
                        <CheckCircle size={12} className="text-green-400" />
                      ) : (
                        <Lock size={12} />
                      )}
                      Section Exam {section.bestExamScore ? `(${section.bestExamScore}%)` : ""}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {state.finalExam && (
            <div className="glass-card p-3">
              <button
                onClick={() => state.finalExam?.unlocked && startFinalExam()}
                disabled={!state.finalExam.unlocked}
                className={`w-full flex items-center gap-2 text-sm ${
                  state.finalExam.unlocked ? "text-brand-gold" : "text-brand-muted/50"
                }`}
              >
                {state.finalExam.passed ? (
                  <CheckCircle size={14} className="text-green-400" />
                ) : (
                  <Lock size={14} />
                )}
                Final Comprehensive Exam
                {state.finalExam.bestScore > 0 && ` (${state.finalExam.bestScore}%)`}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2">
        {examMode ? (
          <div className="glass-card p-6">
            <h3 className="font-display text-xl font-bold text-white mb-4">
              {examMode === "final" ? state.finalExam?.title : "Section Exam"}
            </h3>
            {examResult ? (
              <div className="text-center py-8">
                <p className={`text-4xl font-bold ${examResult.passed ? "text-green-400" : "text-red-400"}`}>
                  {examResult.score}%
                </p>
                <p className="text-white mt-2">
                  {examResult.passed ? "Passed! You may proceed." : "Did not pass. You need 70% to continue."}
                </p>
                <button
                  onClick={() => {
                    setExamMode(null);
                    setExamResult(null);
                  }}
                  className="mt-4 px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm"
                >
                  Back to Course
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {examQuestions.map((q, i) => (
                    <div key={q.id}>
                      <p className="text-white font-medium mb-3">
                        {i + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, oi) => (
                          <label
                            key={oi}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                              answers[q.id] === oi
                                ? "border-brand-gold bg-brand-gold/10"
                                : "border-white/10 hover:border-white/20"
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id}
                              checked={answers[q.id] === oi}
                              onChange={() => setAnswers({ ...answers, [q.id]: oi })}
                            />
                            <span className="text-sm text-brand-muted">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={submitExam}
                  disabled={submitting || Object.keys(answers).length < examQuestions.length}
                  className="mt-6 px-6 py-2.5 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Exam"}
                </button>
              </>
            )}
          </div>
        ) : activeMaterial ? (
          <MaterialViewer
            material={activeMaterial}
            enrollmentId={enrollmentId}
            submitting={submitting}
            onProgressUpdate={(m) => setActiveMaterial(m as Material)}
            onComplete={completeMaterial}
          />
        ) : (
          <div className="glass-card p-8 text-center">
            <Play className="w-12 h-12 text-brand-gold mx-auto mb-4 opacity-50" />
            <h3 className="font-display text-lg font-semibold text-white mb-2">Start Learning</h3>
            <p className="text-brand-muted text-sm">
              Select a material from the sidebar. Watch videos fully, navigate every page of documents, and complete each item before moving on.
            </p>
            <p className="text-brand-muted text-xs mt-4">{state.course.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
