import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AfriMind Tech&AI Consulting Agency. Free consultation for AI development, consulting, and training. Based in Monrovia, Liberia.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
