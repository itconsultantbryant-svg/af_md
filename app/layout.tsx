import type { Metadata } from "next";
import { Syne, DM_Sans, Space_Mono } from "next/font/google";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { COMPANY_NAME, COMPANY_SHORT, COMPANY_TAGLINE } from "@/lib/brand";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://afrimindai.com"
  ),
  title: {
    default: `${COMPANY_NAME} — ${COMPANY_TAGLINE}`,
    template: `%s | ${COMPANY_SHORT}`,
  },
  description:
    `${COMPANY_NAME} is Africa's premier AI consulting agency, headquartered in Monrovia, Liberia. We build custom AI solutions, chatbots, data systems, and AI training programs for businesses, NGOs, and governments across Africa and globally.`,
  keywords: [
    "AI agency Africa",
    "AI consulting Liberia",
    "artificial intelligence Monrovia",
    "chatbot development West Africa",
    "AI solutions NGO Africa",
    "machine learning consulting Africa",
    "AfriMind Tech AI Consulting",
    "AI agency Monrovia",
    "government AI Africa",
    "healthcare AI Liberia",
  ],
  openGraph: {
    title: `${COMPANY_NAME} — ${COMPANY_TAGLINE}`,
    description:
      "Africa's premier Tech & AI consulting agency. Custom AI solutions for businesses, governments, and organizations.",
    url: "https://afrimindai.com",
    siteName: COMPANY_NAME,
    images: [
      { url: "/afrimind_logo.png", width: 429, height: 350, alt: COMPANY_NAME },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@AfriMindAI",
    creator: "@AfriMindAI",
    title: `${COMPANY_NAME} — ${COMPANY_TAGLINE}`,
    description:
      "Africa's premier AI agency. Custom AI solutions for businesses, governments, and organizations.",
    images: ["/og-image.svg"],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/afrimind_logo.png",
    apple: "/afrimind_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
      </head>
      <body
        className={`${syne.variable} ${dmSans.variable} ${spaceMono.variable} font-body antialiased bg-brand-dark text-white`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
