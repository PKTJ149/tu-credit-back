import { MemberPageShell } from "@/components/member-page-shell";
import { SubjectDetail } from "@/components/discovery/subject-detail";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import type { Subject } from "@/lib/discovery/types";

const mockSubject: Subject = {
  id: "s1",
  slug: "intro-programming",
  name: "การเขียนโปรแกรมเบื้องต้น",
  nameEn: "Introduction to Programming",
  code: "CS201",
  category: "หมวดวิชาแกน",
  credits: 3,
  faculty: "คณะวิทยาการเรียนรู้และศึกษาศาสตร์",
  summary: "พื้นฐานการเขียนโปรแกรมด้วยภาษา Python สำหรับผู้เริ่มต้น ครอบคลุมตรรกะพื้นฐาน โครงสร้างควบคุม และการแก้ปัญหาด้วยโปรแกรมคอมพิวเตอร์",
  description:
    "รายวิชานี้ออกแบบมาสำหรับผู้ที่ไม่มีพื้นฐานการเขียนโปรแกรมมาก่อน เรียนรู้การเขียนโปรแกรมด้วยภาษา Python ตั้งแต่ระดับพื้นฐาน ฝึกคิดเชิงตรรกะ และแก้ปัญหาด้วยโปรแกรม พร้อมโปรเจกต์จริงปิดรายวิชา",
  price: 1500,
  studyMode: "hybrid",
  startDate: "1 ส.ค. 2568",
  endDate: "31 ต.ค. 2568",
  seats: 30,
  enrolledCount: 18,
  status: "open",
  teachers: ["ผศ.ดร. สมชาย ใจดี", "อ. ประสิทธิ์ เกิดผล"],
  outcomes: [
    "เขียนโปรแกรม Python เบื้องต้นได้อย่างมั่นใจ",
    "เข้าใจหลักการคิดเชิงตรรกะและการแก้ปัญหา",
    "สร้างโปรเจกต์ขนาดเล็กด้วยตนเองได้",
    "มีพื้นฐานสำหรับการเรียนรู้รายวิชาขั้นสูงต่อไป",
  ],
  qualification:
    "ไม่จำเป็นต้องมีพื้นฐานการเขียนโปรแกรมมาก่อน เหมาะสำหรับนักศึกษาและผู้เรียนภายนอกทุกระดับที่มีพื้นฐานการใช้คอมพิวเตอร์เบื้องต้น",
  scheduleItems: [
    { date: "5 ส.ค. 2568", topic: "แนะนำภาษา Python และการติดตั้ง", teacher: "ผศ.ดร. สมชาย ใจดี", status: "completed" },
    { date: "12 ส.ค. 2568", topic: "ตัวแปร ชนิดข้อมูล และ Operators", teacher: "ผศ.ดร. สมชาย ใจดี", status: "completed" },
    { date: "19 ส.ค. 2568", topic: "โครงสร้างควบคุม (if / loops)", teacher: "อ. ประสิทธิ์ เกิดผล", status: "ongoing" },
    { date: "26 ส.ค. 2568", topic: "ฟังก์ชันและการจัดการโมดูล", teacher: "อ. ประสิทธิ์ เกิดผล", status: "upcoming" },
    { date: "2 ก.ย. 2568", topic: "การทำงานกับไฟล์และข้อมูล", teacher: "ผศ.ดร. สมชาย ใจดี", status: "upcoming" },
    { date: "9 ก.ย. 2568", topic: "นำเสนอโปรเจกต์จบรายวิชา", teacher: "ผศ.ดร. สมชาย ใจดี", status: "upcoming" },
  ],
};

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
      breadcrumb={
        <Breadcrumb
          items={[
            { label: "รายวิชา", href: "/member/subjects" },
            { label: mockSubject.name },
          ]}
        />
      }
    >
      <SubjectDetail subject={mockSubject} mode="member" />
    </MemberPageShell>
  );
}
