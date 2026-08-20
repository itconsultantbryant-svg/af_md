import { MessageCircle, FileStack, BookOpen, type LucideIcon } from "lucide-react";

export const packagesIntro =
  "AfriMind is the practical AI partner for African organizations that want results without the overhead of building a full technical team. We turn the promise of AI into working tools your staff and customers actually use — shipped in weeks, not quarters. From Monrovia to the wider region, we help schools, clinics, NGOs, and businesses solve real operational problems with technology that fits how they already work. No jargon, no runaway budgets — just clear outcomes you can measure.";

export const packagesClosingLine =
  "Fixed price. Fixed timeline. Live in weeks, not months.";

export interface ProductizedPackage {
  icon: LucideIcon;
  headline: string;
  outcome: string;
  description: string;
  bestFor: string[];
  price: string;
  timeline: string;
  cta: string;
}

export const productizedPackages: ProductizedPackage[] = [
  {
    icon: MessageCircle,
    headline: "Your Always-On Front Desk on WhatsApp",
    outcome:
      "Your customers get instant answers and your team captures every lead — even at 2 a.m. — while urgent messages reach a human in seconds.",
    description:
      "We set up a WhatsApp assistant that handles the questions you hear every day, collects contact details from interested customers, and knows exactly when to hand a conversation to your staff. It works around the clock, in the languages your customers use, so no inquiry slips through the cracks.",
    bestFor: ["Schools", "Clinics", "NGOs", "Retail & SMEs"],
    price: "$600–900 setup + $50/month",
    timeline: "Live in 10–14 days",
    cta: "Start Your WhatsApp Assistant →",
  },
  {
    icon: FileStack,
    headline: "Reclaim the Hours Paperwork Steals",
    outcome:
      "Manual intake forms, invoices, and reports become automated digital workflows — so your staff spends time serving people, not shuffling documents.",
    description:
      "We map your existing paperwork and rebuild it as clean digital workflows that capture, route, and store information automatically. NGOs cut program-reporting time, schools enroll students faster, and businesses invoice without the back-and-forth.",
    bestFor: ["NGOs", "Schools", "SMEs"],
    price: "$1,200–2,000 (up to 3 workflows)",
    timeline: "Live in 2–3 weeks",
    cta: "Automate Your First Workflow →",
  },
  {
    icon: BookOpen,
    headline: "Every Policy, One Question Away",
    outcome:
      "Staff get instant, accurate answers from your own policies, SOPs, and training materials — no more digging through shared drives or waiting on a colleague.",
    description:
      "We train a private assistant on your organization's documents so anyone can ask a plain-language question and get a reliable answer, with sources. New hires get up to speed faster, and your institutional knowledge stays available even when key people are out.",
    bestFor: ["NGOs", "Companies with heavy documentation"],
    price: "$1,500–2,500",
    timeline: "Live in 3 weeks",
    cta: "Put Your Knowledge to Work →",
  },
];
