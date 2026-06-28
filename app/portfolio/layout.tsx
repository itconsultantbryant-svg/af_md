import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Explore AfriMind Tech&AI Consulting Agency's case studies and projects across healthcare, government, finance, education, and NGOs in Africa.",
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
