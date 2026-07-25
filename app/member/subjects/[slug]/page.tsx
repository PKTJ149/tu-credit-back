import { notFound } from "next/navigation";
import { MemberPageShell } from "@/components/member-page-shell";
import { SubjectDetail } from "@/components/discovery/subject-detail";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { subjects } from "@/lib/data/subjects";

type MemberSubjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MemberSubjectDetailPage({ params }: MemberSubjectDetailPageProps) {
  const { slug } = await params;
  const subject = subjects.find((s) => s.slug === slug);

  if (!subject) {
    notFound();
  }

  return (
    <MemberPageShell
      title="รายละเอียดรายวิชา"
      description="ตรวจสอบข้อมูลรายวิชา ความเกี่ยวข้องกับหลักสูตร และขั้นตอนถัดไป"
      currentNav="subjects"
      breadcrumb={
        <Breadcrumb
          items={[
            { label: "รายวิชา", href: "/member/subjects" },
            { label: subject.name },
          ]}
        />
      }
    >
      <SubjectDetail subject={subject} mode="member" />
    </MemberPageShell>
  );
}
