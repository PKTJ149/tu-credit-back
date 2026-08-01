"use client";

import { useMemo, useState } from "react";
import { Award, GraduationCap } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { students } from "@/lib/admin/mock-data";
import type { AdminStudent } from "@/lib/admin/types";
import { GRADE_POINTS, GRADE_VALUES, getStudentAcademicSummary, type GradeBreakdownRow } from "@/lib/admin/mock-grades";

type CreditsRow = {
  student: AdminStudent;
  creditsBanked: number;
  creditsInProgress: number;
  gpa: number | null;
  gpaCreditBasis: number;
};

type BreakdownRow = GradeBreakdownRow & { studentName: string; studentCode: string };

export default function CreditsPage() {
  const [search, setSearch] = useState("");

  const rows: CreditsRow[] = useMemo(
    () =>
      students.map((student) => {
        const summary = getStudentAcademicSummary(student.id);
        return {
          student,
          creditsBanked: student.accumulatedCredits,
          creditsInProgress: summary.creditsInProgress,
          gpa: summary.gpa,
          gpaCreditBasis: summary.gpaCreditBasis,
        };
      }),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.student.name.toLowerCase().includes(q) || row.student.studentCode.toLowerCase().includes(q),
    );
  }, [rows, search]);

  const breakdownRows: BreakdownRow[] = useMemo(() => {
    const all: BreakdownRow[] = [];
    for (const student of students) {
      const summary = getStudentAcademicSummary(student.id);
      // Only published rows actually count toward the credits and GPA shown
      // above — a not-yet-graded or not-yet-published entry would read as
      // "contributing" a blank grade, which is not what this panel promises.
      for (const row of summary.breakdown.filter((r) => r.entry.state === "published")) {
        all.push({ ...row, studentName: student.name, studentCode: student.studentCode });
      }
    }
    return all.sort((a, b) => a.studentName.localeCompare(b.studentName, "th") || a.entry.term.localeCompare(b.entry.term, "th"));
  }, []);

  const summaryColumns: Column<CreditsRow>[] = [
    {
      key: "student",
      header: "ผู้เรียน",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.student.name}</p>
          <p className="font-mono text-xs text-[var(--ink-subtle)]">{row.student.studentCode}</p>
        </div>
      ),
    },
    {
      key: "faculty",
      header: "คณะ",
      truncate: "max-w-[24ch]",
      hideOnMobile: true,
      cell: (row) => row.student.faculty,
    },
    {
      key: "banked",
      header: "หน่วยกิตสะสม",
      align: "end",
      width: "w-32",
      cell: (row) => <span className="font-mono tabular-nums">{row.creditsBanked}</span>,
    },
    {
      key: "inProgress",
      header: "กำลังเรียน",
      align: "end",
      width: "w-28",
      cell: (row) => (
        <span className="font-mono tabular-nums text-[var(--ink-muted)]">
          {row.creditsInProgress > 0 ? row.creditsInProgress : "—"}
        </span>
      ),
    },
    {
      key: "gpa",
      header: "GPA",
      align: "end",
      width: "w-24",
      cell: (row) =>
        row.gpa === null ? (
          <span className="text-xs text-[var(--ink-subtle)]">ไม่มีข้อมูล</span>
        ) : (
          <span className="font-mono text-sm font-semibold tabular-nums">{row.gpa.toFixed(2)}</span>
        ),
    },
  ];

  const breakdownColumns: Column<BreakdownRow>[] = [
    {
      key: "student",
      header: "ผู้เรียน",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.studentName}</p>
          <p className="font-mono text-xs text-[var(--ink-subtle)]">{row.studentCode}</p>
        </div>
      ),
    },
    {
      key: "subject",
      header: "รายวิชา",
      truncate: "max-w-[28ch]",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate">{row.subjectName}</p>
          {row.subjectCode ? <p className="font-mono text-xs text-[var(--ink-subtle)]">{row.subjectCode}</p> : null}
        </div>
      ),
    },
    {
      key: "term",
      header: "ภาคการศึกษา",
      hideOnMobile: true,
      width: "w-32",
      cell: (row) => row.entry.term,
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
      cell: (row) => <span className="font-mono font-semibold">{row.entry.grade ?? "—"}</span>,
    },
    {
      key: "points",
      header: "แต้มระดับคะแนน",
      align: "end",
      width: "w-32",
      cell: (row) => {
        const points = row.entry.grade ? GRADE_POINTS[row.entry.grade] : null;
        return (
          <span className="font-mono tabular-nums text-[var(--ink-muted)]">
            {points === null || points === undefined ? "ไม่นับ" : points.toFixed(1)}
          </span>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="หน่วยกิตสะสม"
        description="หน่วยกิตที่บันทึกไว้ในระบบทะเบียน หน่วยกิตที่กำลังศึกษาอยู่ และ GPA ที่คำนวณจากผลการเรียนที่เผยแพร่แล้วในระบบนี้"
      />

      <Panel
        title="เกณฑ์แต้มระดับคะแนนที่ใช้คำนวณ GPA"
        description="มาตราส่วน 4.0 มาตรฐาน ใช้กับเกรดทุกค่าที่บันทึกในระบบนี้ — W และ I ไม่นับรวมในหน่วยกิตหรือแต้มสะสม"
      >
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {GRADE_VALUES.map((grade) => (
            <div key={grade} className="flex items-baseline gap-1.5">
              <dt className="font-mono font-semibold">{grade}</dt>
              <dd className="font-mono text-[var(--ink-muted)] tabular-nums">
                {GRADE_POINTS[grade] === null ? "ไม่นับ" : GRADE_POINTS[grade]?.toFixed(1)}
              </dd>
            </div>
          ))}
        </dl>
      </Panel>

      <Panel title="หน่วยกิตสะสมรายผู้เรียน" flush>
        <div className="border-b border-[var(--border)] px-5 py-4">
          <TableToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchLabel="ค้นหาผู้เรียน"
            searchPlaceholder="ค้นหาชื่อหรือรหัสผู้เรียน"
            resultSummary={`แสดง ${filtered.length} จาก ${rows.length} คน`}
          />
        </div>
        <div className="p-5 pt-4">
          <DataTable
            columns={summaryColumns}
            rows={filtered}
            rowKey={(row) => row.student.id}
            rowHref={(row) => `/admin/students/${row.student.id}`}
            caption="หน่วยกิตสะสมของผู้เรียนแต่ละคน"
            empty={
              <EmptyState
                icon={Award}
                title="ไม่พบผู้เรียนที่ตรงกับคำค้นหา"
                description="ลองค้นหาด้วยชื่อหรือรหัสผู้เรียนอื่น"
              />
            }
          />
        </div>
      </Panel>

      <Panel
        title="รายวิชาที่นับหน่วยกิตและ GPA"
        description="รายวิชาที่มีผลการเรียนบันทึกในระบบนี้ ไล่ตามผู้เรียนแต่ละคน — นี่คือที่มาของตัวเลขหน่วยกิตและ GPA ด้านบน"
        flush
      >
        <DataTable
          columns={breakdownColumns}
          rows={breakdownRows}
          rowKey={(row) => row.entry.id}
          caption="รายวิชาที่นับหน่วยกิตและ GPA ของผู้เรียนแต่ละคน"
          empty={
            <EmptyState
              icon={GraduationCap}
              title="ยังไม่มีผลการเรียนในระบบ"
              description="เมื่ออาจารย์กรอกและเผยแพร่ผลการเรียนจากหน้าบันทึกผลการเรียน รายวิชาจะปรากฏที่นี่"
            />
          }
        />
      </Panel>

      <p className="text-xs leading-5 text-[var(--ink-subtle)]">
        หน่วยกิตสะสมคือยอดทางการจากระบบทะเบียน ซึ่งอาจมากกว่าหน่วยกิตที่มีผลการเรียนบันทึกในระบบนี้ เนื่องจากประวัติการเรียนก่อนหน้านี้ยังไม่ได้แปลงเป็นข้อมูลดิจิทัลทั้งหมด
      </p>
    </>
  );
}
