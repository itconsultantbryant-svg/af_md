import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AI development, strategy consulting, healthcare AI, data analytics, training, and SaaS products — built for African organizations.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
