import { MemberPageShell } from "@/components/member-page-shell";
import { SubjectsList } from "@/components/discovery/subjects-list";

export default function MemberSubjectsPage() {
  return (
    <MemberPageShell
      title="รายวิชา"
      description="ค้นหาและเปรียบเทียบรายวิชาที่เกี่ยวข้องกับเป้าหมายหลักสูตรก่อนดำเนินการลงทะเบียน"
      currentNav="subjects"
    >
      <SubjectsList showHeading={false} detailBasePath="/member/subjects" />
    </MemberPageShell>
  );
}
