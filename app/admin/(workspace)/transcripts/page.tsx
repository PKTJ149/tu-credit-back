"use client";

import { useMemo, useState } from "react";
import { FileWarning } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { Panel, DetailList } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatThaiDateLong } from "@/lib/admin/format";
import { students, TODAY } from "@/lib/admin/mock-data";
import { GRADE_POINTS, getStudentAcademicSummary, isPassingGrade, type GradeBreakdownRow } from "@/lib/admin/mock-grades";
import type { GradeValue } from "@/lib/admin/types";

type TermGroup = { term: string; rows: GradeBreakdownRow[] };

function groupByTerm(rows: GradeBreakdownRow[]): TermGroup[] {
  const map = new Map<string, GradeBreakdownRow[]>();
  for (const row of rows) {
    const list = map.get(row.entry.term) ?? [];
    list.push(row);
    map.set(row.entry.term, list);
  }
  return Array.from(map.entries()).map(([term, groupRows]) => ({ term, rows: groupRows }));
}

function termStats(rows: GradeBreakdownRow[]) {
  const creditsAttempted = rows.reduce((sum, r) => sum + r.credits, 0);
  const publishedRows = rows.filter((r) => r.entry.state === "published");
  const creditsEarned = publishedRows.filter((r) => isPassingGrade(r.entry.grade)).reduce((sum, r) => sum + r.credits, 0);
  const gpaRows = publishedRows.filter((r) => r.entry.grade !== undefined && GRADE_POINTS[r.entry.grade] !== null);
  const totalPoints = gpaRows.reduce(
    (sum, r) => sum + (GRADE_POINTS[r.entry.grade as GradeValue] as number) * r.credits,
    0,
  );
  const gpaCredits = gpaRows.reduce((sum, r) => sum + r.credits, 0);
  return { creditsAttempted, creditsEarned, gpa: gpaCredits > 0 ? totalPoints / gpaCredits : null };
}

