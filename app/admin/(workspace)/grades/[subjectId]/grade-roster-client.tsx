"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ShieldAlert, Users } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/page-header";
import { Panel, DetailList } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStaffName, getStudentById, TODAY } from "@/lib/admin/mock-data";
import { useStaffSession } from "@/lib/admin/staff-session";
import { formatThaiDateLong } from "@/lib/admin/format";
import { GRADE_VALUES, getRegistrationForEntry, summarizeSubjectGrades } from "@/lib/admin/mock-grades";
import type { GradeEntry, GradeValue } from "@/lib/admin/types";
import type { Subject } from "@/lib/discovery/types";

type GradeRosterClientProps = {
  subject: Subject;
  initialEntries: GradeEntry[];
};

type RosterRow = {
  entry: GradeEntry;
  studentId: string;
  studentName: string;
  studentCode: string;
  term: string;
};

function AccessDenied({ subject }: { subject: Subject }) {
  return (
    <>
      <PageHeader title={subject.name} backHref="/admin/grades" backLabel="กลับไปรายวิชาที่ต้องกรอกผลการเรียน" />
      <Panel>
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--ink-subtle)]">
            <ShieldAlert className="size-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <p className="text-sm font-semibold">ไม่มีสิทธิ์เข้าถึงหน้านี้</p>
            <p className="mx-auto max-w-[46ch] text-sm leading-6 text-[var(--ink-muted)]">
              อาจารย์เห็นได้เฉพาะรายวิชาที่ตนเองรับผิดชอบ รายวิชานี้ไม่ได้อยู่ในความรับผิดชอบของท่าน
            </p>
          </div>
        </div>
      </Panel>
    </>
  );
}

