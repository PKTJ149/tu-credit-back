import { notFound } from "next/navigation";
import { PublicPageShell } from "@/components/public-page-shell";
import { Breadcrumb, type BreadcrumbItem } from "@/components/ui/breadcrumb";
import { ProgramCard } from "@/components/discovery/program-card";
import { SubjectCard } from "@/components/discovery/subject-card";
import { findTeacherById } from "@/lib/data/teachers";
import { findProgramsByTeacherId, programs } from "@/lib/data/programs";
import { findSubjectsByTeacherId, subjects } from "@/lib/data/subjects";
import { getTeacherInitial } from "@/lib/discovery/teacher-utils";

type TeacherDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
};

function getBreadcrumbItems(from: string | undefined, teacherName: string): BreadcrumbItem[] {
  const [kind, slug] = from?.split(":") ?? [];

  if (kind === "program" && slug) {
    const program = programs.find((p) => p.slug === slug);
    if (program) {
      return [
        { label: "หลักสูตร", href: "/programs" },
        { label: program.name, href: `/programs/${program.slug}` },
        { label: teacherName },
      ];
    }
  }

  if (kind === "subject" && slug) {
    const subject = subjects.find((s) => s.slug === slug);
    if (subject) {
      return [
        { label: "รายวิชา", href: "/subjects" },
        { label: subject.name, href: `/subjects/${subject.slug}` },
        { label: teacherName },
      ];
    }
  }

  return [{ label: "ผู้สอน" }, { label: teacherName }];
}

export default async function TeacherDetailPage({ params, searchParams }: TeacherDetailPageProps) {
  const { id } = await params;
  const { from } = await searchParams;
  const teacher = findTeacherById(id);

  if (!teacher) {
    notFound();
  }

  const teachingPrograms = findProgramsByTeacherId(id);
  const teachingSubjects = findSubjectsByTeacherId(id);
  const bioItems = [...(teacher.educationHistory ?? []), ...(teacher.workingHistory ?? [])];

  return (
    <PublicPageShell showBreadcrumb={false}>
      <div className="mb-6">
        <Breadcrumb items={getBreadcrumbItems(from, teacher.name)} />
      </div>

      <div className="flex flex-col gap-10">
        {/* Name + position + brief history */}
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <div
              aria-hidden="true"
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[color:color-mix(in_oklch,var(--secondary)_20%,white)] text-3xl font-bold text-[var(--secondary-foreground)]"
            >
              {getTeacherInitial(teacher.name)}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-[color:var(--secondary-foreground)] sm:text-3xl">
                {teacher.name}
              </h1>
              {teacher.title && (
                <p className="mt-1 text-base text-[var(--ink-muted)]">{teacher.title}</p>
              )}
            </div>
          </div>

          {bioItems.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-[color:var(--secondary-foreground)]">
                ประวัติโดยย่อ
              </h2>
              <ul className="flex flex-col gap-2">
                {bioItems.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-6 text-[var(--foreground)]">
                    <span aria-hidden="true" className="text-[var(--ink-subtle)]">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Programs they teach — shown as program cards */}
        {teachingPrograms.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">หลักสูตรที่สอน</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {teachingPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} canSave={false} />
              ))}
            </div>
          </section>
        )}

        {/* Subjects they teach — shown as subject cards */}
        {teachingSubjects.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">รายวิชาที่สอน</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {teachingSubjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} canSave={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PublicPageShell>
  );
}
