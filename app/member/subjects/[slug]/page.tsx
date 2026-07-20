import { MemberPageShell } from "@/components/member-page-shell";
import { SubjectDetail } from "@/components/discovery/subject-detail";

type MemberSubjectDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MemberSubjectDetailPage({ params }: MemberSubjectDetailPageProps) {
  await params;

  return (
    <MemberPageShell
      title="รายละเอียดรายวิชา"
      description="ตรวจสอบข้อมูลรายวิชา ความเกี่ยวข้องกับหลักสูตร และขั้นตอนถัดไป"
      currentNav="subjects"
    >
      <SubjectDetail mode="member" programDetailBasePath="/member/programs" />
    </MemberPageShell>
  );
}
