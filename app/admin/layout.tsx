import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-dark">
      <AdminSidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}
