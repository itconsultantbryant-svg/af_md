export interface MaterialProgressData {
  pagesViewed: number[];
  currentPage: number;
  videoWatchedPercent: number;
  videoEnded: boolean;
  viewSeconds: number;
  textScrolledToEnd: boolean;
  linkOpened: boolean;
}

export const emptyProgress = (): MaterialProgressData => ({
  pagesViewed: [],
  currentPage: 1,
  videoWatchedPercent: 0,
  videoEnded: false,
  viewSeconds: 0,
  textScrolledToEnd: false,
  linkOpened: false,
});

export function parseProgress(json: string | null | undefined): MaterialProgressData {
  if (!json) return emptyProgress();
  try {
    return { ...emptyProgress(), ...JSON.parse(json) };
  } catch {
    return emptyProgress();
  }
}

export function estimatePageCount(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 280));
}

export function paginateText(text: string, pageCount: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const perPage = Math.ceil(words.length / pageCount);
  const pages: string[] = [];
  for (let i = 0; i < pageCount; i++) {
    pages.push(words.slice(i * perPage, (i + 1) * perPage).join(" "));
  }
  return pages.filter((p) => p.length > 0);
}

export function canCompleteMaterial(
  type: string,
  pageCount: number,
  mediaDuration: number | null,
  progress: MaterialProgressData
): { allowed: boolean; reason?: string } {
  switch (type) {
    case "VIDEO": {
      if (progress.videoEnded || progress.videoWatchedPercent >= 95) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: `Watch the full video (${Math.round(progress.videoWatchedPercent)}% viewed)`,
      };
    }
    case "PDF":
    case "DOC": {
      const required = Math.max(1, pageCount);
      const uniquePages = new Set(progress.pagesViewed);
      if (uniquePages.size >= required) return { allowed: true };
      return {
        allowed: false,
        reason: `View all pages (${uniquePages.size}/${required} viewed)`,
      };
    }
    case "IMAGE": {
      if (progress.pagesViewed.includes(1) && progress.viewSeconds >= 5) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "View the image for at least 5 seconds",
      };
    }
    case "LINK": {
      if (progress.linkOpened && progress.viewSeconds >= 15) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: "Open the link and spend at least 15 seconds reviewing",
      };
    }
    case "TEXT":
    default: {
      const required = Math.max(1, pageCount);
      const uniquePages = new Set(progress.pagesViewed);
      if (uniquePages.size >= required || progress.textScrolledToEnd) {
        return { allowed: true };
      }
      return {
        allowed: false,
        reason: `Read all content (${uniquePages.size}/${required} pages viewed)`,
      };
    }
  }
}
