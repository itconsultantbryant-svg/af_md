export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export function parseQuestions(json: string): ExamQuestion[] {
  try {
    return JSON.parse(json) as ExamQuestion[];
  } catch {
    return [];
  }
}

export function gradeExam(
  questions: ExamQuestion[],
  answers: Record<string, number>,
  passingScore = 70
): { score: number; passed: boolean; passingScore: number } {
  if (questions.length === 0) return { score: 0, passed: false, passingScore };
  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctIndex) correct++;
  }
  const score = Math.round((correct / questions.length) * 100);
  return { score, passed: score >= passingScore, passingScore };
}

export function durationToHours(duration: string): number {
  const d = duration.toLowerCase();
  if (d.includes("half")) return 4;
  const dayMatch = d.match(/(\d+)\s*day/);
  if (dayMatch) return parseInt(dayMatch[1]) * 8;
  return 8;
}

export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AMI-${year}-${rand}`;
}

export function computeCompletionPercent(
  totalMaterials: number,
  completedMaterials: number,
  totalSections: number,
  passedSectionExams: number,
  finalExamPassed: boolean
): number {
  if (totalMaterials === 0 && totalSections === 0) return 0;
  const materialWeight = 0.6;
  const sectionExamWeight = 0.25;
  const finalExamWeight = 0.15;

  const materialPct =
    totalMaterials > 0 ? (completedMaterials / totalMaterials) * 100 : 100;
  const sectionPct =
    totalSections > 0 ? (passedSectionExams / totalSections) * 100 : 100;
  const finalPct = finalExamPassed ? 100 : 0;

  return Math.min(
    100,
    Math.round(
      materialPct * materialWeight +
        sectionPct * sectionExamWeight +
        finalPct * finalExamWeight
    )
  );
}
