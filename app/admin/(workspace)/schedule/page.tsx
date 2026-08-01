"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, MapPin, Pencil, Plus, Video } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { DataTable, type Column } from "@/components/admin/data-table";
import { TableToolbar, ALL_FILTER_VALUE } from "@/components/admin/table-toolbar";
import { EmptyState } from "@/components/admin/empty-state";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { scheduleStatusLabel, scheduleStatusTone } from "@/lib/admin/mock-academic";
import {
  getScheduleSessions,
  getSubjectsWithSchedule,
  thaiDateSortKey,
  type ScheduleSession,
} from "@/lib/admin/mock-schedule";
import type { ScheduleItem } from "@/lib/discovery/types";
import { SessionSheet, type SessionFormValues } from "./session-sheet";

/** The next status in the upcoming → ongoing → completed progression, or
 *  `null` once a session is completed — there is nowhere further to advance. */
const NEXT_STATUS: Partial<Record<ScheduleItem["status"], ScheduleItem["status"]>> = {
  upcoming: "ongoing",
  ongoing: "completed",
};

const STATUS_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: "ทุกสถานะ" },
  { value: "upcoming", label: scheduleStatusLabel.upcoming },
  { value: "ongoing", label: scheduleStatusLabel.ongoing },
  { value: "completed", label: scheduleStatusLabel.completed },
];

const MODE_FILTER_OPTIONS = [
  { value: ALL_FILTER_VALUE, label: "ทุกรูปแบบ" },
  { value: "online", label: "ออนไลน์" },
  { value: "onsite", label: "ในสถานที่" },
];

type SheetState = { mode: "add" | "edit"; session?: ScheduleSession };

