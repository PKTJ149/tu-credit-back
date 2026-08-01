"use client";

import { useMemo, useState } from "react";
import { FileBadge, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE, type ToolbarFilter } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { subjectEnrolment } from "@/lib/admin/mock-academic";
import { gradeEntries, gradeStateInfo, summarizeSubjectGrades, type SubjectGradeSummary } from "@/lib/admin/mock-grades";
import { useStaffSession } from "@/lib/admin/staff-session";
import { subjects } from "@/lib/data/subjects";
import type { Subject } from "@/lib/discovery/types";

type SubjectRow = {
  subject: Subject;
  term: string;
  summary: SubjectGradeSummary;
};

function buildRows(): SubjectRow[] {
  const bySubject = new Map<string, typeof gradeEntries>();
  for (const entry of gradeEntries) {
    const list = bySubject.get(entry.subjectId) ?? [];
    list.push(entry);
    bySubject.set(entry.subjectId, list);
  }

  const rows: SubjectRow[] = [];
  for (const [subjectId, entries] of bySubject) {
    const subject = subjects.find((s) => s.id === subjectId);
    if (!subject) continue;
    rows.push({ subject, term: entries[0].term, summary: summarizeSubjectGrades(entries) });
  }
  return rows;
}

function AccessDenied() {
  return (
    <>
      <PageHeader title="บันทึกผลการเรียน" />
      <Panel>
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--ink-subtle)]">
            <ShieldAlert className="size-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold">ไม่มีสิทธิ์เข้าถึงหน้านี้</p>
            <p className="mx-auto max-w-[46ch] text-sm leading-6 text-[var(--ink-muted)]">
              การบันทึกผลการเรียนเปิดให้เฉพาะผู้ดูแลระบบสูงสุดและอาจารย์ผู้สอนเท่านั้น
            </p>
          </div>
        </div>
      </Panel>
    </>
  );
}

export default function GradesPage() {
  const { role, staff } = useStaffSession();
  const [search, setSearch] = useState("");
  const [state, setState] = useState(ALL_FILTER_VALUE);

  const allRows = useMemo(() => buildRows(), []);

  const visibleRows = useMemo(() => {
    if (role === "teacher") {
      return allRows.filter((row) => staff?.teacherId && row.subject.teacherIds?.includes(staff.teacherId));
    }
    return allRows;
  }, [allRows, role, staff]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return visibleRows.filter((row) => {
      if (state !== ALL_FILTER_VALUE && row.summary.state !== state) return false;
      if (!q) return true;
      return (
        row.subject.name.toLowerCase().includes(q) ||
        (row.subject.code ?? "").toLowerCase().includes(q) ||
        row.term.toLowerCase().includes(q)
      );
    });
  }, [visibleRows, search, state]);

  if (role !== "super-admin" && role !== "teacher") {
    return <AccessDenied />;
  }

  const columns: Column<SubjectRow>[] = [
    {
      key: "subject",
      header: "รายวิชา",
      truncate: "max-w-[32ch]",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.subject.name}</p>
          {row.subject.code ? <p className="font-mono text-xs text-[var(--ink-subtle)]">{row.subject.code}</p> : null}
        </div>
      ),
    },
    {
      key: "term",
      header: "ภาคการศึกษา",
      hideOnMobile: true,
      width: "w-32",
      cell: (row) => row.term,
    },
    {
      key: "enrolled",
      header: "กำลังเรียน",
      align: "end",
      width: "w-28",
      hideOnMobile: true,
      /**
       * Deliberately labelled "กำลังเรียน", not "ผู้ลงทะเบียน".
       *
       * `subjectEnrolment` counts learners currently studying (active plus
       * awaiting-payment); the roster next to it counts learners a grade can be
       * recorded for (active plus completed). A subject whose whole cohort has
       * finished therefore reads 0 here and 3 there — which looked like a
       * contradiction until both columns said what they actually measure.
       */
      cell: (row) => <span className="font-mono tabular-nums">{subjectEnrolment(row.subject).enrolled}</span>,
    },
    {
      key: "progress",
      header: "กรอกเกรดแล้ว / ทั้งห้อง",
      align: "end",
      width: "w-40",
      cell: (row) => (
        <span className="font-mono tabular-nums">
          {row.summary.entered}/{row.summary.total}
        </span>
      ),
    },
    {
      key: "state",
      header: "สถานะการกรอก",
      width: "w-40",
      cell: (row) => <StatusBadge label={gradeStateInfo[row.summary.state].label} tone={gradeStateInfo[row.summary.state].tone} />,
    },
  ];

  const filters: ToolbarFilter[] = [
    {
      id: "state",
      label: "สถานะการกรอก",
      value: state,
      onChange: setState,
      options: [
        { value: ALL_FILTER_VALUE, label: "ทุกสถานะ" },
        ...(Object.keys(gradeStateInfo) as Array<keyof typeof gradeStateInfo>).map((key) => ({
          value: key,
          label: gradeStateInfo[key].label,
        })),
      ],
    },
  ];

  return (
    <>
      <PageHeader
        title="บันทึกผลการเรียน"
        description={
          role === "teacher"
            ? "รายวิชาที่ท่านรับผิดชอบซึ่งมีผู้เรียนลงทะเบียนหรือเรียนจบแล้ว เลือกรายวิชาเพื่อกรอกและเผยแพร่ผลการเรียน"
            : "ทุกรายวิชาที่มีผู้เรียนกำลังศึกษาหรือเรียนจบแล้ว เลือกรายวิชาเพื่อกรอกและเผยแพร่ผลการเรียน"
        }
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchLabel="ค้นหารายวิชา"
        searchPlaceholder="ค้นหาชื่อ รหัสวิชา หรือภาคการศึกษา"
        filters={filters}
        onReset={() => {
          setSearch("");
          setState(ALL_FILTER_VALUE);
        }}
        resultSummary={`แสดง ${filtered.length} จาก ${visibleRows.length} รายการ`}
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.subject.id}
        rowHref={(row) => `/admin/grades/${row.subject.id}`}
        caption="รายวิชาที่ต้องบันทึกผลการเรียน"
        empty={
          visibleRows.length === 0 ? (
            <EmptyState
              icon={FileBadge}
              title={role === "teacher" ? "ยังไม่มีรายวิชาที่ต้องกรอกผลการเรียน" : "ยังไม่มีรายวิชาที่ต้องกรอกผลการเรียน"}
              description="รายวิชาจะปรากฏที่นี่เมื่อมีผู้เรียนกำลังศึกษาอยู่หรือเรียนจบแล้ว"
            />
          ) : (
            <EmptyState
              icon={FileBadge}
              title="ไม่พบรายวิชาที่ตรงกับตัวกรอง"
              description="ลองปรับคำค้นหาหรือตัวกรองสถานะด้านบน"
            />
          )
        }
      />
    </>
  );
}
