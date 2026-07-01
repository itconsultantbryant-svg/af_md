"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown, Check, GraduationCap, Mail, Globe } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SiteImage } from "@/components/ui/SiteImage";
import { EnrollmentModal, type CourseForEnrollment } from "@/components/enrollment/EnrollmentModal";
import {
  audienceLabels,
  catalogForDisplay,
  catalogCourseCount,
  mergeApiWithCatalog,
  type CourseAudience,
  type TrainingCourseDisplay,
} from "@/lib/catalog";
import { courseCatalogMeta, upcomingSessions } from "@/lib/data/training";
import { cn } from "@/lib/utils";

const ParticleField = dynamic(
  () =>
    import("@/components/three/ParticleField").then((m) => m.ParticleField),
  { ssr: false }
);

type TrackFilter =
  | "all"
  | "ict-cs"
  | "artificial-intelligence"
  | "software-development"
  | "specialized";

const trackFilters: { id: TrackFilter; label: string }[] = [
  { id: "all", label: "All Courses" },
  { id: "ict-cs", label: "ICT & CS" },
  { id: "artificial-intelligence", label: "AI" },
  { id: "software-development", label: "Software Dev" },
  { id: "specialized", label: "Specialized" },
];

const audienceFilters: { id: CourseAudience | "all"; label: string }[] = [
  { id: "all", label: "All Audiences" },
  { id: "students", label: audienceLabels.students },
  { id: "professionals", label: audienceLabels.professionals },
  { id: "companies", label: audienceLabels.companies },
  { id: "ngos", label: audienceLabels.ngos },
  { id: "public", label: audienceLabels.public },
];

function CourseCard({
  course,
  onEnroll,
}: {
  course: TrainingCourseDisplay;
  onEnroll: (c: TrainingCourseDisplay) => void;
}) {
  return (
    <Card hover className="flex flex-col overflow-hidden p-0">
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
        <p className="text-brand-muted text-sm mb-3 flex-1">{course.description}</p>
        {course.certificate && (
          <p className="text-[11px] text-brand-gold/90 mb-3 flex items-center gap-1.5">
            <GraduationCap size={12} />
            {course.certificate}
          </p>
        )}
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
          onClick={() => onEnroll(course)}
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
  );
}

