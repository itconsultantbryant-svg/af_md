"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Building2,
  FileText,
  Mail,
  Download,
  LogOut,
  ExternalLink,
  PlayCircle,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/enrollments", label: "Enrollments", icon: GraduationCap },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/clients", label: "Clients", icon: Building2 },
  { href: "/admin/demo-requests", label: "Demo Requests", icon: PlayCircle },
  { href: "/admin/recommendations", label: "Recommendations", icon: MessageSquare },
  { href: "/admin/contracts", label: "Contracts", icon: FileText },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: Mail },
  { href: "/admin/export", label: "Export Data", icon: Download },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-brand-darker border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-white/5">
        <Logo href="/admin" size="sm" />
        <p className="text-brand-gold text-xs font-medium mt-2">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              pathname === href
                ? "bg-brand-gold/15 text-brand-gold"
                : "text-brand-muted hover:text-white hover:bg-white/5"
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-muted hover:text-white"
        >
          <ExternalLink size={18} />
          View Website
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-muted hover:text-red-400 w-full"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
