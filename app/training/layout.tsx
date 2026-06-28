import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training",
  description:
    "AI training programs and workshops for businesses, executives, and technical teams across Africa. Online, in-person, and corporate formats.",
};

export default function TrainingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
