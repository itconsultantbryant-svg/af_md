import type { ExamQuestion } from "@/lib/learning";

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function sentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 40);
}

function fallbackQuestions(text: string, title: string, count: number): ExamQuestion[] {
  const sents = sentences(text);
  const source = sents.length > 0 ? sents : [text || title];
  const questions: ExamQuestion[] = [];

  for (let i = 0; i < Math.min(count, source.length); i++) {
    const sentence = source[i];
    const words = sentence.split(/\s+/);
    const keyWord = words.find((w) => w.length > 5) || words[Math.floor(words.length / 2)] || title;
    const cleaned = keyWord.replace(/[^a-zA-Z0-9]/g, "");
    questions.push({
      id: uid("q"),
      question: `According to "${title}", which concept is emphasized in: "${sentence.slice(0, 80)}..."?`,
      options: [
        cleaned || "Core concept",
        "Unrelated topic",
        "Optional detail",
        "Background context",
      ],
      correctIndex: 0,
    });
  }

  while (questions.length < count) {
    questions.push({
      id: uid("q"),
      question: `What is the main focus of the section material "${title}"?`,
      options: [
        "Understanding the presented concepts",
        "Skipping practical application",
        "Ignoring key definitions",
        "Memorizing unrelated facts",
      ],
      correctIndex: 0,
    });
  }

  return questions.slice(0, count);
}

export async function generateQuestionsFromContent(
  text: string,
  title: string,
  count = 3
): Promise<ExamQuestion[]> {
  const trimmed = text.trim().slice(0, 12000);
  if (!trimmed) return fallbackQuestions(title, title, count);

  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          temperature: 0.4,
          messages: [
            {
              role: "system",
              content:
                "Generate multiple-choice exam questions from educational content. Return ONLY valid JSON array with objects: { question, options (4 strings), correctIndex (0-3) }.",
            },
            {
              role: "user",
              content: `Material title: ${title}\n\nContent:\n${trimmed}\n\nGenerate ${count} comprehensive questions.`,
            },
          ],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.choices?.[0]?.message?.content || "";
        const match = raw.match(/\[[\s\S]*\]/);
        if (match) {
          const parsed = JSON.parse(match[0]) as Array<{
            question: string;
            options: string[];
            correctIndex: number;
          }>;
          return parsed.slice(0, count).map((q) => ({
            id: uid("q"),
            question: q.question,
            options: q.options.slice(0, 4),
            correctIndex: Math.min(3, Math.max(0, q.correctIndex)),
          }));
        }
      }
    } catch {
      /* fallback */
    }
  }

  return fallbackQuestions(trimmed, title, count);
}

export function combineSectionQuestions(
  sectionQuestions: ExamQuestion[][],
  limit = 12
): ExamQuestion[] {
  const combined = sectionQuestions.flat();
  const seen = new Set<string>();
  const unique: ExamQuestion[] = [];

  for (const q of combined) {
    const key = q.question.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({ ...q, id: uid("q") });
    if (unique.length >= limit) break;
  }

  return unique;
}
