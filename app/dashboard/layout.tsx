"use client";

import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-dark flex">
      <DashboardSidebar />
      <main className="flex-1 ml-72 p-8 min-h-screen">{children}</main>
    </div>
  );
}
