import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportRow {
  [key: string]: string | number | null | undefined;
}

export function formatExportTimestamp() {
  return new Date().toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "long",
    timeZone: "Africa/Monrovia",
  });
}

export function exportToExcel(
  rows: ExportRow[],
  sheetName: string,
  filename: string
) {
  const header = [[`Exported: ${formatExportTimestamp()}`], []];
  const ws = XLSX.utils.aoa_to_sheet(header);
  XLSX.utils.sheet_add_json(ws, rows, { origin: "A3" });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
  return { buffer: buf, filename: `${filename}.xlsx`, mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
}

export function exportToPdf(
  rows: ExportRow[],
  title: string,
  filename: string,
  columns: string[]
) {
  const doc = new jsPDF({ orientation: columns.length > 6 ? "landscape" : "portrait" });
  doc.setFontSize(16);
  doc.text(title, 14, 18);
  doc.setFontSize(9);
  doc.text(`Exported: ${formatExportTimestamp()}`, 14, 26);

  const tableData = rows.map((row) =>
    columns.map((col) => String(row[col] ?? ""))
  );

  autoTable(doc, {
    head: [columns],
    body: tableData,
    startY: 32,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [26, 60, 110] },
  });

  const buf = Buffer.from(doc.output("arraybuffer"));
  return { buffer: buf, filename: `${filename}.pdf`, mime: "application/pdf" };
}
