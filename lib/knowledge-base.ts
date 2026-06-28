import {
  COMPANY_NAME,
  COMPANY_TAGLINE,
  COMPANY_EMAIL,
  COMPANY_LOCATION,
  COMPANY_URL,
} from "@/lib/brand";
import { serviceDetails, processSteps, pricingTiers } from "@/lib/data/services";
import { projects } from "@/lib/data/portfolio";
import { courses } from "@/lib/data/training";
import { teamMembers, milestones } from "@/lib/data/team";

export interface KnowledgeChunk {
  id: string;
  topic: string;
  keywords: string[];
  content: string;
}

function buildChunks(): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [
    {
      id: "company",
      topic: "About Us",
      keywords: ["about", "company", "who", "afrimind", "mission", "vision", "liberia", "monrovia"],
      content: `${COMPANY_NAME} — ${COMPANY_TAGLINE}. Headquartered in ${COMPANY_LOCATION}. Email: ${COMPANY_EMAIL}. Website: ${COMPANY_URL}. We design, build, and deploy custom AI solutions for businesses, governments, NGOs, and organizations across Africa and globally. Mission: make world-class AI accessible to every African organization.`,
    },
    {
      id: "contact",
      topic: "Contact",
      keywords: ["contact", "email", "phone", "reach", "consultation", "hello", "support"],
      content: `Contact ${COMPANY_NAME}: Email ${COMPANY_EMAIL}, Location: ${COMPANY_LOCATION}. Free initial consultation available at /contact. You can enroll in training courses, request software demos from our portfolio, or submit project inquiries.`,
    },
    {
      id: "process",
      topic: "How We Work",
      keywords: ["process", "how", "work", "steps", "methodology", "delivery"],
      content: `Our process: ${processSteps.map((s) => `${s.num}. ${s.title}: ${s.description}`).join(" | ")}`,
    },
    {
      id: "pricing",
      topic: "Pricing",
      keywords: ["price", "pricing", "cost", "fee", "budget", "tier", "starter", "enterprise"],
      content: `Pricing tiers: ${pricingTiers.map((t) => `${t.name} — ${t.price}: ${t.description}`).join(" | ")}. Service starting prices vary by project scope.`,
    },
  ];

  for (const svc of serviceDetails) {
    chunks.push({
      id: `service-${svc.title}`,
      topic: svc.title,
      keywords: [
        svc.title.toLowerCase(),
        ...svc.audiences.map((a) => a.toLowerCase()),
        "service",
        "consulting",
        "development",
      ],
      content: `${svc.title}: ${svc.description} Starting at ${svc.pricing}. Deliverables: ${svc.deliverables.join(", ")}. Ideal for: ${svc.audiences.join(", ")}.`,
    });
  }

  for (const p of projects) {
    chunks.push({
      id: `project-${p.id}`,
      topic: p.title,
      keywords: [p.title.toLowerCase(), p.category, p.country.toLowerCase(), "portfolio", "demo", "case study"],
      content: `${p.title} (${p.category}, ${p.country}): ${p.description} Problem: ${p.problem} Solution: ${p.solution} Impact: ${p.impact.map((i) => `${i.metric} ${i.label}`).join(", ")}. Tech: ${p.techStack.join(", ")}. Request a demo at /portfolio.`,
    });
  }

  for (const c of courses) {
    chunks.push({
      id: `course-${c.id}`,
      topic: c.title,
      keywords: [
        c.title.toLowerCase(),
        c.level,
        c.format.toLowerCase(),
        "course",
        "training",
        "enroll",
        "learn",
        ...c.topics.map((t) => t.toLowerCase()),
      ],
      content: `Course: ${c.title}. Price: ${c.price}. Duration: ${c.duration}. Level: ${c.level}. Format: ${c.format}. Description: ${c.description}. Topics: ${c.topics.join(", ")}. Enroll at /training.`,
    });
  }

  chunks.push({
    id: "team",
    topic: "Team",
    keywords: ["team", "founder", "leadership", "staff", "engineer"],
    content: `Team: ${teamMembers.map((m) => `${m.name} (${m.role})`).join(", ")}. Journey: ${milestones.map((m) => `${m.year}: ${m.title}`).join("; ")}.`,
  });

  chunks.push({
    id: "training-general",
    topic: "Training Programs",
    keywords: ["training", "courses", "learn", "workshop", "bootcamp", "certification", "all courses"],
    content: `We offer ${courses.length} AI training courses from beginner to advanced, online and in-person. Prices range from $125 to $500+. Browse all courses at /training. Categories include AI essentials, chatbots, NLP, data analytics, healthcare AI, and corporate programs.`,
  });

  chunks.push({
    id: "demo",
    topic: "Request Demo",
    keywords: ["demo", "request", "trial", "software", "portfolio", "system"],
    content: `Request a demo of our software systems on the Portfolio page (/portfolio). Select a system like Health Information System, Citizen Chatbot, Financial Analytics, LMS, NGO Impact Tracker, or describe a custom system you need built.`,
  });

  chunks.push({
    id: "feedback",
    topic: "Feedback",
    keywords: ["feedback", "suggest", "recommend", "improve", "complaint", "review"],
    content: `We welcome your feedback and recommendations for improving our services and website. Share suggestions here in chat — they are sent to our admin team for review.`,
  });

  return chunks;
}

export const KNOWLEDGE_CHUNKS = buildChunks();

export function searchKnowledge(query: string, limit = 5): KnowledgeChunk[] {
  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  const scored = KNOWLEDGE_CHUNKS.map((chunk) => {
    let score = 0;
    for (const kw of chunk.keywords) {
      if (q.includes(kw)) score += 3;
      for (const w of words) {
        if (kw.includes(w) || w.includes(kw)) score += 1;
      }
    }
    if (q.includes(chunk.topic.toLowerCase())) score += 2;
    return { chunk, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.chunk);
}

export function getSiteSummary(): string {
  return KNOWLEDGE_CHUNKS.map((c) => c.content).join("\n\n").slice(0, 12000);
}

export const DEMO_SYSTEMS = [
  ...projects.map((p) => ({ id: p.id, title: p.title })),
  { id: "custom", title: "None — Describe custom software" },
];
