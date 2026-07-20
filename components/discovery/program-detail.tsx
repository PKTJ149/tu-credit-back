import Link from "next/link";
import { GraduationCap, CheckCircle2 } from "lucide-react";
import type { Subject } from "@/lib/discovery/types";
import { SubjectCard } from "@/components/discovery/subject-card";

type ProgramDetailData = {
  name: string;
  overview: string;
  credits: string;
  requirementsHeading: string;
  requirementsBody: string;
  outcomesHeading: string;
  outcomes: string[];
  relatedSubjectsHeading: string;
  relatedSubjects: Subject[];
  ctaLine: string;
};

type ProgramDetailProps = {
  program: ProgramDetailData;
  mode?: "public" | "member";
  subjectDetailBasePath?: string;
};

export function ProgramDetail({
  program,
  mode = "public",
  subjectDetailBasePath = "/subjects",
}: ProgramDetailProps) {
  const isMember = mode === "member";

  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-10">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[color:color-mix(in_oklch,var(--secondary)_30%,white)] text-[var(--secondary-foreground)]">
            <GraduationCap aria-hidden="true" className="h-5 w-5" />
          </div>
          <p className="font-mono text-xs font-medium text-[var(--ink-subtle)]">
            {program.credits}
          </p>
        </div>

        <h1 className="text-2xl font-semibold leading-tight text-[var(--foreground)] sm:text-3xl">
          {program.name}
        </h1>

        <p className="text-base leading-7 text-[var(--ink-muted)]">{program.overview}</p>
      </header>

      <section
        aria-labelledby="program-requirements-heading"
        className="flex flex-col gap-2 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6"
      >
        <h2
          id="program-requirements-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          {program.requirementsHeading}
        </h2>
        <p className="text-sm leading-6 text-[var(--ink-muted)]">{program.requirementsBody}</p>
      </section>

      <section
        aria-labelledby="program-outcomes-heading"
        className="flex flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6"
      >
        <h2
          id="program-outcomes-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          {program.outcomesHeading}
        </h2>
        <ul className="flex flex-col gap-3">
          {program.outcomes.map((outcome) => (
            <li key={outcome} className="flex items-start gap-3">
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-[var(--secondary-foreground)]"
              />
              <span className="text-sm leading-6 text-[var(--ink-muted)]">{outcome}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="program-related-subjects-heading" className="flex flex-col gap-4">
        <h2
          id="program-related-subjects-heading"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          {program.relatedSubjectsHeading}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {program.relatedSubjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              subject={subject}
              detailBasePath={subjectDetailBasePath}
            />
          ))}
        </div>
      </section>

      <section
        aria-label="เริ่มต้นใช้งาน"
        className="flex flex-col gap-4 rounded-xl border border-[color:var(--border)] bg-[var(--background)] p-6"
      >
        <p className="text-sm font-medium text-[var(--foreground)]">
          {isMember ? "เลือกขั้นตอนถัดไปสำหรับหลักสูตรนี้" : program.ctaLine}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={isMember ? "/registrations" : "/register"}
            className="ui-button-primary h-11 px-5 text-sm sm:flex-1"
          >
            {isMember ? "ไปที่การลงทะเบียน" : "สมัครสมาชิก"}
          </Link>
          <Link
            href={isMember ? "/learning" : "/login"}
            className="ui-button-secondary h-11 px-5 text-sm sm:flex-1"
          >
            {isMember ? "กลับไปเป้าหมายการเรียนรู้" : "เข้าสู่ระบบ"}
          </Link>
        </div>
      </section>
    </article>
  );
}
