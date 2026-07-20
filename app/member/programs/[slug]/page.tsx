import { MemberPageShell } from "@/components/member-page-shell";
import { ProgramDetail } from "@/components/discovery/program-detail";
import type { Subject } from "@/lib/discovery/types";

const relatedSubjects: Subject[] = [
  {
    id: "s1",
    slug: "intro-programming",
    name: "การเขียนโปรแกรมเบื้องต้น",
    credits: 3,
    faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
    summary: "พื้นฐานการเขียนโปรแกรมสำหรับผู้เริ่มต้น",
  },
  {
    id: "s4",
    slug: "data-structures",
    name: "โครงสร้างข้อมูลและอัลกอริทึม",
    credits: 3,
    faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
    summary: "หลักการจัดการข้อมูลและอัลกอริทึมพื้นฐาน",
  },
];

const mockProgram = {
  name: "หลักสูตรประกาศนียบัตรการพัฒนาซอฟต์แวร์",
  overview:
    "หลักสูตรนี้ออกแบบมาสำหรับผู้ที่ต้องการพัฒนาทักษะการเขียนโปรแกรมและพัฒนาซอฟต์แวร์อย่างเป็นระบบ ครอบคลุมตั้งแต่พื้นฐานการเขียนโปรแกรมไปจนถึงการพัฒนาแอปพลิเคชันจริง",
  credits: "18 หน่วยกิต",
  requirementsHeading: "คุณสมบัติผู้เรียน",
  requirementsBody:
    "เปิดรับทั้งนักศึกษาปัจจุบันและผู้เรียนภายนอกที่มีพื้นฐานการใช้คอมพิวเตอร์เบื้องต้น",
  outcomesHeading: "สิ่งที่จะได้รับ",
  outcomes: [
    "ทักษะการเขียนโปรแกรมที่นำไปใช้งานจริงได้",
    "ความเข้าใจหลักการพัฒนาซอฟต์แวร์อย่างเป็นระบบ",
    "ผลงานที่สามารถนำไปใช้ประกอบพอร์ตโฟลิโอ",
  ],
  relatedSubjectsHeading: "รายวิชาที่เกี่ยวข้อง",
  relatedSubjects,
  ctaLine: "เริ่มต้นใช้งานเพื่อดำเนินการลงทะเบียน",
};

type MemberProgramDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function MemberProgramDetailPage({ params }: MemberProgramDetailPageProps) {
  await params;

  return (
    <MemberPageShell
      title="รายละเอียดหลักสูตร"
      description="ตรวจสอบโครงสร้างหลักสูตร รายวิชาที่เกี่ยวข้อง และขั้นตอนถัดไป"
      currentNav="programs"
    >
      <ProgramDetail
        program={mockProgram}
        mode="member"
        subjectDetailBasePath="/member/subjects"
      />
    </MemberPageShell>
  );
}
