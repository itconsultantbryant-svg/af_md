"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Check } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
import { EnrollmentModal, type CourseForEnrollment } from "@/components/enrollment/EnrollmentModal";
import { audienceLabels, type CourseAudience } from "@/lib/courses";
import { upcomingSessions } from "@/lib/data/training";
import { cn } from "@/lib/utils";

const ParticleField = dynamic(
  () =>
    import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);

interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  format: string;
  price: string;
  topics: string[];
  audiences: CourseAudience[];
  seatsAvailable: number;
  seatsTotal: number;
}

const audienceFilters: { id: CourseAudience | "all"; label: string }[] = [
  { id: "all", label: "All Audiences" },
  { id: "students", label: audienceLabels.students },
  { id: "professionals", label: audienceLabels.professionals },
  { id: "companies", label: audienceLabels.companies },
  { id: "ngos", label: audienceLabels.ngos },
  { id: "public", label: audienceLabels.public },
];

export default function TrainingPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [audience, setAudience] = useState<CourseAudience | "all">("all");
  const [enrollCourse, setEnrollCourse] = useState<CourseForEnrollment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadCourses = useCallback(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.courses || []));
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const filtered = useMemo(
    () =>
      audience === "all"
        ? courses
        : courses.filter((c) => c.audiences.includes(audience)),
    [audience, courses]
  );

  const openEnroll = (course: Course) => {
    setEnrollCourse({
      id: course.id,
      title: course.title,
      price: course.price,
      seatsAvailable: course.seatsAvailable,
    });
    setModalOpen(true);
  };

  return (
    <main>
      <EnrollmentModal
        course={enrollCourse}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadCourses}
      />

      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden">
        <Suspense fallback={null}>
          <ParticleField particleCount={500} />
        </Suspense>
        <div className="relative z-10 text-center px-4 pt-24">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
            Empowering Africa Through
            <br />
            <span className="gold-gradient-text">AI Education</span>
          </h1>
          <p className="text-brand-muted text-lg max-w-2xl mx-auto">
            {courses.length}+ practical AI programs for students, professionals,
            companies, NGOs, and the general public.
          </p>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Our Courses"
            subtitle="From beginner discovery camps to enterprise transformation — find the right program for you."
          />

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {audienceFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setAudience(f.id)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all cursor-hover",
                  audience === f.id
                    ? "bg-brand-gold text-brand-dark"
                    : "bg-white/5 text-brand-muted border border-white/10 hover:border-brand-gold/30"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p className="text-center text-brand-muted text-sm mb-8">
            Showing {filtered.length} of {courses.length} courses
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course) => (
              <Card key={course.id} hover className="flex flex-col overflow-hidden p-0">
                <div className="relative aspect-video w-full">
                  <SiteImage
                    alt={course.title}
                    title={course.title}
                    variant="training"
                    subtitle={course.format}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge>{course.duration}</Badge>
                    <Badge level={course.level} className="capitalize">
                      {course.level}
                    </Badge>
                    <Badge variant="tech">{course.format}</Badge>
                    <Badge variant={course.seatsAvailable > 0 ? "default" : "tech"}>
                      {course.seatsAvailable} seats left
                    </Badge>
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">
                    {course.title}
                  </h3>
                  <p className="text-brand-muted text-sm mb-3 flex-1">
                    {course.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {course.audiences.map((a) => (
                      <span
                        key={a}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                      >
                        {audienceLabels[a]}
                      </span>
                    ))}
                  </div>

                  <Accordion.Root type="single" collapsible className="mb-4">
                    <Accordion.Item value="topics">
                      <Accordion.Trigger className="flex items-center justify-between w-full text-brand-gold text-sm cursor-hover group">
                        Topics Covered
                        <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                      </Accordion.Trigger>
                      <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down">
                        <ul className="mt-2 space-y-1">
                          {course.topics.map((topic) => (
                            <li
                              key={topic}
                              className="text-brand-muted text-xs flex items-start gap-1.5"
                            >
                              <Check className="w-3 h-3 text-brand-gold mt-0.5 flex-shrink-0" />
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </Accordion.Content>
                    </Accordion.Item>
                  </Accordion.Root>

                  <p className="font-display text-2xl font-bold text-brand-gold mb-4">
                    {course.price}
                  </p>
                  <button
                    onClick={() => openEnroll(course)}
                    disabled={course.seatsAvailable <= 0}
                    className={cn(
                      "w-full text-sm py-3 rounded-lg font-medium transition-colors cursor-hover",
                      course.seatsAvailable > 0
                        ? "bg-brand-gold text-brand-dark hover:bg-brand-gold-light"
                        : "bg-white/10 text-brand-muted cursor-not-allowed"
                    )}
                  >
                    {course.seatsAvailable <= 0
                      ? "Fully Booked"
                      : course.format === "Corporate"
                        ? "Request for Team"
                        : "Enroll Now"}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-brand-darker px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto glass-card overflow-hidden p-0 grid md:grid-cols-2 gap-0">
          <div className="relative min-h-[280px] md:min-h-0">
            <SiteImage
              alt="Corporate AI Training"
              title="Corporate Training"
              variant="corporate"
              subtitle="Custom programs for teams"
              fill
              sizes="50vw"
            />
          </div>
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Corporate Training
            </h2>
            <p className="text-brand-muted leading-relaxed mb-4">
              Need AI training for your entire organization? We design custom
              curricula tailored to your industry, team size, and learning
              objectives — delivered on-site or remotely with post-training
              support.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Custom curriculum development",
                "On-site and remote delivery",
                "Industry-specific case studies",
                "Post-training support and resources",
                "Flexible scheduling",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-brand-muted text-sm"
                >
                  <Check className="w-4 h-4 text-brand-gold flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Button variant="primary" href="/contact" className="w-fit">
              Get a Corporate Quote
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="Upcoming Sessions" />
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.course + session.date}
                className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-display font-semibold text-white">
                    {session.course}
                  </h3>
                  <p className="text-brand-muted text-sm">
                    {session.date} · {session.location}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="font-display text-xl font-bold text-brand-gold">
                      {session.price}
                    </p>
                    <p className="text-brand-muted text-xs">
                      {session.seats} seats left
                    </p>
                  </div>
                  <Button variant="gold" href="/training" className="text-sm py-2">
                    Enroll
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
