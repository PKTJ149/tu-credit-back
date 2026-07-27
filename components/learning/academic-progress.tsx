"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  Award,
  BookOpenCheck,
  CalendarDays,
  FileCheck2,
  Filter,
  FolderOpen,
  GraduationCap,
  RotateCcw,
} from "lucide-react";

import { SectionCard } from "@/components/finance/section-card";
import { programs } from "@/lib/data/programs";
import { getSubjectsByIds, subjects } from "@/lib/data/subjects";
import { useSessionData, type LearnerRegistration } from "@/lib/session/session-data";

type ResultStatus = "completed" | "studying" | "waiting";

type CourseResult = {
  id: string;
  order: number;
  code: string;
  name: string;
  credits: number;
  result: "ผ่าน" | "กำลังเรียน" | "รอเรียน";
  grade: string;
  certificate?: boolean;
  status: ResultStatus;
};

type StandaloneCourseResult = CourseResult & {
  category: string;
  term: string;
  year: string;
};

type CategoryGroup = {
  category: string;
  status: ResultStatus;
  courses: CourseResult[];
};

type TermGroup = {
  year: string;
  term: string;
  groups: CategoryGroup[];
};

type ProgramResult = {
  id: string;
  name: string;
  credential: string;
  status: ResultStatus;
  completedCredits: number;
  totalCredits: number;
  completedCategories: number;
  totalCategories: number;
  gpa: string;
  terms: TermGroup[];
};

type FolderId = ProgramResult["id"] | "standalone";

const statusInfo: Record<ResultStatus, { label: string; className: string }> = {
  completed: {
    label: "จบแล้ว",
    className: "bg-green-50 text-green-700",
  },
  studying: {
    label: "กำลังเรียน",
    className:
      "bg-[color:color-mix(in_oklch,var(--ring)_24%,white)] text-[var(--foreground)]",
  },
  waiting: {
    label: "รอเรียน",
    className:
      "bg-[color:color-mix(in_oklch,var(--muted)_74%,white)] text-[var(--ink-subtle)]",
  },
};

const summaryTones = [
  {
    card: "bg-[color:color-mix(in_oklch,var(--primary)_8%,white)]",
    icon: "bg-[color:color-mix(in_oklch,var(--primary)_12%,white)] text-[var(--primary)]",
  },
  {
    card: "bg-[color:color-mix(in_oklch,var(--ring)_12%,white)]",
    icon: "bg-[color:color-mix(in_oklch,var(--ring)_18%,white)] text-[var(--foreground)]",
  },
  {
    card: "bg-green-50",
    icon: "bg-green-100 text-green-700",
  },
  {
    card: "bg-[color:color-mix(in_oklch,var(--secondary)_38%,white)]",
    icon: "bg-[color:color-mix(in_oklch,var(--secondary)_58%,white)] text-[var(--secondary-foreground)]",
  },
];

const statuses: Array<"ทั้งหมด" | ResultStatus> = [
  "ทั้งหมด",
  "completed",
  "studying",
  "waiting",
];

const gradePoints: Record<string, number> = {
  A: 4,
  "B+": 3.5,
  B: 3,
};

