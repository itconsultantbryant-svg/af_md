"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import {
  LayoutDashboard,
  BookOpen,
  User,
  BarChart3,
  Award,
  LogOut,
  Home,
  ChevronDown,
  ChevronRight,
  Clock,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";

interface CourseItem {
  id: string;
  completionPercent: number;
  completed: boolean;
  course: { title: string; slug: string };
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [coursesOpen, setCoursesOpen] = useState(true);

  useEffect(() => {
    fetch("/api/learner/courses")
      .then((r) => r.json())
      .then((d) => setCourses(d.enrollments || []));
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/profile", label: "My Profile", icon: User },
    { href: "/dashboard/scores", label: "My Scores", icon: BarChart3 },
    { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  ];

  return (
    <aside className="w-72 min-h-screen bg-brand-darker border-r border-white/5 flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-white/5">
        <Logo href="/dashboard" size="sm" />
        <p className="text-brand-gold text-xs font-medium mt-2">Learner Portal</p>
        {user && (
          <p className="text-brand-muted text-xs mt-2 truncate">
            {user.firstName} {user.lastName}
          </p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon }) => (
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

        <div className="pt-4">
          <button
            onClick={() => setCoursesOpen(!coursesOpen)}
            className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-brand-muted hover:text-white"
          >
            <span className="flex items-center gap-3">
              <BookOpen size={18} />
              My Courses
            </span>
            {coursesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {coursesOpen && (
            <div className="ml-2 mt-1 space-y-0.5 border-l border-white/10 pl-3">
              {courses.length === 0 ? (
                <p className="text-xs text-brand-muted px-2 py-2">No active courses</p>
              ) : (
                courses.map((e) => (
                  <Link
                    key={e.id}
                    href={`/dashboard/courses/${e.id}`}
                    className={cn(
                      "block px-2 py-2 rounded-lg text-xs transition-colors",
                      pathname === `/dashboard/courses/${e.id}`
                        ? "bg-brand-gold/15 text-brand-gold"
                        : "text-brand-muted hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className="line-clamp-2 font-medium">{e.course.title}</span>
                    <span className="flex items-center gap-1 mt-1 text-[10px]">
                      <Clock size={10} />
                      {Math.round(e.completionPercent)}%
                      {e.completed && <Award size={10} className="text-brand-gold ml-1" />}
                    </span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-white/5 space-y-1">
        <Link
          href="/training"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-muted hover:text-white"
        >
          <BookOpen size={18} />
          Browse Courses
        </Link>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-brand-muted hover:text-white"
        >
          <Home size={18} />
          Website
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
