import { parse as parseCsv } from "csv-parse/sync";
import XLSX from "xlsx";

export function parseCSVBuffer(buffer: Buffer) {
  const text = buffer.toString("utf8");
  const rows = parseCsv(text, { columns: true, skip_empty_lines: true });
  return rows;
}

export function parseXLSXBuffer(buffer: Buffer) {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const json = XLSX.utils.sheet_to_json(sheet, { defval: null });
  return json;
}

function getField(row: any, key: string) {
  return (
    row[key] ||
    row[key.toLowerCase()] ||
    row[key.toUpperCase()] ||
    row[key.replace(/ /g, "_")] ||
    ""
  );
}

export function validateStudentRow(row: any) {
  const required = ["Name", "Class", "Academic_Year", "student_id", "School_Code"];
  const missing = required.filter((k) => !getField(row, k));
  return { ok: missing.length === 0, missing };
}

export function validateTeacherRow(row: any) {
  const required = ["Name", "Teacher_ID", "Academic_Year", "School_Code", "Designation"];
  const missing = required.filter((k) => !getField(row, k));
  return { ok: missing.length === 0, missing };
}
