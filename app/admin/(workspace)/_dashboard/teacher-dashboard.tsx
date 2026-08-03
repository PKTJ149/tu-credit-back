import Link from "next/link";
import { ArrowRight, BookOpen, CalendarClock, Info, MapPin, PartyPopper, Video } from "lucide-react";

import { PageHeader } from "@/components/admin/page-header";
import { Panel } from "@/components/admin/detail-panel";
import { DataTable, type Column } from "@/components/admin/data-table";
import { EmptyState } from "@/components/admin/empty-state";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getStudentName } from "@/lib/admin/mock-data";
import { subjectEnrolment } from "@/lib/admin/mock-academic";
import type { ScheduleSession } from "@/lib/admin/mock-schedule";
import { getTeacherSubjects, getTeacherUngradedCompletions, getTeacherUpcomingSessions } from "@/lib/admin/mock-dashboard";
import type { AdminRegistration, StaffUser } from "@/lib/admin/types";
import type { Subject } from "@/lib/discovery/types";
import { Reveal } from "@/components/admin/motion";

const linkClass =
  "inline-flex w-fit items-center gap-1 rounded text-sm font-medium text-[var(--primary)] transition-colors hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

function PanelLink({ href, children }: { href: string; children: string }) {
  return (
    <Link href={href} className={linkClass}>
      {children}
      <ArrowRight className="size-3.5" aria-hidden />
    </Link>
  );
}

type SubjectRow = Subject & { enrolled: number; enrolledIsDerived: boolean };

/**
 * The teacher view: only what belongs to this teacher. Subjects are resolved
 * through `staff.teacherId` — direct assignment on the subject, plus any
 * subject reached through a program this teacher is assigned to (see
 * `getTeacherSubjectIds` in `mock-dashboard.ts`). No money, no
 * institution-wide registration counts, and no other teacher's subjects
 * appear anywhere below.
 */
