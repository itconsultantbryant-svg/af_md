"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  GraduationCap,
  Building2,
  FileText,
  Mail,
} from "lucide-react";

interface Stats {
  totalCourses: number;
  totalStudents: number;
  pendingEnrollments: number;
  pendingPayments: number;
  totalClients: number;
  activeContracts: number;
  subscriptions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.stats));
  }, []);

  const cards = [
    { label: "Published Courses", value: stats?.totalCourses, icon: BookOpen, href: "/admin/courses", color: "text-brand-gold" },
    { label: "Registered Students", value: stats?.totalStudents, icon: Users, href: "/admin/students", color: "text-blue-400" },
    { label: "Pending Enrollments", value: stats?.pendingEnrollments, icon: GraduationCap, href: "/admin/enrollments", color: "text-amber-400" },
    { label: "Pending Payments", value: stats?.pendingPayments, icon: GraduationCap, href: "/admin/enrollments", color: "text-orange-400" },
    { label: "Clients", value: stats?.totalClients, icon: Building2, href: "/admin/clients", color: "text-emerald-400" },
    { label: "Active Contracts", value: stats?.activeContracts, icon: FileText, href: "/admin/contracts", color: "text-purple-400" },
    { label: "Newsletter Subscribers", value: stats?.subscriptions, icon: Mail, href: "/admin/subscriptions", color: "text-pink-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">
        Admin Dashboard
      </h1>
      <p className="text-brand-muted mb-8">
        Manage courses, enrollments, clients, and exports.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="glass-card p-5 hover:border-brand-gold/30 transition-colors"
          >
            <card.icon className={`w-8 h-8 ${card.color} mb-3`} />
            <p className="font-display text-3xl font-bold text-white">
              {stats ? card.value : "—"}
            </p>
            <p className="text-brand-muted text-sm mt-1">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="glass-card p-6">
        <h2 className="font-display text-lg font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/courses" className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium">
            Add Course
          </Link>
          <Link href="/admin/enrollments" className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm">
            Review Enrollments
          </Link>
          <Link href="/admin/clients" className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm">
            Add Client
          </Link>
          <Link href="/admin/export" className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm">
            Export Data
          </Link>
        </div>
      </div>
    </div>
  );
}
