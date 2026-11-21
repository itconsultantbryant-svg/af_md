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
  BarChart3,
  TrendingUp,
  Briefcase,
  Pencil,
} from "lucide-react";

interface Stats {
  totalCourses: number;
  totalStudents: number;
  pendingEnrollments: number;
  pendingPayments: number;
  totalClients: number;
  activeContracts: number;
  subscriptions: number;
  totalVisitors: number;
  visitorsToday: number;
}

interface SiteStat {
  id: string;
  key: string;
  label: string;
  value: number;
  prefix: string;
  suffix: string;
  published: boolean;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [siteStats, setSiteStats] = useState<SiteStat[]>([]);

  useEffect(() => {
    fetch("/api/admin/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setStats(d.stats));
    fetch("/api/site-stats/admin", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setSiteStats(d?.stats || []));
  }, []);

  const cards = [
    { label: "Published Courses", value: stats?.totalCourses, icon: BookOpen, href: "/admin/courses", color: "text-brand-gold" },
    { label: "Registered Students", value: stats?.totalStudents, icon: Users, href: "/admin/students", color: "text-blue-400" },
    { label: "Pending Enrollments", value: stats?.pendingEnrollments, icon: GraduationCap, href: "/admin/enrollments", color: "text-amber-400" },
    { label: "Pending Payments", value: stats?.pendingPayments, icon: GraduationCap, href: "/admin/enrollments", color: "text-orange-400" },
    { label: "Clients", value: stats?.totalClients, icon: Building2, href: "/admin/clients", color: "text-emerald-400" },
    { label: "Active Contracts", value: stats?.activeContracts, icon: FileText, href: "/admin/contracts", color: "text-purple-400" },
    { label: "Newsletter Subscribers", value: stats?.subscriptions, icon: Mail, href: "/admin/subscriptions", color: "text-pink-400" },
    { label: "Site Visitors", value: stats?.totalVisitors, icon: BarChart3, href: "/admin/analytics", color: "text-cyan-400" },
    { label: "Visitors Today", value: stats?.visitorsToday, icon: BarChart3, href: "/admin/analytics", color: "text-teal-400" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">
        Admin Dashboard
      </h1>
      <p className="text-brand-muted mb-8">
        Manage courses, enrollments, clients, website stats, and portfolio projects.
      </p>

      <div className="mb-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-white">
              Website Stats
            </h2>
            <p className="text-brand-muted text-sm">
              Live numbers shown on the homepage and about page.
            </p>
          </div>
          <Link
            href="/admin/site-stats"
            className="flex items-center gap-2 px-4 py-2 border border-brand-gold/40 text-brand-gold rounded-lg text-sm hover:bg-brand-gold/10"
          >
            <Pencil size={15} /> Edit Stats
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {siteStats.length === 0 ? (
            <div className="glass-card p-5 sm:col-span-2 lg:col-span-4">
              <p className="text-brand-muted text-sm">
                No website stats yet.{" "}
                <Link href="/admin/site-stats" className="text-brand-gold">
                  Add projects, clients, funds raised, and partners.
                </Link>
              </p>
            </div>
          ) : (
            siteStats.map((stat) => (
              <Link
                key={stat.id}
                href="/admin/site-stats"
                className="glass-card p-5 hover:border-brand-gold/30 transition-colors"
              >
                <TrendingUp className="w-6 h-6 text-brand-gold mb-2" />
                <p className="font-display text-2xl font-bold text-white">
                  {stat.prefix}
                  {stat.value.toLocaleString()}
                  {stat.suffix}
                </p>
                <p className="text-brand-muted text-sm mt-1">{stat.label}</p>
              </Link>
            ))
          )}
        </div>
      </div>

      <h2 className="font-display text-xl font-semibold text-white mb-4">
        Operations
      </h2>
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
          <Link href="/admin/site-stats" className="px-4 py-2 bg-brand-gold text-brand-dark rounded-lg text-sm font-medium">
            Edit Website Stats
          </Link>
          <Link href="/admin/portfolio" className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm flex items-center gap-2">
            <Briefcase size={15} /> Add Portfolio Project
          </Link>
          <Link href="/admin/courses" className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm">
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
          <Link href="/admin/analytics" className="px-4 py-2 border border-white/20 text-white rounded-lg text-sm">
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
}