export default function SchedulePage() {
  const [sessions, setSessions] = useState<ScheduleSession[]>(() => getScheduleSessions());
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState(ALL_FILTER_VALUE);
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER_VALUE);
  const [modeFilter, setModeFilter] = useState(ALL_FILTER_VALUE);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetState, setSheetState] = useState<SheetState>({ mode: "add" });

  const subjectOptions = useMemo(
    () =>
      getSubjectsWithSchedule().map((s) => ({
        value: s.id,
        label: s.code ? `${s.name} (${s.code})` : s.name,
      })),
    [],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sessions
      .filter((s) => subjectFilter === ALL_FILTER_VALUE || s.subjectId === subjectFilter)
      .filter((s) => statusFilter === ALL_FILTER_VALUE || s.status === statusFilter)
      .filter((s) => modeFilter === ALL_FILTER_VALUE || s.mode === modeFilter)
      .filter((s) => !q || [s.topic, s.teacher, s.subjectName].some((v) => v.toLowerCase().includes(q)))
      .sort(
        (a, b) =>
          thaiDateSortKey(a.date) - thaiDateSortKey(b.date) ||
          (a.time ?? "").localeCompare(b.time ?? "") ||
          a.subjectName.localeCompare(b.subjectName, "th"),
      );
  }, [sessions, search, subjectFilter, statusFilter, modeFilter]);

  const isFiltered =
    search.trim() !== "" || subjectFilter !== ALL_FILTER_VALUE || statusFilter !== ALL_FILTER_VALUE || modeFilter !== ALL_FILTER_VALUE;

  function handleAdvance(session: ScheduleSession) {
    const next = NEXT_STATUS[session.status];
    if (!next) return;
    setSessions((prev) => prev.map((s) => (s.id === session.id ? { ...s, status: next } : s)));
    toast.success(`อัปเดตสถานะคาบเรียนเป็น "${scheduleStatusLabel[next]}" แล้ว`, {
      description: `${session.subjectName} · ${session.topic}`,
    });
  }

  function openAddSheet() {
    setSheetState({ mode: "add" });
    setSheetOpen(true);
  }

  function openEditSheet(session: ScheduleSession) {
    setSheetState({ mode: "edit", session });
    setSheetOpen(true);
  }

  function handleSubmitSession(values: SessionFormValues) {
    const location =
      values.mode === "onsite"
        ? { venue: values.venue.trim(), building: values.building.trim(), room: values.room.trim() }
        : undefined;

    if (sheetState.mode === "edit" && sheetState.session) {
      const target = sheetState.session;
      setSessions((prev) =>
        prev.map((s) =>
          s.id === target.id
            ? {
                ...s,
                date: values.date.trim(),
                time: values.time.trim() || undefined,
                topic: values.topic.trim(),
                teacher: values.teacher.trim(),
                status: values.status,
                mode: values.mode || undefined,
                studyLink: values.mode === "online" ? values.studyLink.trim() : undefined,
                location,
              }
            : s,
        ),
      );
      toast.success("บันทึกการแก้ไขคาบเรียนแล้ว", { description: `${target.subjectName} · ${values.topic}` });
    } else {
      const subject = getSubjectsWithSchedule().find((s) => s.id === values.subjectId);
      if (!subject) return;
      const subjectSessionCount = sessions.filter((s) => s.subjectId === subject.id).length;
      const newSession: ScheduleSession = {
        id: `${subject.id}-new-${subjectSessionCount}`,
        subjectId: subject.id,
        subjectName: subject.name,
        subjectCode: subject.code,
        date: values.date.trim(),
        time: values.time.trim() || undefined,
        topic: values.topic.trim(),
        teacher: values.teacher.trim(),
        status: values.status,
        mode: values.mode || undefined,
        studyLink: values.mode === "online" ? values.studyLink.trim() : undefined,
        location,
      };
      setSessions((prev) => [...prev, newSession]);
      toast.success("เพิ่มคาบเรียนใหม่แล้ว", { description: `${subject.name} · ${values.topic}` });
    }
    setSheetOpen(false);
  }

  const columns: Column<ScheduleSession>[] = [
    {
      key: "date",
      header: "วันที่ / เวลา",
      width: "w-36",
      cell: (row) => (
        <div className="space-y-0.5">
          <p className="font-medium">{row.date}</p>
          {row.time ? <p className="text-xs text-[var(--ink-subtle)]">{row.time}</p> : null}
        </div>
      ),
    },
    {
      key: "subject",
      truncate: "max-w-[24ch]",
      header: "รายวิชา",
      cell: (row) => (
        <div className="min-w-0 space-y-0.5">
          <p className="truncate font-medium">{row.subjectName}</p>
          {row.subjectCode ? <p className="text-xs text-[var(--ink-subtle)]">{row.subjectCode}</p> : null}
        </div>
      ),
    },
    {
      key: "topic",
      truncate: "max-w-[30ch]",
      header: "หัวข้อ",
      cell: (row) => <p className="text-pretty">{row.topic}</p>,
    },
    {
      key: "teacher",
      header: "ผู้สอน",
      hideOnMobile: true,
      cell: (row) => row.teacher,
    },
    {
      key: "mode",
      header: "รูปแบบ",
      hideOnMobile: true,
      cell: (row) =>
        row.mode ? (
          <span className="inline-flex items-center gap-1.5 text-[var(--ink-muted)]">
            {row.mode === "online" ? <Video className="size-3.5" aria-hidden /> : <MapPin className="size-3.5" aria-hidden />}
            {row.mode === "online" ? "ออนไลน์" : "ในสถานที่"}
          </span>
        ) : (
          <span className="text-[var(--ink-subtle)]">ไม่ระบุ</span>
        ),
    },
    {
      key: "status",
      header: "สถานะ",
      cell: (row) => <StatusBadge label={scheduleStatusLabel[row.status]} tone={scheduleStatusTone[row.status]} />,
    },
    {
      key: "actions",
      header: "การดำเนินการ",
      align: "end",
      width: "w-72",
      cell: (row) => (
        <div className="flex flex-wrap items-center justify-end gap-2">
          {NEXT_STATUS[row.status] ? (
            <ConfirmDialog
              trigger={
                <Button size="sm" variant="outline" className="h-8">
                  {row.status === "upcoming" ? "เริ่มคาบเรียน" : "จบคาบเรียน"}
                </Button>
              }
              title={row.status === "upcoming" ? "เริ่มคาบเรียนนี้หรือไม่" : "จบคาบเรียนนี้หรือไม่"}
              description={
                row.status === "upcoming"
                  ? `คาบ "${row.topic}" (${row.subjectName}) จะเปลี่ยนเป็นสถานะ "${scheduleStatusLabel.ongoing}" ทันที ผู้เรียนจะเห็นว่าคาบนี้เริ่มแล้ว`
                  : `คาบ "${row.topic}" (${row.subjectName}) จะเปลี่ยนเป็นสถานะ "${scheduleStatusLabel.completed}" และจะไม่แสดงเป็นคาบที่กำลังเรียนอีก`
              }
              confirmLabel="ยืนยัน"
              onConfirm={() => handleAdvance(row)}
            />
          ) : (
            <span className="text-xs text-[var(--ink-subtle)]">เสร็จสิ้นแล้ว</span>
          )}
          <Button size="sm" variant="ghost" className="h-8" onClick={() => openEditSheet(row)}>
            <Pencil className="size-3.5" aria-hidden />
            แก้ไข
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="ตารางเรียน"
        description="คาบเรียนของทุกรายวิชา เรียงตามวันที่ใกล้ที่สุดก่อน เพื่อให้เห็นสิ่งที่กำลังจะเกิดขึ้นในภาพเดียว"
        actions={
          <Button size="sm" onClick={openAddSheet}>
            <Plus className="size-4" aria-hidden />
            เพิ่มคาบเรียน
          </Button>
        }
      />

      <TableToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="ค้นหาหัวข้อ ผู้สอน หรือรายวิชา"
        filters={[
          {
            id: "subject",
            label: "รายวิชา",
            value: subjectFilter,
            onChange: setSubjectFilter,
            options: [{ value: ALL_FILTER_VALUE, label: "ทุกรายวิชา" }, ...subjectOptions],
          },
          { id: "status", label: "สถานะ", value: statusFilter, onChange: setStatusFilter, options: STATUS_FILTER_OPTIONS },
          { id: "mode", label: "รูปแบบ", value: modeFilter, onChange: setModeFilter, options: MODE_FILTER_OPTIONS },
        ]}
        resultSummary={`แสดง ${filtered.length} จาก ${sessions.length} คาบเรียน`}
        onReset={
          isFiltered
            ? () => {
                setSearch("");
                setSubjectFilter(ALL_FILTER_VALUE);
                setStatusFilter(ALL_FILTER_VALUE);
                setModeFilter(ALL_FILTER_VALUE);
              }
            : undefined
        }
      />

      <DataTable
        columns={columns}
        rows={filtered}
        rowKey={(row) => row.id}
        caption="ตารางคาบเรียนของทุกรายวิชา"
        empty={
          <EmptyState
            icon={CalendarClock}
            title={sessions.length === 0 ? "ยังไม่มีคาบเรียนในระบบ" : "ไม่พบคาบเรียนที่ตรงกับตัวกรอง"}
            description={
              sessions.length === 0
                ? "เพิ่มคาบเรียนแรกให้กับรายวิชาที่เปิดสอน เพื่อให้ผู้เรียนเห็นกำหนดการ"
                : "ลองล้างตัวกรองหรือค้นหาด้วยคำอื่น"
            }
          />
        }
      />

      <SessionSheet
        open={sheetOpen}
        mode={sheetState.mode}
        session={sheetState.session}
        subjectOptions={subjectOptions}
        onOpenChange={setSheetOpen}
        onSubmit={handleSubmitSession}
      />
    </>
  );
}