function StatusBadge({ status }: { status: ResultStatus }) {
  const info = statusInfo[status];
  return (
    <span
      className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${info.className}`}
    >
      {info.label}
    </span>
  );
}

function ResultTable({
  courses,
  showMeta = false,
}: {
  courses: Array<CourseResult | StandaloneCourseResult>;
  showMeta?: boolean;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-[var(--surface)] text-xs font-semibold text-[var(--ink-muted)]">
          <tr>
            <th className="w-14 px-4 py-3 text-left">ลำดับ</th>
            <th className="w-28 px-4 py-3 text-left">รหัสวิชา</th>
            <th className="px-4 py-3 text-left">ชื่อรายวิชา</th>
            {showMeta ? <th className="w-44 px-4 py-3 text-left">แฟ้ม/หมวด</th> : null}
            <th className="w-24 px-4 py-3 text-right">หน่วยกิต</th>
            <th className="w-28 px-4 py-3 text-left">ผลการเรียน</th>
            <th className="w-20 px-4 py-3 text-left">เกรด</th>
            <th className="w-28 px-4 py-3 text-left">ใบประกาศ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[color:var(--border)]">
          {courses.map((course) => (
            <tr key={course.id} className="bg-[var(--background)]">
              <td className="px-4 py-3 text-[var(--ink-muted)]">{course.order}</td>
              <td className="px-4 py-3 font-mono text-xs font-semibold text-[var(--foreground)]">
                {course.code}
              </td>
              <td className="px-4 py-3 font-medium text-[var(--foreground)]">
                {course.name}
              </td>
              {showMeta ? (
                <td className="px-4 py-3 text-xs leading-5 text-[var(--ink-muted)]">
                  {"category" in course ? (
                    <>
                      <span className="font-semibold text-[var(--foreground)]">
                        {course.category}
                      </span>
                      <br />
                      {course.term}
                    </>
                  ) : null}
                </td>
              ) : null}
              <td className="px-4 py-3 text-right font-mono text-[var(--foreground)]">
                {course.credits}
              </td>
              <td className="px-4 py-3 text-[var(--foreground)]">{course.result}</td>
              <td className="px-4 py-3 font-mono font-semibold text-[var(--primary)]">
                {course.grade}
              </td>
              <td className="px-4 py-3">
                {course.certificate ? (
                  <a
                    href="#"
                    className="font-semibold text-[var(--primary)] hover:underline focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
                  >
                    ดูใบประกาศ
                  </a>
                ) : (
                  <span className="text-[var(--ink-subtle)]">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function courseMatchesStatus(courses: CourseResult[], status: "ทั้งหมด" | ResultStatus) {
  return status === "ทั้งหมด" || courses.some((course) => course.status === status);
}

function getProgramCategories(program: ProgramResult) {
  return [
    "ทั้งหมด",
    ...Array.from(
      new Set(
        program.terms.flatMap((term) => term.groups.map((group) => group.category)),
      ),
    ),
  ];
}

function getStandaloneCategories(courses: StandaloneCourseResult[]) {
  return ["ทั้งหมด", ...Array.from(new Set(courses.map((course) => course.category)))];
}

function SummaryCard({
  label,
  value,
  detail,
  icon,
  toneIndex,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
  toneIndex: number;
}) {
  const tone = summaryTones[toneIndex % summaryTones.length];
  return (
    <div className={`flex min-h-36 flex-col rounded-lg border border-[color:var(--border)] p-4 ${tone.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex min-h-10 items-start text-sm font-semibold leading-5 text-[var(--foreground)]">
            {label}
          </p>
          <p className="mt-1 whitespace-nowrap font-mono text-xl font-semibold text-[var(--foreground)]">
            {value}
          </p>
        </div>
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone.icon}`}>
          {icon}
        </span>
      </div>
      <p className="mt-auto pt-3 text-xs leading-5 text-[var(--ink-muted)]">{detail}</p>
    </div>
  );
}

function getRegistrationYear(term: string) {
  return term.match(/\d{4}/)?.[0] ?? "2569";
}

function isPaidRegistration(registration: LearnerRegistration, payableState?: string) {
  return (
    registration.status === "active" ||
    registration.status === "completed" ||
    payableState === "payment-confirmed"
  );
}

function deriveCourseStatus(registration: LearnerRegistration, index: number): ResultStatus {
  if (registration.status === "completed") return "completed";
  if (registration.status === "active" && index === 0) return "completed";
  if (registration.status === "active" && index === 1) return "studying";
  return "waiting";
}

function deriveCourseGrade(status: ResultStatus, index: number) {
  if (status !== "completed") return "-";
  return ["A", "B+", "B"][index % 3] ?? "A";
}

function summarizeGpa(courses: CourseResult[]) {
  const gradedCourses = courses.filter((course) => course.grade !== "-");
  if (gradedCourses.length === 0) return "-";
  const weightedPoints = gradedCourses.reduce(
    (sum, course) => sum + (gradePoints[course.grade] ?? 0) * course.credits,
    0,
  );
  const credits = gradedCourses.reduce((sum, course) => sum + course.credits, 0);
  return (weightedPoints / credits).toFixed(2);
}

function summarizeGroupStatus(courses: CourseResult[]): ResultStatus {
  if (courses.every((course) => course.status === "completed")) return "completed";
  if (courses.some((course) => course.status === "studying")) return "studying";
  return "waiting";
}

function buildProgramResult(registration: LearnerRegistration): ProgramResult | null {
  const program = programs.find((item) => item.slug === registration.slug);
  if (!program) return null;

  const selectedSubjects = getSubjectsByIds(
    registration.selectedSubjectIds ?? program.subjectIds,
  );
  const courses = selectedSubjects.map((subject, index): CourseResult => {
    const status = deriveCourseStatus(registration, index);
    return {
      id: `${registration.id}-${subject.id}`,
      order: index + 1,
      code: subject.code ?? subject.id,
      name: subject.name,
      credits: subject.credits,
      result:
        status === "completed"
          ? "ผ่าน"
          : status === "studying"
            ? "กำลังเรียน"
            : "รอเรียน",
      grade: deriveCourseGrade(status, index),
      certificate: status === "completed",
      status,
    };
  });

  const categories = Array.from(
    new Set(selectedSubjects.map((subject) => subject.category ?? "รายวิชา")),
  );
  const groups = categories.map((category) => {
    const groupCourses = courses.filter((course) => {
      const source = selectedSubjects.find(
        (subject) => (subject.code ?? subject.id) === course.code,
      );
      return (source?.category ?? "รายวิชา") === category;
    });
    return {
      category,
      status: summarizeGroupStatus(groupCourses),
      courses: groupCourses,
    };
  });
  const completedCredits = courses
    .filter((course) => course.status === "completed")
    .reduce((sum, course) => sum + course.credits, 0);
  const completedCategories = groups.filter((group) => group.status === "completed").length;
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return {
    id: registration.id,
    name: registration.itemName,
    credential: program.level ?? "หลักสูตร",
    status: registration.status === "completed" ? "completed" : "studying",
    completedCredits,
    totalCredits,
    completedCategories,
    totalCategories: groups.length,
    gpa: summarizeGpa(courses),
    terms: [
      {
        year: getRegistrationYear(registration.term),
        term: registration.term,
        groups,
      },
    ],
  };
}

function buildStandaloneCourse(
  registration: LearnerRegistration,
  order: number,
): StandaloneCourseResult | null {
  const subject = subjects.find((item) => item.slug === registration.slug);
  if (!subject) return null;
  const status = registration.status === "completed" ? "completed" : "studying";

  return {
    id: registration.id,
    order,
    code: subject.code ?? subject.id,
    name: registration.itemName,
    credits: subject.credits,
    result: status === "completed" ? "ผ่าน" : "กำลังเรียน",
    grade: status === "completed" ? "A" : "-",
    certificate: status === "completed",
    status,
    category: subject.category ?? "รายวิชา",
    term: registration.term,
    year: getRegistrationYear(registration.term),
  };
}

export function AcademicProgress() {
  const { data } = useSessionData();
  const [activeFolderId, setActiveFolderId] = useState<FolderId>("");
  const [yearFilter, setYearFilter] = useState("ทั้งหมด");
  const [termFilter, setTermFilter] = useState("ทั้งหมด");
  const [categoryFilter, setCategoryFilter] = useState("ทั้งหมด");
  const [statusFilter, setStatusFilter] = useState<"ทั้งหมด" | ResultStatus>("ทั้งหมด");

  const paidRegistrations = useMemo(
    () =>
      data.registrations.filter((registration) => {
        const payable = data.payables.find((item) => item.id === registration.payableId);
        return isPaidRegistration(registration, payable?.state);
      }),
    [data.payables, data.registrations],
  );

  const programResults = useMemo(
    () =>
      paidRegistrations
        .filter((registration) => registration.itemType === "program")
        .map(buildProgramResult)
        .filter((program): program is ProgramResult => Boolean(program)),
    [paidRegistrations],
  );

  const standaloneCourses = useMemo(
    () =>
      paidRegistrations
        .filter((registration) => registration.itemType === "subject")
        .map(buildStandaloneCourse)
        .filter((course): course is StandaloneCourseResult => Boolean(course))
        .map((course, index) => ({ ...course, order: index + 1 })),
    [paidRegistrations],
  );

  const defaultFolderId = programResults[0]?.id ?? "standalone";
  const selectedFolderId =
    activeFolderId === "standalone" || programResults.some((program) => program.id === activeFolderId)
      ? activeFolderId
      : defaultFolderId;
  const activeProgram = programResults.find((program) => program.id === selectedFolderId);
  const activeIsStandalone = selectedFolderId === "standalone";
  const activeCategories = activeProgram
    ? getProgramCategories(activeProgram)
    : getStandaloneCategories(standaloneCourses);
  const availableYears = useMemo(
    () => [
      "ทั้งหมด",
      ...Array.from(
        new Set(
          activeProgram
            ? activeProgram.terms.map((term) => term.year)
            : standaloneCourses.map((course) => course.year),
        ),
      ),
    ],
    [activeProgram, standaloneCourses],
  );
  const availableTerms = useMemo(
    () => [
      "ทั้งหมด",
      ...Array.from(
        new Set(
          activeProgram
            ? activeProgram.terms.map((term) => term.term)
            : standaloneCourses.map((course) => course.term),
        ),
      ),
    ],
    [activeProgram, standaloneCourses],
  );

  const filteredProgramTerms = useMemo(() => {
    if (!activeProgram) return [];
    return activeProgram.terms
      .filter((term) => yearFilter === "ทั้งหมด" || term.year === yearFilter)
      .filter((term) => termFilter === "ทั้งหมด" || term.term === termFilter)
      .map((term) => ({
        ...term,
        groups: term.groups
          .filter(
            (group) => categoryFilter === "ทั้งหมด" || group.category === categoryFilter,
          )
          .filter((group) => courseMatchesStatus(group.courses, statusFilter)),
      }))
      .filter((term) => term.groups.length > 0);
  }, [activeProgram, categoryFilter, statusFilter, termFilter, yearFilter]);

  const filteredStandalone = useMemo(
    () =>
      standaloneCourses
        .filter((course) => yearFilter === "ทั้งหมด" || course.year === yearFilter)
        .filter((course) => termFilter === "ทั้งหมด" || course.term === termFilter)
        .filter(
          (course) => categoryFilter === "ทั้งหมด" || course.category === categoryFilter,
        )
        .filter((course) => statusFilter === "ทั้งหมด" || course.status === statusFilter),
    [categoryFilter, standaloneCourses, statusFilter, termFilter, yearFilter],
  );

  function selectFolder(folderId: FolderId) {
    setActiveFolderId(folderId);
    setYearFilter("ทั้งหมด");
    setTermFilter("ทั้งหมด");
    setCategoryFilter("ทั้งหมด");
    setStatusFilter("ทั้งหมด");
  }

  function resetFilters() {
    setYearFilter("ทั้งหมด");
    setTermFilter("ทั้งหมด");
    setCategoryFilter("ทั้งหมด");
    setStatusFilter("ทั้งหมด");
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-2">
        <div className="flex gap-2 overflow-x-auto">
          {programResults.map((program) => (
            <FolderTab
              key={program.id}
              active={selectedFolderId === program.id}
              label={program.name}
              meta={`${program.completedCredits}/${program.totalCredits} หน่วยกิต`}
              status={program.status}
              onClick={() => selectFolder(program.id)}
            />
          ))}
          <FolderTab
            active={selectedFolderId === "standalone"}
            label="รายวิชาเดี่ยว"
            meta={`${standaloneCourses.length} รายวิชา`}
            status={standaloneCourses.some((course) => course.status === "studying") ? "studying" : "completed"}
            onClick={() => selectFolder("standalone")}
          />
        </div>
      </div>

      {activeProgram ? (
        <ProgramFolderDashboard program={activeProgram} />
      ) : (
        <StandaloneFolderDashboard courses={standaloneCourses} />
      )}

      <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Filter aria-hidden="true" className="h-4 w-4 text-[var(--primary)]" />
            <h2 className="text-base font-semibold text-[var(--foreground)]">
              ตัวกรองข้อมูล
            </h2>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[color:var(--border)] bg-[var(--background)] px-3 text-sm font-semibold text-[var(--foreground)] hover:border-[color:var(--ring)] hover:bg-[var(--surface)] focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)]"
          >
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            ล้างตัวกรอง
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <FilterSelect label="ปีการศึกษา" value={yearFilter} onChange={setYearFilter} options={availableYears.length > 1 ? availableYears : ["ทั้งหมด"]} />
          <FilterSelect label="ภาคการศึกษา" value={termFilter} onChange={setTermFilter} options={availableTerms.length > 1 ? availableTerms : ["ทั้งหมด"]} />
          <FilterSelect label="หมวดวิชา" value={categoryFilter} onChange={setCategoryFilter} options={activeCategories} />
          <FilterSelect
            label="สถานะ"
            value={statusFilter}
            onChange={(value) => setStatusFilter(value as "ทั้งหมด" | ResultStatus)}
            options={statuses.map((status) =>
              status === "ทั้งหมด" ? status : statusInfo[status].label,
            )}
            optionValues={statuses}
          />
        </div>
      </section>

      {activeIsStandalone ? (
        <StandaloneFolderDetail courses={filteredStandalone} />
      ) : (
        <ProgramFolderDetail terms={filteredProgramTerms} />
      )}
    </div>
  );
}

function FolderTab({
  active,
  label,
  meta,
  status,
  onClick,
}: {
  active: boolean;
  label: string;
  meta: string;
  status: ResultStatus;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-w-64 shrink-0 rounded-lg border px-4 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-[var(--focus-ring)] ${
        active
          ? "border-[var(--primary)] bg-[color:color-mix(in_oklch,var(--primary)_7%,white)]"
          : "border-transparent text-[var(--ink-muted)] hover:bg-[var(--surface)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <FolderOpen
          aria-hidden="true"
          className={`mt-0.5 h-5 w-5 shrink-0 ${active ? "text-[var(--primary)]" : ""}`}
        />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 text-sm font-semibold text-[var(--foreground)]">
            {label}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-xs text-[var(--ink-muted)]">{meta}</span>
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
    </button>
  );
}

function ProgramFolderDashboard({ program }: { program: ProgramResult }) {
  return (
    <SectionCard
      title="สรุปผลการเรียน"
      description={`แฟ้มผลการเรียนของ ${program.name}`}
    >
      <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="หน่วยกิตสะสม"
          value={`${program.completedCredits} หน่วยกิต`}
          detail={`จากทั้งหมด ${program.totalCredits} หน่วยกิตในหลักสูตรนี้`}
          icon={<BookOpenCheck aria-hidden="true" className="h-5 w-5" />}
          toneIndex={0}
        />
        <SummaryCard
          label="GPA เฉพาะหลักสูตร"
          value={program.gpa}
          detail="คำนวณเฉพาะรายวิชาในหลักสูตรนี้"
          icon={<Award aria-hidden="true" className="h-5 w-5" />}
          toneIndex={1}
        />
        <SummaryCard
          label="หมวดวิชาที่ผ่านแล้ว"
          value={`${program.completedCategories} หมวด`}
          detail={`จากทั้งหมด ${program.totalCategories} หมวดวิชา`}
          icon={<GraduationCap aria-hidden="true" className="h-5 w-5" />}
          toneIndex={2}
        />
        <SummaryCard
          label="สถานะหลักสูตร"
          value={statusInfo[program.status].label}
          detail={program.credential}
          icon={<CalendarDays aria-hidden="true" className="h-5 w-5" />}
          toneIndex={3}
        />
      </div>
    </SectionCard>
  );
}

function StandaloneFolderDashboard({ courses }: { courses: StandaloneCourseResult[] }) {
  const completedCourses = courses.filter((course) => course.status === "completed");
  const studyingCourses = courses.filter((course) => course.status === "studying");
  const completedCredits = completedCourses.reduce((sum, course) => sum + course.credits, 0);
  const certificates = courses.filter((course) => course.certificate).length;

  return (
    <SectionCard
      title="สรุปผลรายวิชาเดี่ยว"
      description="แฟ้มรายวิชาที่ไม่ได้ผูกกับหลักสูตรใดหลักสูตรหนึ่ง"
    >
      <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="หน่วยกิตที่รับรองแล้ว"
          value={`${completedCredits} หน่วยกิต`}
          detail="นับเฉพาะรายวิชาที่ผ่านแล้ว"
          icon={<BookOpenCheck aria-hidden="true" className="h-5 w-5" />}
          toneIndex={0}
        />
        <SummaryCard
          label="รายวิชาที่เรียนจบ"
          value={`${completedCourses.length} รายวิชา`}
          detail={`จากทั้งหมด ${courses.length} รายวิชาเดี่ยว`}
          icon={<Award aria-hidden="true" className="h-5 w-5" />}
          toneIndex={1}
        />
        <SummaryCard
          label="รายวิชาที่กำลังเรียน"
          value={`${studyingCourses.length} รายวิชา`}
          detail="ติดตามความคืบหน้าแยกจากหลักสูตร"
          icon={<GraduationCap aria-hidden="true" className="h-5 w-5" />}
          toneIndex={2}
        />
        <SummaryCard
          label="ใบประกาศที่ได้รับ"
          value={`${certificates} ใบ`}
          detail="จากรายวิชาเดี่ยวที่เรียนผ่านแล้ว"
          icon={<FileCheck2 aria-hidden="true" className="h-5 w-5" />}
          toneIndex={3}
        />
      </div>
    </SectionCard>
  );
}

function ProgramFolderDetail({ terms }: { terms: TermGroup[] }) {
  return (
    <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
      <div className="border-b border-[color:var(--border)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          รายละเอียดผลการเรียนในแฟ้มนี้
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
          แสดงตามภาคเรียนและหมวดวิชา เพื่อให้เห็นว่าแต่ละวิชาอยู่ในส่วนใดของหลักสูตร
        </p>
      </div>
      <div className="space-y-5 p-5 sm:p-6">
        {terms.length > 0 ? (
          terms.map((term) => (
            <div key={term.term} className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-[var(--foreground)]">{term.term}</p>
                <p className="mt-1 text-xs text-[var(--ink-subtle)]">
                  ปีการศึกษา {term.year}
                </p>
              </div>

              {term.groups.map((group) => {
                const credits = group.courses.reduce(
                  (sum, course) => sum + course.credits,
                  0,
                );
                return (
                  <div
                    key={`${term.term}-${group.category}`}
                    className="overflow-hidden rounded-lg border border-[color:var(--border)]"
                  >
                    <div className="flex flex-col gap-3 bg-[color:color-mix(in_oklch,var(--ring)_10%,white)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[var(--foreground)]">
                          {group.category}
                        </p>
                        <p className="mt-1 text-xs text-[var(--ink-muted)]">
                          {credits} หน่วยกิต · {group.courses.length} รายวิชา
                        </p>
                      </div>
                      <StatusBadge status={group.status} />
                    </div>
                    <ResultTable courses={group.courses} />
                  </div>
                );
              })}
            </div>
          ))
        ) : (
          <EmptyAcademicState />
        )}
      </div>
    </section>
  );
}

function StandaloneFolderDetail({ courses }: { courses: StandaloneCourseResult[] }) {
  return (
    <section className="rounded-xl border border-[color:var(--border)] bg-[var(--background)]">
      <div className="border-b border-[color:var(--border)] p-5 sm:p-6">
        <h2 className="text-base font-semibold text-[var(--foreground)]">
          รายวิชาที่ลงทะเบียนแยก
        </h2>
        <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
          รายวิชาเดี่ยวแสดงเป็นตารางเดียว เพราะไม่ได้มีโครงภาคเรียนและหมวดวิชาของหลักสูตรครอบอยู่
        </p>
      </div>
      <div className="p-5 sm:p-6">
        {courses.length > 0 ? (
          <ResultTable courses={courses} showMeta />
        ) : (
          <EmptyAcademicState />
        )}
      </div>
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  optionValues,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  optionValues?: string[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-[var(--foreground)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="ui-input mt-2"
      >
        {options.map((option, index) => (
          <option key={optionValues?.[index] ?? option} value={optionValues?.[index] ?? option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function EmptyAcademicState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-[color:var(--border)] px-6 py-10 text-center">
      <GraduationCap aria-hidden="true" className="h-8 w-8 text-[var(--ink-subtle)]" />
      <p className="text-sm leading-7 text-[var(--ink-muted)]">
        ไม่พบผลการเรียนตามตัวกรองที่เลือก
      </p>
    </div>
  );
}
