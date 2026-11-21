import { prisma } from "@/lib/db";
import { json, error } from "@/lib/api";
import { defaultSiteStats } from "@/lib/data/site-stats";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      courses,
      learners,
      clients,
      enrollments,
      visitors,
      sessions,
      subscriptions,
      industries,
      clientCountries,
      learnerCountries,
      highlights,
      totalSiteStats,
    ] = await Promise.all([
      prisma.course.count({ where: { published: true } }),
      prisma.user.count({ where: { role: "LEARNER" } }),
      prisma.client.count(),
      prisma.enrollment.count(),
      prisma.siteVisitor.count(),
      prisma.siteSession.count(),
      prisma.newsletterSubscription.count({ where: { active: true } }),
      prisma.client.findMany({
        where: { industry: { not: null } },
        distinct: ["industry"],
        select: { industry: true },
      }),
      prisma.client.findMany({
        distinct: ["country"],
        select: { country: true },
      }),
      prisma.user.findMany({
        where: { country: { not: null } },
        distinct: ["country"],
        select: { country: true },
      }),
      prisma.siteStat.findMany({
        where: { published: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          key: true,
          label: true,
          value: true,
          prefix: true,
          suffix: true,
        },
      }),
      prisma.siteStat.count(),
    ]);

    const countries = new Set(
      [
        ...clientCountries.map((c) => c.country),
        ...learnerCountries.map((u) => u.country),
      ].filter((value): value is string => Boolean(value && value.trim()))
    ).size;

    return json({
      stats: {
        courses,
        learners,
        clients,
        countries,
        enrollments,
        visitors,
        sessions,
        subscriptions,
        industries: industries.length,
        highlights:
          highlights.length > 0
            ? highlights
            : totalSiteStats === 0
              ? defaultSiteStats.map((stat, index) => ({
                  id: `default-${index}`,
                  ...stat,
                }))
              : [],
      },
    });
  } catch (e) {
    console.error("GET /api/stats failed:", e);
    return error("Failed to load stats", 500);
  }
}
