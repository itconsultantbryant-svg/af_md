import { prisma } from "@/lib/db";

export type TrackPayload = {
  visitorKey: string;
  sessionId?: string;
  type: string;
  path?: string;
  label?: string;
  metadata?: Record<string, unknown>;
  durationSec?: number;
  userAgent?: string;
  referrer?: string;
};

export async function trackVisit(payload: TrackPayload) {
  const {
    visitorKey,
    sessionId,
    type,
    path,
    label,
    metadata,
    durationSec = 0,
    userAgent,
    referrer,
  } = payload;

  const existing = await prisma.siteVisitor.findUnique({ where: { visitorKey } });
  const isReturning = !!existing;

  const visitor = existing
    ? await prisma.siteVisitor.update({
        where: { visitorKey },
        data: {
          lastSeenAt: new Date(),
          visitCount: type === "session_start" ? { increment: 1 } : undefined,
          totalSeconds: durationSec > 0 ? { increment: durationSec } : undefined,
          isReturning: true,
          ...(userAgent && { userAgent }),
        },
      })
    : await prisma.siteVisitor.create({
        data: {
          visitorKey,
          isReturning: false,
          userAgent: userAgent || null,
          referrer: referrer || null,
        },
      });

  let session = sessionId
    ? await prisma.siteSession.findUnique({ where: { id: sessionId } })
    : null;

  if (type === "session_start") {
    session = await prisma.siteSession.create({
      data: {
        visitorId: visitor.id,
        entryPath: path || "/",
      },
    });
  }

  if (session && type === "session_end") {
    await prisma.siteSession.update({
      where: { id: session.id },
      data: {
        endedAt: new Date(),
        exitPath: path || session.entryPath,
        durationSec: { increment: durationSec },
      },
    });
  }

  if (session && type === "session_heartbeat" && durationSec > 0) {
    await prisma.siteSession.update({
      where: { id: session.id },
      data: { durationSec: { increment: durationSec } },
    });
    await prisma.siteVisitor.update({
      where: { id: visitor.id },
      data: { totalSeconds: { increment: durationSec } },
    });
  }

  if (session && type === "page_view") {
    await prisma.siteSession.update({
      where: { id: session.id },
      data: { pageViews: { increment: 1 } },
    });
  }

  await prisma.visitorEvent.create({
    data: {
      visitorId: visitor.id,
      sessionId: session?.id,
      type,
      path: path || null,
      label: label || null,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });

  return {
    visitorId: visitor.id,
    sessionId: session?.id,
    isReturning: isReturning || visitor.visitCount > 1,
  };
}

export async function getAnalyticsSummary() {
  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const pageViewEvents = await prisma.visitorEvent.findMany({
    where: { type: "page_view", path: { not: null } },
    select: { path: true },
  });
  const pathMap = new Map<string, number>();
  for (const e of pageViewEvents) {
    if (e.path) pathMap.set(e.path, (pathMap.get(e.path) || 0) + 1);
  }
  const topPages = Array.from(pathMap.entries())
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const [
    totalVisitors,
    firstTimeVisitors,
    returningVisitors,
    totalSessions,
    recentSessions,
    recentEvents,
    chatOpens,
  ] = await Promise.all([
    prisma.siteVisitor.count(),
    prisma.siteVisitor.count({ where: { visitCount: 1 } }),
    prisma.siteVisitor.count({ where: { isReturning: true } }),
    prisma.siteSession.count(),
    prisma.siteSession.findMany({
      orderBy: { startedAt: "desc" },
      take: 20,
      include: {
        visitor: true,
        events: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    }),
    prisma.visitorEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { visitor: true, session: true },
    }),
    prisma.visitorEvent.count({ where: { type: "chat_open" } }),
  ]);

  const visitorsToday = await prisma.siteVisitor.count({
    where: { lastSeenAt: { gte: dayAgo } },
  });

  const sessionsWeek = await prisma.siteSession.count({
    where: { startedAt: { gte: weekAgo } },
  });

  const avgDuration = await prisma.siteSession.aggregate({
    _avg: { durationSec: true },
  });

  const visitors = await prisma.siteVisitor.findMany({
    orderBy: { lastSeenAt: "desc" },
    take: 30,
    include: {
      sessions: { orderBy: { startedAt: "desc" }, take: 3 },
      events: { orderBy: { createdAt: "desc" }, take: 8 },
    },
  });

  return {
    overview: {
      totalVisitors,
      firstTimeVisitors,
      returningVisitors,
      visitorsToday,
      totalSessions,
      sessionsThisWeek: sessionsWeek,
      avgSessionSeconds: Math.round(avgDuration._avg.durationSec || 0),
      chatOpens,
    },
    topPages,
    recentSessions,
    recentEvents,
    visitors,
  };
}