export function TeacherDashboard({ staff }: { staff: StaffUser }) {
  if (!staff.teacherId) {
    return (
      <>
        <PageHeader title={`สวัสดี ${staff.name}`} />
        <Panel>
          <EmptyState
            icon={BookOpen}
            title="ยังไม่ได้เชื่อมโยงกับบัญชีอาจารย์"
            description="บัญชีนี้ยังไม่ได้ผูกกับข้อมูลอาจารย์ท่านใด ติดต่อผู้ดูแลระบบเพื่อเชื่อมโยงบัญชี"
          />
        </Panel>
      </>
    );
  }

  const mySubjects = getTeacherSubjects(staff.teacherId);
  const upcomingSessions = getTeacherUpcomingSessions(staff.teacherId);
  const ungradedCompletions = getTeacherUngradedCompletions(staff.teacherId);

  const subjectRows: SubjectRow[] = mySubjects.map((s) => {
    const { enrolled, isDerived } = subjectEnrolment(s);
    return { ...s, enrolled, enrolledIsDerived: isDerived };
  });

  const headline =
    mySubjects.length === 0
      ? "ยังไม่มีรายวิชาที่มอบหมายให้คุณ"
      : `คุณดูแล ${mySubjects.length} รายวิชา · คาบเรียนที่จะถึง ${upcomingSessions.length} คาบ`;

  const sessionColumns: Column<ScheduleSession>[] = [
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
      header: "รายวิชา",
      truncate: "max-w-[24ch]",
      cell: (row) => (
        <div className="min-w-0 space-y-0.5">
          <p className="truncate font-medium">{row.subjectName}</p>
          {row.subjectCode ? <p className="text-xs text-[var(--ink-subtle)]">{row.subjectCode}</p> : null}
        </div>
      ),
    },
    { key: "topic", header: "หัวข้อ", truncate: "max-w-[28ch]", cell: (row) => row.topic },
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
  ];

  const subjectColumns: Column<SubjectRow>[] = [
    { key: "code", header: "รหัสวิชา", width: "w-24", cell: (s) => <span className="font-mono">{s.code ?? "—"}</span> },
    { key: "name", header: "รายวิชา", truncate: "max-w-[30ch]", cell: (s) => <span className="font-medium">{s.name}</span> },
    {
      key: "enrolled",
      header: "ลงทะเบียนแล้ว",
      align: "end",
      width: "w-36",
      cell: (s) => (
        <span className="inline-flex items-center justify-end gap-1 font-mono tabular-nums">
          {s.enrolled}
          {typeof s.seats === "number" ? ` / ${s.seats}` : ""}
          {s.enrolledIsDerived ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="inline-flex text-[var(--ink-subtle)]">
                  <Info className="size-3.5" aria-hidden />
                  <span className="sr-only">คำนวณจากการลงทะเบียน ไม่ใช่ตัวเลขที่บันทึกไว้โดยตรง</span>
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-64 text-pretty">
                รายวิชานี้ไม่มีจำนวนผู้ลงทะเบียนบันทึกไว้โดยตรง ตัวเลขนี้คำนวณจากรายการลงทะเบียนจริงที่มีอยู่ในระบบแทน
              </TooltipContent>
            </Tooltip>
          ) : null}
        </span>
      ),
    },
  ];

  const gradeColumns: Column<AdminRegistration>[] = [
    { key: "student", header: "ผู้เรียน", cell: (r) => getStudentName(r.studentId) },
    { key: "item", header: "รายการ", truncate: "max-w-[26ch]", cell: (r) => r.itemName },
    { key: "term", header: "ภาคการศึกษา", align: "end", width: "w-32", hideOnMobile: true, cell: (r) => r.term },
  ];

  return (
    <TooltipProvider>
      <PageHeader title={`สวัสดี ${staff.name}`} description={headline} />

      <Reveal index={0}>
      <Panel title="คาบเรียนที่จะถึง" description="คาบเรียนของรายวิชาที่คุณสอน เรียงตามวันที่ใกล้ที่สุดก่อน" flush>
        <DataTable
          columns={sessionColumns}
          rows={upcomingSessions}
          rowKey={(row) => row.id}
          caption="คาบเรียนที่จะถึงของรายวิชาที่คุณสอน"
          empty={
            <EmptyState
              icon={CalendarClock}
              title="ไม่มีคาบเรียนที่จะถึง"
              description="รายวิชาของคุณไม่มีคาบเรียนที่กำลังดำเนินการหรือรอสอนอยู่ในขณะนี้"
            />
          }
        />
        <div className="border-t border-[var(--border)] px-5 py-3">
          <PanelLink href="/admin/schedule">ไปที่ตารางเรียนทั้งหมด</PanelLink>
        </div>
      </Panel>
      </Reveal>

      <Reveal index={1}>
      <Panel title="รายวิชาที่คุณสอน" description="จำนวนผู้ลงทะเบียนของแต่ละรายวิชาที่มอบหมายให้คุณ" flush>
        <DataTable
          columns={subjectColumns}
          rows={subjectRows}
          rowKey={(s) => s.id}
          rowHref={(s) => `/admin/subjects/${s.id}`}
          caption="รายวิชาที่คุณสอนพร้อมจำนวนผู้ลงทะเบียน"
          empty={
            <EmptyState
              icon={BookOpen}
              title="ยังไม่มีรายวิชาที่มอบหมายให้คุณ"
              description="รายวิชาจะปรากฏที่นี่เมื่อมีการมอบหมายให้คุณเป็นผู้สอน"
            />
          }
        />
      </Panel>
      </Reveal>

      <Reveal index={2}>
      <Panel
        title="ผลการเรียนที่ยังไม่บันทึก"
        description="ผู้เรียนที่เรียนจบรายวิชาของคุณแล้วแต่ยังไม่มีการบันทึกผลการเรียน"
        flush
      >
        <DataTable
          columns={gradeColumns}
          rows={ungradedCompletions}
          rowKey={(r) => r.id}
          caption="ผลการเรียนที่ยังไม่ได้บันทึกในรายวิชาที่คุณสอน"
          empty={
            <EmptyState
              icon={PartyPopper}
              title="ไม่มีผลการเรียนค้างบันทึก"
              description="ผู้เรียนที่เรียนจบรายวิชาของคุณทุกคนมีผลการเรียนบันทึกครบแล้ว"
            />
          }
        />
        <div className="border-t border-[var(--border)] px-5 py-3">
          <PanelLink href="/admin/grades">ไปที่หน้าบันทึกผลการเรียน</PanelLink>
        </div>
      </Panel>
      </Reveal>
    </TooltipProvider>
  );
}
