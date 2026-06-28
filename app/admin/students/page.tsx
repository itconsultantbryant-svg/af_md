"use client";

import { useEffect, useState } from "react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  enrollments: { status: string; paymentStatus: string; course: { title: string } }[];
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    fetch("/api/admin/students")
      .then((r) => r.json())
      .then((d) => setStudents(d.students));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">Students</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-brand-muted border-b border-white/10">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Phone</th>
              <th className="text-left py-3 px-4">Verified</th>
              <th className="text-left py-3 px-4">Enrollments</th>
              <th className="text-left py-3 px-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                <td className="py-3 px-4 text-white">{s.firstName} {s.lastName}</td>
                <td className="py-3 px-4 text-brand-muted">{s.email}</td>
                <td className="py-3 px-4 text-brand-muted">{s.phone || "—"}</td>
                <td className="py-3 px-4">
                  {s.emailVerified && <span className="text-green-400 text-xs mr-2">Email ✓</span>}
                  {s.phoneVerified && <span className="text-green-400 text-xs">SMS ✓</span>}
                  {!s.emailVerified && !s.phoneVerified && <span className="text-amber-400 text-xs">Pending</span>}
                </td>
                <td className="py-3 px-4 text-brand-muted text-xs">
                  {s.enrollments.map((e, i) => (
                    <div key={i}>{e.course.title} ({e.status}/{e.paymentStatus})</div>
                  ))}
                </td>
                <td className="py-3 px-4 text-brand-muted text-xs">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