export default function TranscriptsPage() {
  const [studentId, setStudentId] = useState(students[0]?.id ?? "");
  const student = students.find((s) => s.id === studentId);
  const summary = useMemo(() => getStudentAcademicSummary(studentId), [studentId]);
  const termGroups = useMemo(() => groupByTerm(summary.breakdown), [summary]);

  function handleIssue() {
    toast("ต้นแบบนี้ยังไม่สร้างไฟล์ PDF จริง", {
      description: "ในระบบจริง ปุ่มนี้จะสร้างเอกสาร PDF ที่ลงลายเซ็นอิเล็กทรอนิกส์ และบันทึกประวัติการออกเอกสารให้ผู้เรียนดาวน์โหลด",
    });
  }

  const columns: Column<GradeBreakdownRow>[] = [
    {
      key: "subject",
      header: "รายวิชา",
      truncate: "max-w-[32ch]",
      cell: (row) => row.subjectName,
    },
    {
      key: "code",
      header: "รหัสวิชา",
      width: "w-28",
      hideOnMobile: true,
      cell: (row) => <span className="font-mono text-xs">{row.subjectCode ?? "—"}</span>,
    },
    {
      key: "credits",
      header: "หน่วยกิต",
      align: "end",
      width: "w-20",
      cell: (row) => <span className="font-mono">{row.credits}</span>,
    },
    {
      key: "grade",
      header: "เกรด",
      align: "end",
      width: "w-20",
      cell: (row) => (
        <span className="font-mono font-semibold">
          {row.entry.state === "published" ? (row.entry.grade ?? "—") : "รอประกาศผล"}
        </span>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="ใบแสดงผลการเรียน"
        description="เลือกผู้เรียนเพื่อดูตัวอย่างเอกสารใบแสดงผลการเรียนที่ระบบจะออกให้ ตามข้อมูลผลการเรียนที่มีอยู่ในระบบนี้"
      />

      <Panel title="เลือกผู้เรียน">
        <div className="max-w-sm space-y-1.5">
          <Label htmlFor="transcript-student">ผู้เรียน</Label>
          <Select value={studentId} onValueChange={setStudentId}>
            <SelectTrigger id="transcript-student" className="w-full">
              <SelectValue placeholder="เลือกผู้เรียน" />
            </SelectTrigger>
            <SelectContent>
              {students.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name} · {s.studentCode}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Panel>

      <Panel
        title="เอกสารใบแสดงผลการเรียน"
        description="ตัวอย่างเอกสารตามรูปแบบที่จะออกจริง"
        actions={<Button onClick={handleIssue}>ออกใบแสดงผลการเรียน</Button>}
      >
        <div className="space-y-6">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-center">
            <p className="text-sm font-semibold">มหาวิทยาลัยธรรมศาสตร์ · Thammasat University Credit Bank</p>
            <p className="text-xs text-[var(--ink-muted)]">ใบแสดงผลการเรียน (Transcript of Academic Records)</p>
          </div>

          {student ? (
            <DetailList
              rows={[
                { label: "ชื่อ-นามสกุล", value: student.name },
                { label: "รหัสผู้เรียน", value: <span className="font-mono">{student.studentCode}</span> },
                { label: "คณะ", value: student.faculty },
                { label: "ระดับการศึกษา", value: student.educationLevel },
                { label: "วันที่ออกเอกสาร", value: formatThaiDateLong(TODAY) },
              ]}
            />
          ) : null}

          {termGroups.length === 0 ? (
            <EmptyState
              icon={FileWarning}
              title="ยังไม่มีผลการเรียนในระบบสำหรับผู้เรียนคนนี้"
              description="ผู้เรียนคนนี้ยังไม่มีรายวิชาที่มีบันทึกผลการเรียนในระบบดิจิทัลนี้ — หน่วยกิตสะสมในประวัติเดิมอาจยังมีอยู่ในระบบทะเบียนแต่ไม่ปรากฏในเอกสารนี้"
            />
          ) : (
            <div className="space-y-5">
              {termGroups.map((group) => {
                const stats = termStats(group.rows);
                return (
                  <div key={group.term} className="space-y-2">
                    <h3 className="text-sm font-semibold">{group.term}</h3>
                    <DataTable
                      columns={columns}
                      rows={group.rows}
                      rowKey={(row) => row.entry.id}
                      caption={`รายวิชาภาคการศึกษา ${group.term}`}
                      empty={<p className="px-5 py-6 text-center text-sm text-[var(--ink-muted)]">ไม่มีรายวิชา</p>}
                    />
                    <p className="flex flex-wrap gap-x-6 text-xs text-[var(--ink-muted)]">
                      <span>
                        หน่วยกิตภาคการศึกษานี้{" "}
                        <span className="font-mono font-semibold text-[var(--foreground)]">{stats.creditsAttempted}</span>
                      </span>
                      <span>
                        หน่วยกิตที่ผ่าน{" "}
                        <span className="font-mono font-semibold text-[var(--foreground)]">{stats.creditsEarned}</span>
                      </span>
                      <span>
                        GPA ภาคการศึกษานี้{" "}
                        <span className="font-mono font-semibold text-[var(--foreground)]">
                          {stats.gpa === null ? "—" : stats.gpa.toFixed(2)}
                        </span>
                      </span>
                    </p>
                  </div>
                );
              })}

              <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1 border-t border-[var(--border)] pt-3 text-sm">
                <span className="text-[var(--ink-muted)]">
                  หน่วยกิตสะสมทั้งหมด (ในระบบนี้){" "}
                  <span className="font-mono font-semibold text-[var(--foreground)]">{summary.creditsFromPublished}</span>
                </span>
                <span className="text-[var(--ink-muted)]">
                  GPA สะสม{" "}
                  <span className="font-mono font-semibold text-[var(--foreground)]">
                    {summary.gpa === null ? "—" : summary.gpa.toFixed(2)}
                  </span>
                </span>
              </div>
            </div>
          )}

          <p className="text-xs leading-5 text-[var(--ink-subtle)]">
            ต้นแบบนี้แสดงตัวอย่างเอกสารเท่านั้น ยังไม่รองรับการสร้างไฟล์ PDF จริง — ปุ่ม &ldquo;ออกใบแสดงผลการเรียน&rdquo; ด้านบนจะอธิบายสิ่งที่ระบบจริงจะทำแทน
          </p>
        </div>
      </Panel>
    </>
  );
}