export default function TrainingPage() {
  const [courses, setCourses] = useState<TrainingCourseDisplay[]>(catalogForDisplay);
  const [track, setTrack] = useState<TrackFilter>("all");
  const [audience, setAudience] = useState<CourseAudience | "all">("all");
  const [enrollCourse, setEnrollCourse] = useState<CourseForEnrollment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(true);

  const loadCourses = useCallback(() => {
    setRefreshing(true);
    fetch("/api/courses")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load courses");
        return r.json();
      })
      .then((d) => {
        if (Array.isArray(d.courses)) {
          setCourses(mergeApiWithCatalog(d.courses));
        }
      })
      .catch(() => {
        setCourses(catalogForDisplay());
      })
      .finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const filtered = useMemo(() => {
    let list = courses;
    if (track !== "all") {
      list = list.filter((c) => c.category === track);
    }
    if (audience !== "all") {
      list = list.filter((c) => c.audiences.includes(audience));
    }
    return list;
  }, [audience, track, courses]);

  const openEnroll = (course: TrainingCourseDisplay) => {
    setEnrollCourse({
      id: course.id,
      title: course.title,
      price: course.price,
      seatsAvailable: course.seatsAvailable,
    });
    setModalOpen(true);
  };

  const totalCount = catalogCourseCount();
  const { sections } = courseCatalogMeta;

  const groupedSections = useMemo(() => {
    if (track !== "all") {
      const section = sections.find((s) => s.id === track);
      return section ? [{ section, courses: filtered }] : [];
    }
    return sections
      .map((section) => ({
        section,
        courses: filtered.filter((c) => c.category === section.id),
      }))
      .concat([
        {
          section: {
            id: "specialized" as const,
            title: "Specialized AfriMind Programs",
            subtitle: "Industry-focused and community AI programs",
            format: "Online & Corporate",
            duration: "Varies",
            priceRange: "Varies",
            certificate: "AfriMind Certificate",
            level: "All Levels",
            courseCount: filtered.filter((c) => c.category === "specialized").length,
            includes: ["Expert-led sessions", "African context", "Flexible formats"],
          },
          courses: filtered.filter((c) => c.category === "specialized"),
        },
      ])
      .filter((g) => g.courses.length > 0);
  }, [filtered, track, sections]);

  return (
    <main>
      <EnrollmentModal
        course={enrollCourse}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadCourses}
      />

      <section className="relative min-h-[45vh] flex items-center justify-center overflow-hidden">
        <Suspense fallback={null}>
          <ParticleField particleCount={500} />
        </Suspense>
        <div className="relative z-10 text-center px-4 pt-24 max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-[0.2em] text-brand-gold uppercase mb-3">
            Professional Course Catalog · {courseCatalogMeta.year}
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">
            {courseCatalogMeta.title}
          </h1>
          <p className="text-brand-muted text-sm md:text-base mb-2">
            {courseCatalogMeta.subtitle}
          </p>
          <p className="text-brand-gold text-sm font-medium mb-8">
            {courseCatalogMeta.tagline}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setTrack(s.id)}
                className="glass-card p-4 text-left hover:border-brand-gold/40 transition-colors cursor-pointer"
              >
                <p className="font-display text-2xl font-bold text-brand-gold">
                  {s.courseCount}
                </p>
                <p className="text-white text-sm font-medium mt-1">{s.title.split(" ")[0]}…</p>
                <p className="text-brand-muted text-xs mt-1">
                  {s.priceRange} · {s.duration}
                </p>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-brand-muted text-xs">
            <span className="flex items-center gap-1.5">
              <Mail size={12} className="text-brand-gold" />
              {courseCatalogMeta.contactEmail}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe size={12} className="text-brand-gold" />
              {courseCatalogMeta.website}
            </span>
            <span>Monrovia, Liberia</span>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Our Courses"
            subtitle={`${totalCount} programs — ICT, AI, software development, and specialized tracks.`}
          />

          <div className="flex flex-wrap gap-3 justify-center mb-6">
            {trackFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setTrack(f.id)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all cursor-hover",
                  track === f.id
                    ? "bg-brand-gold text-brand-dark"
                    : "bg-white/5 text-brand-muted border border-white/10 hover:border-brand-gold/30"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {audienceFilters.map((f) => (
              <button
                key={f.id}
                onClick={() => setAudience(f.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-hover",
                  audience === f.id
                    ? "border border-brand-gold text-brand-gold"
                    : "text-brand-muted hover:text-white"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p className="text-center text-brand-muted text-sm mb-10">
            Showing {filtered.length} of {courses.length} courses
            {refreshing && (
              <span className="ml-2 text-brand-gold/80">· Updating availability…</span>
            )}
          </p>

          {filtered.length === 0 ? (
            <p className="text-center text-brand-muted py-12">
              No courses match these filters. Try another track or audience.
            </p>
          ) : (
            <div className="space-y-16">
              {groupedSections.map(({ section, courses: sectionCourses }) => (
                <div key={section.id}>
                  <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-brand-darker/50">
                    <h2 className="font-display text-2xl font-bold text-white mb-1">
                      {section.title}
                    </h2>
                    <p className="text-brand-muted text-sm mb-4">{section.subtitle}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-brand-muted">
                      <span>
                        <strong className="text-brand-gold">Format:</strong> {section.format}
                      </span>
                      <span>
                        <strong className="text-brand-gold">Duration:</strong> {section.duration}
                      </span>
                      <span>
                        <strong className="text-brand-gold">Price:</strong> {section.priceRange}
                      </span>
                      <span>
                        <strong className="text-brand-gold">Certificate:</strong>{" "}
                        {section.certificate}
                      </span>
                      <span>
                        <strong className="text-brand-gold">Level:</strong> {section.level}
                      </span>
                    </div>
                    <p className="text-brand-muted text-xs mt-3">
                      Includes: {section.includes.join(" · ")}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectionCourses.map((course) => (
                      <CourseCard key={course.slug} course={course} onEnroll={openEnroll} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
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
