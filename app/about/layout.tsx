import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about AfriMind Tech&AI Consulting Agency — Africa's premier AI agency headquartered in Monrovia, Liberia. Our mission, team, and story.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
