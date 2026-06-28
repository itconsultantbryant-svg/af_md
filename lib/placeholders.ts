export type PlaceholderVariant =
  | "blog"
  | "portfolio"
  | "service"
  | "training"
  | "case-study"
  | "team"
  | "corporate";

const accents: Record<PlaceholderVariant, string> = {
  blog: "#4A90D9",
  portfolio: "#D4A017",
  service: "#1A3C6E",
  training: "#D4A017",
  "case-study": "#4A90D9",
  team: "#D4A017",
  corporate: "#1A3C6E",
};

export function placeholderSvg(
  title: string,
  variant: PlaceholderVariant = "blog",
  subtitle?: string
): string {
  const accent = accents[variant];
  const label = title.length > 42 ? `${title.slice(0, 40)}…` : title;
  const sub = subtitle || "AfriMind Tech&AI Consulting Agency";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#080E1A"/>
      <stop offset="50%" style="stop-color:#0D1525"/>
      <stop offset="100%" style="stop-color:#1A3C6E"/>
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${accent};stop-opacity:0.8"/>
      <stop offset="100%" style="stop-color:#F0C040;stop-opacity:0.6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#bg)"/>
  <circle cx="1050" cy="80" r="180" fill="${accent}" opacity="0.08"/>
  <circle cx="120" cy="580" r="140" fill="#D4A017" opacity="0.06"/>
  <g opacity="0.15" stroke="${accent}" stroke-width="1" fill="none">
    <path d="M0 120 H1200 M0 240 H1200 M0 360 H1200 M0 480 H1200 M0 600 H1200"/>
    <path d="M200 0 V675 M400 0 V675 M600 0 V675 M800 0 V675 M1000 0 V675"/>
  </g>
  <rect x="80" y="480" width="120" height="4" fill="url(#accent)" rx="2"/>
  <text x="80" y="420" font-family="system-ui,sans-serif" font-size="36" font-weight="700" fill="#FFFFFF">${label.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
  <text x="80" y="460" font-family="system-ui,sans-serif" font-size="18" fill="#8899BB">${sub.replace(/&/g, "&amp;")}</text>
  <rect x="900" y="520" width="220" height="100" rx="12" fill="#FFFFFF" opacity="0.04" stroke="${accent}" stroke-opacity="0.3"/>
  <rect x="920" y="545" width="80" height="8" rx="4" fill="${accent}" opacity="0.5"/>
  <rect x="920" y="565" width="160" height="6" rx="3" fill="#8899BB" opacity="0.4"/>
  <rect x="920" y="585" width="120" height="6" rx="3" fill="#8899BB" opacity="0.3"/>
</svg>`;
}

export function placeholderDataUrl(
  title: string,
  variant: PlaceholderVariant = "blog",
  subtitle?: string
): string {
  const svg = placeholderSvg(title, variant, subtitle);
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
