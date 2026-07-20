import { MemberPageShell } from "@/components/member-page-shell";
import { ProgramsList } from "@/components/discovery/programs-list";

export default function MemberProgramsPage() {
  return (
    <MemberPageShell
      title="หลักสูตร"
      description="สำรวจหลักสูตรที่เปิดสอนในระบบ Credit Bank และใช้ประกอบการวางแผนเป้าหมายการเรียนรู้"
      currentNav="programs"
    >
      <ProgramsList showHeading={false} detailBasePath="/member/programs" />
    </MemberPageShell>
  );
}
