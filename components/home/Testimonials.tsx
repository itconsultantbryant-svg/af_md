"use client";

import { Star } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const testimonials = [
  {
    quote:
      "AfriMind Tech&AI Consulting Agency transformed how we collect and report health data across our facilities. The offline-first approach was exactly what we needed.",
    name: "Dr. Amara K.",
    role: "Director of Health Informatics",
    org: "Government Health Institution, Liberia",
    initials: "AK",
  },
  {
    quote:
      "Their AI training program gave our entire executive team the confidence to lead our digital transformation. Practical, relevant, and expertly delivered.",
    name: "James T.",
    role: "CEO",
    org: "West Africa Financial Group",
    initials: "JT",
  },
  {
    quote:
      "We needed an AI chatbot that understood our local context and languages. AfriMind delivered beyond our expectations at a fraction of global agency costs.",
    name: "Fatou D.",
    role: "Program Director",
    org: "Regional NGO, Senegal",
    initials: "FD",
  },
  {
    quote:
      "The data analytics dashboard they built gives us real-time visibility into operations across 12 branches. Game-changing for our decision-making.",
    name: "Kwame O.",
    role: "Operations Manager",
    org: "Logistics Company, Ghana",
    initials: "KO",
  },
  {
    quote:
      "As a government agency, we needed a partner who understood compliance and public sector constraints. AfriMind Tech&AI Consulting Agency was that partner.",
    name: "Minister S. B.",
    role: "Deputy Minister",
    org: "Ministry of Technology, Liberia",
    initials: "SB",
  },
  {
    quote:
      "Their SaaS product cut our customer support response time by 60%. Built for African businesses, priced for African budgets.",
    name: "Aisha M.",
    role: "Founder",
    org: "E-commerce Startup, Nigeria",
    initials: "AM",
  },
];

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  return (
    <div className="flex-shrink-0 w-[340px] glass-card p-6 mx-3">
      <p className="text-brand-muted italic text-[15px] leading-relaxed mb-4">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-gold/20 border border-brand-gold/30 flex items-center justify-center text-brand-gold text-sm font-bold">
          {testimonial.initials}
        </div>
        <div>
          <p className="text-white font-semibold text-sm">{testimonial.name}</p>
          <p className="text-brand-muted text-xs">
            {testimonial.role}, {testimonial.org}
          </p>
        </div>
      </div>
      <div className="flex gap-0.5 mt-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
        ))}
      </div>
    </div>
  );
}

export function Testimonials() {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <SectionHeader title="What Our Clients Say" />
      </div>

      <div className="group relative">
        <div className="flex animate-scroll group-hover:[animation-play-state:paused]">
          {doubled.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
