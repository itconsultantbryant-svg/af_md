"use client";

import { Download, FileSpreadsheet, FileText } from "lucide-react";

function ExportButton({
  label,
  href,
  icon: Icon,
}: {
  label: string;
  href: string;
  icon: React.ElementType;
}) {
  return (
    <a
      href={href}
      download
      className="flex items-center gap-3 glass-card p-5 hover:border-brand-gold/30 transition-colors"
    >
      <Icon className="w-8 h-8 text-brand-gold" />
      <div>
        <p className="font-medium text-white">{label}</p>
        <p className="text-brand-muted text-xs mt-0.5">Includes date & time stamp</p>
      </div>
      <Download className="w-4 h-4 text-brand-muted ml-auto" />
    </a>
  );
}

export default function AdminExportPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-2">Export Data</h1>
      <p className="text-brand-muted text-sm mb-8">
        Download student registrations and payment records with timestamps.
      </p>

      <div className="grid md:grid-cols-2 gap-4 max-w-2xl">
        <h2 className="md:col-span-2 font-display text-lg text-white">Student Registrations</h2>
        <ExportButton label="Excel (.xlsx)" href="/api/export/enrollments?format=excel" icon={FileSpreadsheet} />
        <ExportButton label="PDF" href="/api/export/enrollments?format=pdf" icon={FileText} />

        <h2 className="md:col-span-2 font-display text-lg text-white mt-6">Payment Records</h2>
        <ExportButton label="Excel (.xlsx)" href="/api/export/payments?format=excel" icon={FileSpreadsheet} />
        <ExportButton label="PDF" href="/api/export/payments?format=pdf" icon={FileText} />
      </div>
    </div>
  );
}