export function GradeRosterClient({ subject, initialEntries }: GradeRosterClientProps) {
  const { role, staff } = useStaffSession();
  const [entries, setEntries] = useState<GradeEntry[]>(initialEntries);

  const rows: RosterRow[] = useMemo(
    () =>
      entries.map((entry) => {
        const registration = getRegistrationForEntry(entry);
        const student = getStudentById(entry.studentId);
        return {
          entry,
          studentId: entry.studentId,
          studentName: student?.name ?? "ไม่พบข้อมูลผู้เรียน",
          studentCode: student?.studentCode ?? "—",
          term: registration?.term ?? entry.term,
        };
      }),
    [entries],
  );

  const summary = useMemo(() => summarizeSubjectGrades(entries), [entries]);
  const isEnteringStage = summary.state === "not-entered" || summary.state === "draft";
  const isSubmittedStage = summary.state === "submitted";
  const isPublishedStage = summary.state === "published";
  const canSubmit = summary.total > 0 && summary.outstanding === 0 && isEnteringStage;

  const isDeniedTeacher = role === "teacher" && !(staff?.teacherId && subject.teacherIds?.includes(staff.teacherId));

  function handleGradeChange(registrationId: string, grade: GradeValue) {
    setEntries((prev) =>
      prev.map((e) => (e.registrationId === registrationId ? { ...e, grade, state: "draft" } : e)),
    );
  }

  function handleSubmit() {
    setEntries((prev) =>
      prev.map((e) => ({ ...e, state: "submitted", recordedByStaffId: staff?.id, recordedAt: TODAY })),
    );
    toast.success("ส่งผลการเรียนแล้ว รอเผยแพร่", {
      description: `${subject.name} · ${summary.total} คน — ยังไม่เผยแพร่ให้ผู้เรียนเห็น`,
    });
  }

  function handleRevertToDraft() {
    setEntries((prev) => prev.map((e) => ({ ...e, state: "draft" })));
    toast("ดึงกลับมาแก้ไขอีกครั้งแล้ว", {
      description: `${subject.name} — ยังไม่เผยแพร่ แก้ไขเกรดแล้วส่งใหม่ได้ทุกเมื่อ`,
    });
  }

  function handlePublish() {
    setEntries((prev) =>
      prev.map((e) => ({ ...e, state: "published", recordedByStaffId: staff?.id, recordedAt: TODAY })),
    );
    toast.success("เผยแพร่ผลการเรียนแล้ว", {
      description: `${subject.name} · ผู้เรียน ${summary.total} คนเห็นผลการเรียนนี้แล้ว และหน่วยกิตถูกบันทึกเข้าหน่วยกิตสะสม`,
    });
  }

  if (role !== "super-admin" && role !== "teacher") {
    return <AccessDenied subject={subject} />;
  }
  if (isDeniedTeacher) {
    return <AccessDenied subject={subject} />;
  }

  const columns: Column<RosterRow>[] = [
    {
      key: "student",
      header: "ผู้เรียน",
      cell: (row) => (
        <Link
          href={`/admin/students/${row.studentId}`}
          className="-mx-1 inline-flex flex-col rounded px-1 py-0.5 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className="font-medium hover:underline">{row.studentName}</span>
          <span className="text-xs text-[var(--ink-subtle)]">{row.studentCode}</span>
        </Link>
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
      key: "grade",
      header: "เกรด",
      align: "end",
      width: "w-40",
      cell: (row) => {
        if (!isEnteringStage) {
          return (
            <span className="font-mono text-sm font-semibold tabular-nums">
              {row.entry.grade ?? "ยังไม่ระบุ"}
            </span>
          );
        }
        return (
          <div className="flex justify-end">
            <Label htmlFor={`grade-${row.studentId}`} className="sr-only">
              เกรดของ {row.studentName}
            </Label>
            <Select
              value={row.entry.grade ?? undefined}
              onValueChange={(value) => handleGradeChange(row.entry.registrationId, value as GradeValue)}
            >
              <SelectTrigger id={`grade-${row.studentId}`} size="sm" className="h-8 w-24 font-mono">
                <SelectValue placeholder="ยังไม่ระบุ" />
              </SelectTrigger>
              <SelectContent>
                {GRADE_VALUES.map((grade) => (
                  <SelectItem key={grade} value={grade} className="font-mono">
                    {grade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <PageHeader
        title={subject.name}
        description={`${subject.code ? `${subject.code} · ` : ""}กรอกแล้ว ${summary.entered} จาก ${summary.total} คน`}
        backHref="/admin/grades"
        backLabel="กลับไปรายวิชาที่ต้องกรอกผลการเรียน"
        actions={
          isEnteringStage ? (
            <Button size="sm" disabled={!canSubmit} onClick={handleSubmit}>
              ส่งผลการเรียน
            </Button>
          ) : isSubmittedStage ? (
            <>
              <Button size="sm" variant="outline" onClick={handleRevertToDraft}>
                แก้ไขอีกครั้ง
              </Button>
              <ConfirmDialog
                trigger={<Button size="sm">เผยแพร่ผลการเรียน</Button>}
                title="ยืนยันการเผยแพร่ผลการเรียน"
                description={`จะเผยแพร่ผลการเรียนของผู้เรียน ${summary.total} คนในรายวิชา ${subject.name} ผู้เรียนจะเห็นเกรดของตนเองทันที และหน่วยกิตจะถูกบันทึกเข้าหน่วยกิตสะสม การเผยแพร่แล้วไม่สามารถแก้ไขเกรดย้อนหลังในหน้านี้ได้อีก`}
                confirmLabel="เผยแพร่ผลการเรียน"
                onConfirm={handlePublish}
              />
            </>
          ) : null
        }
      />

      {isEnteringStage && !canSubmit ? (
        <p className="-mt-2 text-xs text-[var(--ink-subtle)]">
          {summary.outstanding > 0
            ? `ต้องกรอกเกรดให้ครบทุกคนก่อนจึงจะส่งผลการเรียนได้ (เหลืออีก ${summary.outstanding} คนที่ยังไม่มีเกรด)`
            : "ยังไม่มีผู้เรียนในรายวิชานี้ที่ต้องกรอกผลการเรียน"}
        </p>
      ) : null}

      {isPublishedStage ? (
        <Panel title="สถานะการเผยแพร่">
          <DetailList
            rows={[
              { label: "เผยแพร่โดย", value: getStaffName(entries[0]?.recordedByStaffId) },
              {
                label: "วันที่เผยแพร่",
                value: entries[0]?.recordedAt ? formatThaiDateLong(entries[0].recordedAt) : "—",
              },
            ]}
          />
        </Panel>
      ) : null}

      <Panel title="รายชื่อผู้เรียน" description={`${summary.total} คนลงทะเบียนในรายวิชานี้`} flush>
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(row) => row.entry.id}
          caption={`รายชื่อผู้เรียนของรายวิชา ${subject.name}`}
          empty={
            <EmptyState
              icon={Users}
              title="ไม่มีผู้เรียนที่ต้องกรอกผลการเรียน"
              description="รายวิชานี้ยังไม่มีผู้เรียนที่กำลังศึกษาอยู่หรือเรียนจบแล้ว"
            />
          }
        />
      </Panel>
    </>
  );
}
