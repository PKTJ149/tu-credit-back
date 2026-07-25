import { notFound } from "next/navigation";
import { MemberPageShell } from "@/components/member-page-shell";
import { ProgramDetail } from "@/components/discovery/program-detail";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { programs } from "@/lib/data/programs";

type MemberProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MemberProgramDetailPage({ params }: MemberProgramDetailPageProps) {
  const { slug } = await params;
  const program = programs.find((p) => p.slug === slug);

  if (!program) {
    notFound();
  }

  return (
    <MemberPageShell
      title="รายละเอียดหลักสูตร"
      description="ตรวจสอบโครงสร้างหลักสูตร รายวิชา และขั้นตอนถัดไป"
      currentNav="programs"
      breadcrumb={
        <Breadcrumb
          items={[
            { label: "หลักสูตร", href: "/member/programs" },
            { label: program.name },
          ]}
        />
      }
    >
      <ProgramDetail
        program={program}
        mode="member"
        subjectDetailBasePath="/member/subjects"
      />
    </MemberPageShell>
  );
}
